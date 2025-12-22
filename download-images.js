const axios = require('axios');
const fs = require('fs');
const path = require('path');
const imageUrls = require('./image-urls');

const imagesDir = path.join(__dirname, 'public', 'images');

// Ensure images directory exists
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

async function downloadImage(url, filename) {
  try {
    console.log(`Downloading ${filename}...`);
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'stream'
    });

    const filePath = path.join(imagesDir, filename);
    const writer = fs.createWriteStream(filePath);

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        console.log(`✅ Downloaded ${filename}`);
        resolve();
      });
      writer.on('error', reject);
    });
  } catch (error) {
    console.error(`❌ Failed to download ${filename}:`, error.message);
  }
}

async function downloadAllImages() {
  console.log('🚀 Starting image download for Chateau Luxe Hotel...\n');

  const downloadPromises = Object.entries(imageUrls).map(([filename, url]) => {
    // Add appropriate extension
    const extension = filename.includes('logo') || filename.includes('avatar') ? '.png' : '.jpg';
    const fullFilename = filename + extension;
    return downloadImage(url, fullFilename);
  });

  await Promise.all(downloadPromises);
  console.log('\n🎉 All images downloaded successfully!');
  console.log('📁 Images saved to: public/images/');
}

downloadAllImages().catch(console.error);