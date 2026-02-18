import sharp from 'sharp';
import { readdir, mkdir } from 'fs/promises';
import { join, basename, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const tasks = [
  {
    src: join(root, '../zdroj/adomcek/zas adomcek/final renders'),
    dst: join(root, 'public/assets/images/adomcek'),
    prefix: 'adomcek'
  },
  {
    src: join(root, '../zdroj/adomcek/zas adomcek/wireframes'),
    dst: join(root, 'public/assets/images/adomcek/wireframes'),
    prefix: 'wireframe'
  },
  {
    src: join(root, '../zdroj/maringotka'),
    dst: join(root, 'public/assets/images/maringotka'),
    prefix: 'maringotka'
  }
];

async function convertDir({ src, dst, prefix }) {
  await mkdir(dst, { recursive: true });
  const files = await readdir(src);
  const tifs = files.filter(f => /\.(tif|tiff)$/i.test(f));
  console.log(`Converting ${tifs.length} files from ${src}`);
  for (let i = 0; i < tifs.length; i++) {
    const file = tifs[i];
    const srcPath = join(src, file);
    const dstPath = join(dst, `${prefix}_${String(i + 1).padStart(2, '0')}.jpg`);
    try {
      await sharp(srcPath)
        .jpeg({ quality: 88 })
        .toFile(dstPath);
      console.log(`  ✓ ${file} -> ${basename(dstPath)}`);
    } catch (e) {
      console.error(`  ✗ ${file}: ${e.message}`);
    }
  }
}

for (const task of tasks) {
  await convertDir(task);
}
console.log('All done!');
