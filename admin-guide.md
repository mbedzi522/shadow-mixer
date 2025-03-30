
# ShadowMixer Admin Guide

This comprehensive guide will walk you through setting up, deploying, and managing your ShadowMixer privacy service as a business on the Tor network.

## Table of Contents

1. [Business Model Overview](#business-model-overview)
2. [Technical Setup](#technical-setup)
   - [Local Development Setup](#local-development-setup)
   - [Tor Hidden Service Deployment](#tor-hidden-service-deployment)
   - [Security Considerations](#security-considerations)
3. [Fee Structure and Revenue](#fee-structure-and-revenue)
4. [Monitoring and Maintenance](#monitoring-and-maintenance)
5. [Legal Considerations](#legal-considerations)
6. [Marketing Your Service](#marketing-your-service)

## Business Model Overview

ShadowMixer operates as a privacy service for cryptocurrency transactions, breaking the on-chain link between source and destination addresses. Your revenue comes from the 0.5% fee charged on each withdrawal transaction.

### Key Business Components:

- **Service:** Privacy-focused cryptocurrency mixer
- **Revenue Stream:** 0.5% fee on all withdrawal transactions
- **Target Users:** Privacy-conscious cryptocurrency users
- **Competitive Advantage:** Anonymous access via Tor network, user-friendly interface

## Technical Setup

### Local Development Setup

1. **Clone the repository**:
   ```bash
   git clone <your-repository-url>
   cd shadowmixer
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

### Tor Hidden Service Deployment

ShadowMixer is designed to run as a Tor hidden service, providing maximum privacy for your users.

#### Setting up Tor Hidden Service

1. **Install Tor on your server**:
   ```bash
   # For Debian/Ubuntu
   sudo apt update
   sudo apt install tor
   ```

2. **Configure the Tor hidden service**:
   ```bash
   sudo nano /etc/tor/torrc
   ```

3. **Add the following configuration**:
   ```
   HiddenServiceDir /var/lib/tor/shadowmixer/
   HiddenServicePort 80 127.0.0.1:8080
   ```

4. **Create the hidden service directory**:
   ```bash
   sudo mkdir -p /var/lib/tor/shadowmixer/
   sudo chown -R debian-tor:debian-tor /var/lib/tor/shadowmixer/
   sudo chmod 700 /var/lib/tor/shadowmixer/
   ```

5. **Restart Tor**:
   ```bash
   sudo systemctl restart tor
   ```

6. **Get your .onion address**:
   ```bash
   sudo cat /var/lib/tor/shadowmixer/hostname
   ```

7. **Deploy ShadowMixer using the deployment script**:
   ```bash
   chmod +x deploy-to-tor.sh
   ./deploy-to-tor.sh
   ```

#### Automating Deployment

The included `deploy-to-tor.sh` script handles:
- Building the application
- Checking Tor configuration
- Updating the onion address in the application
- Starting the web server

For continuous deployment, consider setting up a CI/CD pipeline that:
1. Builds the application
2. Tests the application
3. Deploys to your Tor server using SSH

### Security Considerations

As a privacy service, security is paramount:

1. **Server Hardening**:
   - Use a dedicated server with minimal services
   - Configure a firewall (ufw or iptables)
   - Enable automatic security updates
   - Use SSH keys instead of passwords

2. **Application Security**:
   - Regularly update dependencies
   - Configure proper CSP headers (already in index.html)
   - Keep server logs minimal to protect user privacy

3. **Operational Security**:
   - Pay for hosting anonymously (cryptocurrency)
   - Access the server only through Tor
   - Use compartmentalized identities

## Fee Structure and Revenue

ShadowMixer earns revenue through a 0.5% fee on all withdrawal transactions.

### Current Fee Configuration:

The fee rate is defined in `src/lib/mockBlockchain.ts`:
```typescript
export const FEE_PERCENTAGE = 0.5; // 0.5% fee
export const FEE_RECIPIENT = '0x7B39C55E37AE415F36Bcb23156b98622c50293f1';
```

### Adjusting Fees:

To modify the fee percentage:
1. Edit the `FEE_PERCENTAGE` value in `src/lib/mockBlockchain.ts`
2. Update any user-facing documentation about fees
3. Rebuild and redeploy the application

### Fee Collection:

Fees are automatically collected in the fee recipient address. To monitor revenue:
1. Access the Admin Dashboard at `/admin`
2. View total fees collected per currency
3. Export reports for accounting purposes

## Monitoring and Maintenance

### Regular Maintenance Tasks:

1. **Dependency Updates**:
   ```bash
   npm update
   npm audit fix
   ```

2. **Server Monitoring**:
   - Monitor server health with tools like Netdata or Prometheus
   - Set up alerts for server downtime
   - Regular backup of configuration files

3. **Application Monitoring**:
   - Check application logs for errors
   - Monitor mixer pool usage and size
   - Track fee collection

### Disaster Recovery:

Create a disaster recovery plan that includes:
1. Regular backups of the Tor hidden service keys
2. Documentation for recreating the server environment
3. Backup deployment instructions

## Legal Considerations

Operating a privacy mixer may have legal implications depending on your jurisdiction. Consider:

1. **Jurisdiction Selection**:
   - Research jurisdictions with favorable privacy laws
   - Consider offshore hosting options

2. **Terms of Service**:
   - Create clear terms of service
   - Explicitly prohibit illegal activities
   - Disclaim responsibility for user actions

3. **Compliance Considerations**:
   - Some jurisdictions may require KYC/AML procedures
   - Consider consulting with a legal expert specializing in cryptocurrency

## Marketing Your Service

To attract users to your privacy service:

1. **Privacy Forums and Communities**:
   - Share your service on privacy-focused forums
   - Engage with cryptocurrency communities

2. **Documentation**:
   - Create clear user guides
   - Explain the privacy benefits of your service
   - Provide transparent information about fees

3. **Trust Building**:
   - Open source your code (optional)
   - Provide transparency reports
   - Build reputation in privacy communities

---

By following this guide, you'll be able to set up, deploy, and manage your ShadowMixer business on the Tor network, generating revenue through the 0.5% withdrawal fee while providing a valuable privacy service to your users.
