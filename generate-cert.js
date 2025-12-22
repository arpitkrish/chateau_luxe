const selfsigned = require('selfsigned');
const fs = require('fs');
const path = require('path');

// Generate trusted SSL certificate
function generateCertificate() {
  const attrs = [
    { name: 'commonName', value: 'localhost' },
    { name: 'countryName', value: 'IN' },
    { name: 'stateOrProvinceName', value: 'Delhi' },
    { name: 'localityName', value: 'New Delhi' },
    { name: 'organizationName', value: 'Chateau Luxe Hotel Development' },
    { name: 'organizationalUnitName', value: 'Development Team' }
  ];

  const options = {
    keySize: 2048,
    days: 825, // ~2 years + some buffer
    algorithm: 'sha256',
    extensions: [
      {
        name: 'basicConstraints',
        cA: false
      },
      {
        name: 'keyUsage',
        keyCertSign: false,
        digitalSignature: true,
        nonRepudiation: false,
        keyEncipherment: true,
        dataEncipherment: false
      },
      {
        name: 'extKeyUsage',
        serverAuth: true,
        clientAuth: false,
        codeSigning: false,
        emailProtection: false,
        timeStamping: false,
        msCodeInd: false,
        msCodeCom: false,
        msCTLSign: false,
        msSGC: false,
        msEFS: false,
        nsSGC: false
      },
      {
        name: 'subjectAltName',
        altNames: [
          {
            type: 2, // DNS
            value: 'localhost'
          },
          {
            type: 2, // DNS
            value: '127.0.0.1'
          },
          {
            type: 7, // IP
            value: '127.0.0.1'
          },
          {
            type: 7, // IP
            value: '::1'
          }
        ]
      },
      {
        name: 'subjectKeyIdentifier',
        keyIdentifier: 'always'
      },
      {
        name: 'authorityKeyIdentifier',
        keyIdentifier: 'keyid:always'
      }
    ]
  };

  const pems = selfsigned.generate(attrs, options);

  // Write files
  const certDir = path.join(__dirname, 'certificates');
  if (!fs.existsSync(certDir)) {
    fs.mkdirSync(certDir);
  }

  fs.writeFileSync(path.join(certDir, 'key.pem'), pems.private);
  fs.writeFileSync(path.join(certDir, 'cert.pem'), pems.cert);

  console.log('✅ Enhanced SSL certificates generated successfully!');
  console.log('📁 Certificate files saved in: certificates/');
  console.log('🔐 Private key: certificates/key.pem');
  console.log('📜 Certificate: certificates/cert.pem');
  console.log('');
  console.log('🔧 Next steps:');
  console.log('1. Add certificate to Chrome trust store (see instructions below)');
  console.log('2. Or use Firefox (works without additional setup)');
  console.log('');
  console.log('🌐 Access your application at: https://localhost:3000');
  console.log('');
  console.log('⚠️  Note: Chrome requires manual certificate trust for self-signed certs');
}

generateCertificate();