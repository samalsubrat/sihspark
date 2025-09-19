// Icon generator script for SPARK PWA
// Generates all required PWA icons from a source image

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Icon sizes required for PWA
const ICON_SIZES = [
  { size: 16, name: 'icon-16x16.png' },
  { size: 32, name: 'icon-32x32.png' },
  { size: 72, name: 'icon-72x72.png' },
  { size: 96, name: 'icon-96x96.png' },
  { size: 128, name: 'icon-128x128.png' },
  { size: 144, name: 'icon-144x144.png' },
  { size: 152, name: 'icon-152x152.png' },
  { size: 192, name: 'icon-192x192.png' },
  { size: 384, name: 'icon-384x384.png' },
  { size: 512, name: 'icon-512x512.png' },
];

// Maskable icon sizes (for Android adaptive icons)
const MASKABLE_SIZES = [
  { size: 192, name: 'icon-192x192-maskable.png' },
  { size: 512, name: 'icon-512x512-maskable.png' },
];

// Apple touch icon sizes
const APPLE_SIZES = [
  { size: 57, name: 'apple-touch-icon-57x57.png' },
  { size: 60, name: 'apple-touch-icon-60x60.png' },
  { size: 72, name: 'apple-touch-icon-72x72.png' },
  { size: 76, name: 'apple-touch-icon-76x76.png' },
  { size: 114, name: 'apple-touch-icon-114x114.png' },
  { size: 120, name: 'apple-touch-icon-120x120.png' },
  { size: 144, name: 'apple-touch-icon-144x144.png' },
  { size: 152, name: 'apple-touch-icon-152x152.png' },
  { size: 180, name: 'apple-touch-icon-180x180.png' },
];

// Windows tile sizes
const WINDOWS_SIZES = [
  { size: 70, name: 'mstile-70x70.png' },
  { size: 144, name: 'mstile-144x144.png' },
  { size: 150, name: 'mstile-150x150.png' },
  { size: 310, name: 'mstile-310x150.png', width: 310, height: 150 },
  { size: 310, name: 'mstile-310x310.png' },
];

async function generateIcons() {
  console.log('🎨 SPARK PWA Icon Generator');
  console.log('============================');

  // Check if Sharp is available
  if (!sharp) {
    console.error('❌ Sharp library not found. Install with: npm install sharp');
    process.exit(1);
  }

  // Source image path
  const sourceImage = path.join(__dirname, '../public/placeholder-logo.png');
  const outputDir = path.join(__dirname, '../public/icons');

  // Check if source image exists
  if (!fs.existsSync(sourceImage)) {
    console.error(`❌ Source image not found: ${sourceImage}`);
    console.log('💡 Please provide a source image (preferably 1024x1024 PNG) as public/placeholder-logo.png');
    process.exit(1);
  }

  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`📁 Created icons directory: ${outputDir}`);
  }

  console.log(`📸 Using source image: ${sourceImage}`);
  console.log(`📂 Output directory: ${outputDir}`);

  try {
    // Get source image info
    const imageInfo = await sharp(sourceImage).metadata();
    console.log(`📏 Source image: ${imageInfo.width}x${imageInfo.height}`);

    // Generate standard PWA icons
    console.log('\n🔄 Generating standard PWA icons...');
    for (const icon of ICON_SIZES) {
      const outputPath = path.join(outputDir, icon.name);
      await sharp(sourceImage)
        .resize(icon.size, icon.size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .png()
        .toFile(outputPath);
      console.log(`✅ Generated: ${icon.name}`);
    }

    // Generate maskable icons (with padding for safe zone)
    console.log('\n🎭 Generating maskable icons...');
    for (const icon of MASKABLE_SIZES) {
      const outputPath = path.join(outputDir, icon.name);
      const paddedSize = Math.round(icon.size * 0.8); // 20% padding for safe zone
      
      await sharp(sourceImage)
        .resize(paddedSize, paddedSize, {
          fit: 'contain',
          background: { r: 37, g: 99, b: 235, alpha: 1 } // Theme color background
        })
        .extend({
          top: Math.round((icon.size - paddedSize) / 2),
          bottom: Math.round((icon.size - paddedSize) / 2),
          left: Math.round((icon.size - paddedSize) / 2),
          right: Math.round((icon.size - paddedSize) / 2),
          background: { r: 37, g: 99, b: 235, alpha: 1 }
        })
        .png()
        .toFile(outputPath);
      console.log(`✅ Generated: ${icon.name}`);
    }

    // Generate Apple touch icons
    console.log('\n🍎 Generating Apple touch icons...');
    for (const icon of APPLE_SIZES) {
      const outputPath = path.join(outputDir, icon.name);
      await sharp(sourceImage)
        .resize(icon.size, icon.size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        })
        .png()
        .toFile(outputPath);
      console.log(`✅ Generated: ${icon.name}`);
    }

    // Generate Windows tile icons
    console.log('\n🪟 Generating Windows tile icons...');
    for (const icon of WINDOWS_SIZES) {
      const outputPath = path.join(outputDir, icon.name);
      const width = icon.width || icon.size;
      const height = icon.height || icon.size;
      
      await sharp(sourceImage)
        .resize(width, height, {
          fit: 'contain',
          background: { r: 37, g: 99, b: 235, alpha: 1 }
        })
        .png()
        .toFile(outputPath);
      console.log(`✅ Generated: ${icon.name}`);
    }

    // Generate favicon.ico
    console.log('\n🔖 Generating favicon...');
    const faviconPath = path.join(__dirname, '../public/favicon.ico');
    await sharp(sourceImage)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toFile(faviconPath.replace('.ico', '.png'));
    console.log(`✅ Generated: favicon.png`);

    // Generate summary
    console.log('\n📊 Generation Summary');
    console.log('=====================');
    console.log(`✅ Standard icons: ${ICON_SIZES.length}`);
    console.log(`✅ Maskable icons: ${MASKABLE_SIZES.length}`);
    console.log(`✅ Apple icons: ${APPLE_SIZES.length}`);
    console.log(`✅ Windows icons: ${WINDOWS_SIZES.length}`);
    console.log(`✅ Favicon: 1`);
    
    const totalIcons = ICON_SIZES.length + MASKABLE_SIZES.length + APPLE_SIZES.length + WINDOWS_SIZES.length + 1;
    console.log(`🎉 Total icons generated: ${totalIcons}`);

    // Provide next steps
    console.log('\n📋 Next Steps:');
    console.log('1. Update manifest.json with correct icon paths');
    console.log('2. Test PWA installation on different devices');
    console.log('3. Run PWA audit with Lighthouse');
    console.log('4. Verify icons display correctly in all contexts');

  } catch (error) {
    console.error('❌ Error generating icons:', error);
    process.exit(1);
  }
}

// Run the icon generator
if (require.main === module) {
  generateIcons();
}

module.exports = { generateIcons };
