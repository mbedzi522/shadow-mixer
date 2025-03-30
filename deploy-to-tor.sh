
#!/bin/bash

# ShadowMixer Tor Deployment Script
# This script helps deploy the ShadowMixer application to a Tor hidden service

echo "ShadowMixer Tor Deployment Script"
echo "=================================="

# Check if Tor is installed
if ! command -v tor &> /dev/null; then
    echo "Error: Tor is not installed. Please install Tor first."
    echo "On Debian/Ubuntu: sudo apt install tor"
    exit 1
fi

# Build the application
echo "Building ShadowMixer application..."
npm run build

if [ $? -ne 0 ]; then
    echo "Error: Build failed. Please fix any code issues before deploying."
    exit 1
fi

echo "Build successful!"

# Check if torrc file has been configured
echo "Checking Tor configuration..."
if ! grep -q "HiddenServiceDir /var/lib/tor/shadowmixer/" /etc/tor/torrc; then
    echo "Warning: Tor hidden service not configured in /etc/tor/torrc"
    echo "Would you like to configure it now? (requires sudo) [y/N]"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        echo "Adding hidden service configuration to /etc/tor/torrc..."
        echo "HiddenServiceDir /var/lib/tor/shadowmixer/" | sudo tee -a /etc/tor/torrc
        echo "HiddenServicePort 80 127.0.0.1:8080" | sudo tee -a /etc/tor/torrc
        
        echo "Creating hidden service directory..."
        sudo mkdir -p /var/lib/tor/shadowmixer/
        sudo chown -R debian-tor:debian-tor /var/lib/tor/shadowmixer/
        sudo chmod 700 /var/lib/tor/shadowmixer/
        
        echo "Restarting Tor service..."
        sudo systemctl restart tor
        sleep 2
    fi
fi

# Get the onion address
if [ -f /var/lib/tor/shadowmixer/hostname ]; then
    ONION_ADDRESS=$(sudo cat /var/lib/tor/shadowmixer/hostname)
    echo "Your ShadowMixer .onion address: $ONION_ADDRESS"
    
    # Update the TorAccessInfo component with the real onion address
    if [ -n "$ONION_ADDRESS" ]; then
        sed -i "s|http://shadowmixer.onion|http://$ONION_ADDRESS|g" src/components/TorAccessInfo.tsx
        echo "Updated the onion address in the TorAccessInfo component"
        # Rebuild with the correct address
        npm run build
    fi
else
    echo "Warning: Could not find onion address file. Make sure Tor hidden service is properly configured."
fi

# Start the server
echo "Starting web server on port 8080..."
echo "To access your ShadowMixer service:"
echo "1. Open Tor Browser"
if [ -n "$ONION_ADDRESS" ]; then
    echo "2. Navigate to http://$ONION_ADDRESS"
else
    echo "2. Navigate to your .onion address (check /var/lib/tor/shadowmixer/hostname)"
fi
echo ""
echo "Press Ctrl+C to stop the server"

# Use a simple server to serve the built files
npx serve -s dist -l 8080
