# SSL Certificate Setup Guide

## Overview
This guide explains how to set up SSL certificates for secure HTTPS communication in your Node.js application.

## Current Setup
Your application now uses HTTPS with self-signed certificates for development purposes.

### Files Generated
- `certificates/key.pem` - Private key
- `certificates/cert.pem` - SSL certificate
- `generate-cert.js` - Certificate generation script
- `test-ssl.js` - SSL connection test script

## How to Use

### 1. Start the HTTPS Server
```bash
node server.js
```

The server will start on `https://localhost:3000`

### 2. Access the Application
- Open your browser and go to: `https://localhost:3000`
- **Important**: You'll see a security warning because we're using a self-signed certificate
- Click "Advanced" → "Proceed to localhost (unsafe)" to continue

### 3. Test SSL Connection
```bash
node test-ssl.js
```

This will verify that HTTPS is working correctly.

## Certificate Details

### Self-Signed Certificate Information
- **Common Name**: localhost
- **Organization**: Chateau Luxe Hotel
- **Valid For**: 365 days
- **Subject Alternative Names**: localhost, 127.0.0.1

### Security Notes
- Self-signed certificates are perfect for development
- Browsers will show security warnings (this is normal)
- For production, use certificates from trusted Certificate Authorities like:
  - Let's Encrypt (free)
  - DigiCert
  - GlobalSign

## Regenerating Certificates

If you need new certificates, run:
```bash
node generate-cert.js
```

## Production Deployment

For production environments:

1. **Get SSL Certificates** from a trusted CA
2. **Update server.js** to use production certificate paths
3. **Configure proper domains** in certificate
4. **Set up automatic renewal** (especially for Let's Encrypt)

### Example Production Configuration
```javascript
const sslOptions = {
  key: fs.readFileSync('/path/to/production/private.key'),
  cert: fs.readFileSync('/path/to/production/certificate.crt'),
  ca: fs.readFileSync('/path/to/production/ca-bundle.crt') // If intermediate certificates
};
```

## Troubleshooting

### Common Issues

1. **"Certificate not trusted" warning**
   - This is normal for self-signed certificates
   - Click "Advanced" → "Proceed" in your browser

2. **Connection refused**
   - Make sure the server is running: `node server.js`
   - Check that port 3000 is not blocked

3. **Certificate expired**
   - Regenerate certificates: `node generate-cert.js`

4. **Mixed content warnings**
   - Ensure all resources (images, scripts) use HTTPS URLs
   - Update any hardcoded HTTP links to HTTPS

## Security Best Practices

1. **Never commit private keys** to version control
2. **Use strong encryption** (minimum 2048-bit RSA)
3. **Keep certificates updated** before expiration
4. **Use HSTS headers** in production
5. **Implement proper certificate pinning** if required

## Environment Variables

You can configure SSL settings via environment variables:
- `SSL_KEY_PATH` - Path to private key file
- `SSL_CERT_PATH` - Path to certificate file
- `HTTPS_PORT` - Port for HTTPS server (default: 443)

---

**Note**: This setup provides transport layer security for development. For production deployments, consult with security experts and use properly validated certificates.