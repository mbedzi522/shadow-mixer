
# Setting up ShadowMixer as a Tor Hidden Service

This guide explains how to host ShadowMixer on the Tor network as a hidden service.

## Prerequisites

- Tor Browser installed on your machine
- Tor daemon installed
- Basic knowledge of command line operations

## Configuration Steps

1. Install Tor on your server:
   ```bash
   # For Debian/Ubuntu
   sudo apt update
   sudo apt install tor
   ```

2. Edit the Tor configuration file:
   ```bash
   sudo nano /etc/tor/torrc
   ```

3. Add the following configuration to set up a hidden service:
   ```
   HiddenServiceDir /var/lib/tor/shadowmixer/
   HiddenServicePort 80 127.0.0.1:8080
   ```

4. Create the hidden service directory:
   ```bash
   sudo mkdir -p /var/lib/tor/shadowmixer/
   sudo chown -R debian-tor:debian-tor /var/lib/tor/shadowmixer/
   sudo chmod 700 /var/lib/tor/shadowmixer/
   ```

5. Restart Tor:
   ```bash
   sudo systemctl restart tor
   ```

6. Get your .onion address:
   ```bash
   sudo cat /var/lib/tor/shadowmixer/hostname
   ```

7. Build your ShadowMixer application:
   ```bash
   npm run build
   ```

8. Serve the built files using a web server:
   ```bash
   # Example using a simple Node.js server
   npx serve -s dist
   ```

Your ShadowMixer instance is now accessible at your .onion address through the Tor network.

## Security Considerations

- Ensure your server doesn't leak DNS information
- Consider running the application in a containerized environment
- Do not expose the application to the regular internet if you want to maintain anonymity
- Set up proper access controls and firewalls

## Troubleshooting

- Check Tor logs for errors: `sudo journalctl -u tor@default`
- Verify the hidden service is running: `sudo ls -la /var/lib/tor/shadowmixer/`
- Ensure your application is running and bound to the correct port

Remember that connecting to your hidden service requires Tor Browser or a Tor-enabled browser.
