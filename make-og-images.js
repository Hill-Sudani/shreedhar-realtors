const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const WIDTH = 1200;
const HEIGHT = 630;
const QUALITY = 80;
const OUTPUT_DIR = path.join('images', 'og');
const PAGES = [
  ['home', path.join('images', 'projects', 'royal.webp')],
  ['bliss', path.join('images', 'projects', 'bliss', 'hero.webp')],
  ['glory', path.join('images', 'projects', 'glory', 'hero.webp')],
  ['greens', path.join('images', 'projects', 'greens', 'hero.webp')],
  ['luxuria', path.join('images', 'projects', 'luxuria', 'hero.webp')],
  ['palace', path.join('images', 'projects', 'palace', 'hero.webp')],
  ['royal', path.join('images', 'projects', 'royal', 'hero.webp')],
  ['sky', path.join('images', 'projects', 'sky', 'hero.webp')],
  ['sparsh', path.join('images', 'projects', 'sparsh.webp')],
  ['star', path.join('images', 'projects', 'star.webp')],
  ['vihar', path.join('images', 'projects', 'vihar', 'hero.webp')],
  ['villa', path.join('images', 'projects', 'villa', 'hero.webp')],
];

async function makeOgImage(slug, sourcePath) {
  if (!fs.existsSync(sourcePath)) throw new Error(`Missing source image: ${sourcePath}`);
  const outputPath = path.join(OUTPUT_DIR, `${slug}.jpg`);

  // fit: cover uses only the scale needed to fill 1200x630, then centre-crops.
  await sharp(sourcePath)
    .resize({ width: WIDTH, height: HEIGHT, fit: 'cover', position: 'centre' })
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toFile(outputPath);

  const metadata = await sharp(outputPath).metadata();
  if (metadata.width !== WIDTH || metadata.height !== HEIGHT || metadata.format !== 'jpeg') {
    throw new Error(`Unexpected output for ${outputPath}`);
  }
  const sizeKb = Math.round(fs.statSync(outputPath).size / 1024);
  console.log(`${slug}: ${path.relative('.', sourcePath)} -> ${outputPath} (${sizeKb} KB)`);
}

(async () => {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  for (const [slug, sourcePath] of PAGES) {
    await makeOgImage(slug, sourcePath);
  }
  console.log('Open Graph image generation complete.');
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
