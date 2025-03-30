
#!/bin/bash

# ShadowMixer Business Setup Script
# This script helps set up a complete ShadowMixer business environment

echo "ShadowMixer Business Setup Script"
echo "=================================="
echo "This script will help you set up a complete ShadowMixer business environment."
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo "Please run as root or with sudo"
  exit 1
fi

# Functions
install_dependencies() {
  echo "Installing dependencies..."
  apt update
  apt install -y tor nodejs npm curl git ufw
  echo "Dependencies installed."
}

configure_firewall() {
  echo "Configuring firewall..."
  ufw default deny incoming
  ufw default allow outgoing
  ufw allow ssh
  ufw allow 8080/tcp
  ufw --force enable
  echo "Firewall configured."
}

setup_tor_service() {
  echo "Setting up Tor hidden service..."
  
  # Create Tor configuration
  cat >> /etc/tor/torrc << EOF

# ShadowMixer Hidden Service
HiddenServiceDir /var/lib/tor/shadowmixer/
HiddenServicePort 80 127.0.0.1:8080
EOF

  # Create directories
  mkdir -p /var/lib/tor/shadowmixer/
  chown -R debian-tor:debian-tor /var/lib/tor/shadowmixer/
  chmod 700 /var/lib/tor/shadowmixer/
  
  # Restart Tor
  systemctl restart tor
  sleep 5
  
  # Get the onion address
  ONION_ADDRESS=$(cat /var/lib/tor/shadowmixer/hostname)
  echo "Your ShadowMixer .onion address is: $ONION_ADDRESS"
  echo "Please save this address securely!"
  echo $ONION_ADDRESS > shadowmixer_onion_address.txt
}

clone_and_build() {
  echo "Setting up ShadowMixer application..."
  
  # Clone repository (you'll need to replace with your actual repository)
  if [ ! -d "shadowmixer" ]; then
    git clone https://github.com/yourusername/shadowmixer.git
    cd shadowmixer
  else
    cd shadowmixer
    git pull
  fi
  
  # Install dependencies
  npm install
  
  # Build the application
  npm run build
  
  # Update the onion address in the application
  ONION_ADDRESS=$(cat /var/lib/tor/shadowmixer/hostname)
  sed -i "s|http://shadowmixer.onion|http://$ONION_ADDRESS|g" src/components/TorAccessInfo.tsx
  
  # Build again with the correct address
  npm run build
  
  echo "ShadowMixer application built successfully."
}

setup_systemd_service() {
  echo "Setting up systemd service for ShadowMixer..."
  
  # Create systemd service file
  cat > /etc/systemd/system/shadowmixer.service << EOF
[Unit]
Description=ShadowMixer Privacy Service
After=network.target

[Service]
Type=simple
User=nobody
WorkingDirectory=$(pwd)
ExecStart=/usr/bin/npx serve -s dist -l 8080
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF

  # Reload systemd and start service
  systemctl daemon-reload
  systemctl enable shadowmixer
  systemctl start shadowmixer
  
  echo "ShadowMixer service is now running."
}

# Main execution
echo "Starting setup process..."

install_dependencies
configure_firewall
setup_tor_service
clone_and_build
setup_systemd_service

echo ""
echo "Setup complete! Your ShadowMixer business is now running as a Tor hidden service."
echo "Onion address: $(cat /var/lib/tor/shadowmixer/hostname)"
echo ""
echo "Important next steps:"
echo "1. Review the admin-guide.md file for business operations guidance"
echo "2. Set up monitoring for your server"
echo "3. Create regular backups of your Tor hidden service keys"
echo ""
echo "Thank you for choosing ShadowMixer!"
