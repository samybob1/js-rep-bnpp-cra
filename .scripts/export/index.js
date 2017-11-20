const generatePdf = require('./pdf.js');

try {
  generatePdf();
} catch (e) {
  console.error(e);
}
