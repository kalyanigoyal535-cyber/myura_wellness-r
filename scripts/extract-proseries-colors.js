const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// ProSeries product images mapping
const PROSERIES_IMAGES = {
  'pro-mens-multivitamin': 'public/Final Images/ProSeries/PRO MEN\'S MULTIVITAMIN/optimized/main.png',
  'pro-mens-vitality-booster-gold': 'public/Final Images/ProSeries/PRO MEN\'S VITALITY BOOSTER GOLD/main.png',
  'pro-omega-3-softgel': 'public/Final Images/ProSeries/PRO OMEGA-3 SOFTGEL CAPSULES/main.png',
  'pro-womens-health-plus': 'public/Final Images/ProSeries/PRO WOMEN\'S HEALTH PLUS/optimized/main.png',
};

/**
 * Extract average color from image using the same algorithm as the browser version
 * Resizes to 32x32, then calculates alpha-weighted average
 */
async function extractAverageColor(imagePath) {
  try {
    // Resize to 32x32 (same as browser version) and get raw pixel data
    const { data, info } = await sharp(imagePath)
      .resize(32, 32, { fit: 'fill' })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    let r = 0;
    let g = 0;
    let b = 0;
    let total = 0;

    // Process pixels (RGBA format)
    for (let i = 0; i < data.length; i += 4) {
      const alpha = data[i + 3] / 255;
      if (alpha < 0.1) continue; // Skip transparent pixels
      
      r += data[i] * alpha;
      g += data[i + 1] * alpha;
      b += data[i + 2] * alpha;
      total += alpha;
    }

    if (total === 0) {
      throw new Error('No valid pixels found');
    }

    return {
      r: Math.round(r / total),
      g: Math.round(g / total),
      b: Math.round(b / total),
    };
  } catch (error) {
    console.error(`Error processing ${imagePath}:`, error.message);
    return null;
  }
}

/**
 * Extract dominant color using a more sophisticated method
 * Samples the center region and finds the most common color
 */
async function extractDominantColor(imagePath) {
  try {
    const { data, info } = await sharp(imagePath)
      .resize(100, 100, { fit: 'fill' })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Focus on center 60% of image to avoid background
    const centerStartX = Math.floor(info.width * 0.2);
    const centerEndX = Math.floor(info.width * 0.8);
    const centerStartY = Math.floor(info.height * 0.2);
    const centerEndY = Math.floor(info.height * 0.8);

    const colorMap = new Map();
    let maxCount = 0;
    let dominantColor = null;

    for (let y = centerStartY; y < centerEndY; y++) {
      for (let x = centerStartX; x < centerEndX; x++) {
        const idx = (y * info.width + x) * 4;
        const alpha = data[idx + 3] / 255;
        
        if (alpha < 0.1) continue;

        // Quantize colors to reduce noise (group similar colors)
        const r = Math.floor(data[idx] / 10) * 10;
        const g = Math.floor(data[idx + 1] / 10) * 10;
        const b = Math.floor(data[idx + 2] / 10) * 10;
        const key = `${r},${g},${b}`;

        const count = (colorMap.get(key) || 0) + 1;
        colorMap.set(key, count);

        if (count > maxCount) {
          maxCount = count;
          dominantColor = { r, g, b };
        }
      }
    }

    return dominantColor || { r: 0, g: 0, b: 0 };
  } catch (error) {
    console.error(`Error processing ${imagePath}:`, error.message);
    return null;
  }
}

/**
 * Extract vibrant color - finds the most saturated color in the image
 * Avoids very dark colors and focuses on mid-to-bright tones
 */
async function extractVibrantColor(imagePath) {
  try {
    const { data, info } = await sharp(imagePath)
      .resize(100, 100, { fit: 'fill' })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    let maxScore = 0;
    let vibrantColor = null;

    for (let i = 0; i < data.length; i += 4) {
      const alpha = data[i + 3] / 255;
      if (alpha < 0.1) continue;

      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Calculate saturation
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const saturation = max === 0 ? 0 : (max - min) / max;
      
      // Calculate brightness
      const brightness = (r + g + b) / 3;
      
      // Score: prefer colors that are:
      // - Not too dark (brightness > 60)
      // - Not too bright (brightness < 240) 
      // - Have good saturation
      // - Are in the mid-to-bright range (80-200 is ideal)
      if (brightness > 60 && brightness < 240 && saturation > 0.2) {
        const brightnessScore = brightness > 80 && brightness < 200 ? 1.5 : 1.0;
        const score = saturation * brightnessScore * (brightness / 100);
        
        if (score > maxScore) {
          maxScore = score;
          vibrantColor = { r, g, b };
        }
      }
    }

    return vibrantColor;
  } catch (error) {
    console.error(`Error processing ${imagePath}:`, error.message);
    return null;
  }
}

/**
 * Extract primary color from center region - gets the most common non-background color
 */
async function extractPrimaryColor(imagePath) {
  try {
    const { data, info } = await sharp(imagePath)
      .resize(150, 150, { fit: 'fill' })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Focus on center 50% of image
    const centerStartX = Math.floor(info.width * 0.25);
    const centerEndX = Math.floor(info.width * 0.75);
    const centerStartY = Math.floor(info.height * 0.25);
    const centerEndY = Math.floor(info.height * 0.75);

    const colorBuckets = new Map();
    const brightnessThreshold = 40; // Ignore very dark pixels

    for (let y = centerStartY; y < centerEndY; y++) {
      for (let x = centerStartX; x < centerEndX; x++) {
        const idx = (y * info.width + x) * 4;
        const alpha = data[idx + 3] / 255;
        
        if (alpha < 0.1) continue;

        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const brightness = (r + g + b) / 3;

        // Skip very dark pixels (likely shadows/background)
        if (brightness < brightnessThreshold) continue;

        // Quantize to reduce noise (group similar colors)
        const quantize = 15;
        const qr = Math.floor(r / quantize) * quantize;
        const qg = Math.floor(g / quantize) * quantize;
        const qb = Math.floor(b / quantize) * quantize;
        const key = `${qr},${qg},${qb}`;

        const count = (colorBuckets.get(key) || 0) + 1;
        colorBuckets.set(key, count);
      }
    }

    // Find the most common color
    let maxCount = 0;
    let primaryColor = null;

    for (const [key, count] of colorBuckets.entries()) {
      if (count > maxCount) {
        maxCount = count;
        const [r, g, b] = key.split(',').map(Number);
        primaryColor = { r, g, b };
      }
    }

    return primaryColor;
  } catch (error) {
    console.error(`Error processing ${imagePath}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('🎨 Extracting colors from ProSeries images...\n');

  const results = {};

  for (const [productId, imagePath] of Object.entries(PROSERIES_IMAGES)) {
    const fullPath = path.join(process.cwd(), imagePath);
    
    if (!fs.existsSync(fullPath)) {
      console.warn(`⚠️  Image not found: ${imagePath}`);
      continue;
    }

    console.log(`Processing: ${productId}`);
    console.log(`  Image: ${imagePath}`);

    // Extract multiple color methods
    const average = await extractAverageColor(fullPath);
    const dominant = await extractDominantColor(fullPath);
    const vibrant = await extractVibrantColor(fullPath);
    const primary = await extractPrimaryColor(fullPath);

    if (average) {
      console.log(`  Average: rgb(${average.r}, ${average.g}, ${average.b})`);
    }
    if (dominant) {
      console.log(`  Dominant: rgb(${dominant.r}, ${dominant.g}, ${dominant.b})`);
    }
    if (vibrant) {
      console.log(`  Vibrant: rgb(${vibrant.r}, ${vibrant.g}, ${vibrant.b})`);
    }
    if (primary) {
      console.log(`  Primary: rgb(${primary.r}, ${primary.g}, ${primary.b})`);
    }

    // Prefer vibrant color (most visually appealing), then primary, then dominant, then average
    // But if vibrant is too dark (< 80 brightness), use primary instead
    let selectedColor = vibrant;
    if (vibrant) {
      const vibrantBrightness = (vibrant.r + vibrant.g + vibrant.b) / 3;
      if (vibrantBrightness < 80) {
        selectedColor = primary || dominant || average;
      }
    } else {
      selectedColor = primary || dominant || average;
    }
    
    if (selectedColor) {
      results[productId] = selectedColor;
      console.log(`  ✅ Selected: rgb(${selectedColor.r}, ${selectedColor.g}, ${selectedColor.b})\n`);
    } else {
      console.log(`  ❌ Failed to extract color\n`);
    }
  }

  // Output results in the format needed for useImagePalette.ts
  console.log('\n📋 Color values for useImagePalette.ts:\n');
  console.log('// ProSeries products - colors extracted from actual product images');
  for (const [productId, color] of Object.entries(results)) {
    const hex = `#${color.r.toString(16).padStart(2, '0')}${color.g.toString(16).padStart(2, '0')}${color.b.toString(16).padStart(2, '0')}`;
    console.log(`  '${productId}': { r: ${color.r}, g: ${color.g}, b: ${color.b} }, // ${hex}`);
  }

  // Also save to JSON file
  const outputPath = path.join(process.cwd(), 'scripts/proseries-colors.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`\n💾 Results saved to: ${outputPath}`);
}

main().catch(console.error);

