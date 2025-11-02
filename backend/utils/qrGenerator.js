const QRCode = require('qrcode');

// Generate QR code for product tracking
const generateQRCode = async (productData) => {
  try {
    const qrData = {
      productId: productData.productId,
      name: productData.name,
      owner: productData.currentOwnerWallet,
      verifyUrl: `http://localhost:3000/verify/${productData.productId}`
    };
    
    // Generate QR code as base64 string
    const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData));
    return qrCodeDataURL;
  } catch (error) {
    console.error('QR Code generation error:', error);
    throw error;
  }
};

module.exports = { generateQRCode };
