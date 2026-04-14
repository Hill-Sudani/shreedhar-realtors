const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const IMAGE_DIR = 'images';
const QUALITY = 75;
const EXTENSIONS = ['.jpg', '.jpeg', '.png'];

async function convertImages(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            await convertImages(fullPath);
        } else if (EXTENSIONS.includes(path.extname(file).toLowerCase())) {
            const outputFilePath = fullPath.replace(path.extname(file), '.webp');

            // Skip if already exists to avoid redundant work (optional)
            if (fs.existsSync(outputFilePath)) continue;

            try {
                await sharp(fullPath)
                    .webp({ quality: QUALITY })
                    .toFile(outputFilePath);
                console.log(`Converted: ${file} -> ${path.basename(outputFilePath)}`);
            } catch (err) {
                console.error(`Error converting ${file}:`, err);
            }
        }
    }
}

(async () => {
    console.log('Starting WebP conversion...');
    await convertImages(IMAGE_DIR);
    console.log('Conversion complete.');
})();
