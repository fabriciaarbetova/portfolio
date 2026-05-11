import ffmpeg from 'ffmpeg-static';
import { spawn } from 'child_process';
import { readdir, mkdir } from 'fs/promises';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const srcDir = join(root, 'public/assets/videos');
const dstDir = join(srcDir, 'minis_nahledy');

async function runFfmpeg(src, dst) {
  return new Promise((resolve, reject) => {
    // Vytvoříme zmenšené náhledy (max šířka 1280px / 720p), odstraníme zvuk pro úsporu dat
    const args = [
      '-y', 
      '-i', src,
      '-vf', "scale='min(1280,iw)':-2",
      '-c:v', 'libx264',
      '-preset', 'fast',
      '-crf', '28',
      '-an', // odstranit audio u nahledovych karet
      dst
    ];
    
    const proc = spawn(ffmpeg, args);
    proc.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg skončil s chybou ${code}`));
    });
  });
}

async function main() {
  await mkdir(dstDir, { recursive: true });
  const files = await readdir(srcDir, { withFileTypes: true });
  
  const videos = files
    .filter(f => f.isFile() && extname(f.name).toLowerCase() === '.mp4')
    .map(f => f.name);
    
  console.log(`Nalezeno ${videos.length} videí ke kompresi...`);
  
  for (const video of videos) {
    const srcPath = join(srcDir, video);
    const dstPath = join(dstDir, video);
    console.log(`Zpracovávám: ${video}...`);
    try {
      await runFfmpeg(srcPath, dstPath);
      console.log(`  ✓ Úspěšně komprimováno`);
    } catch (e) {
      console.error(`  ✗ Selhalo: ${e.message}`);
    }
  }
  console.log('Všechna videa byla úspěšně zmenšena!');
}

main().catch(console.error);
