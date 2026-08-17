const crypto = require('crypto');

// Generates a short, unique, human-shareable certificate identifier
// e.g. CERT-6F2A9C1B
const generateCertificateId = () => {
  const random = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `CERT-${random}`;
};

module.exports = generateCertificateId;
