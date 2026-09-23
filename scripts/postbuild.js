import fs from 'fs';
import path from 'path';

const distDir = path.resolve('dist');
const distAdmin = path.resolve('dist/admin');

if (fs.existsSync(distDir)) {
  fs.mkdirSync(distAdmin, { recursive: true });

  const itemsToCopy = ['index.html', '.htaccess', 'assets', 'images', 'brochures'];

  for (const item of itemsToCopy) {
    const srcPath = path.join(distDir, item);
    const destPath = path.join(distAdmin, item);

    if (fs.existsSync(srcPath)) {
      const stat = fs.statSync(srcPath);
      if (stat.isDirectory()) {
        fs.cpSync(srcPath, destPath, { recursive: true });
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }

  // Also copy all root images, logos, icons, and manifests to dist/admin
  const rootFiles = fs.readdirSync(distDir);
  for (const file of rootFiles) {
    if (file === 'admin') continue;
    const srcFile = path.join(distDir, file);
    const destFile = path.join(distAdmin, file);
    const stat = fs.statSync(srcFile);
    if (stat.isFile() && !fs.existsSync(destFile)) {
      fs.copyFileSync(srcFile, destFile);
    }
  }

  console.log('[Postbuild] Successfully generated complete dist/admin bundle with all images, assets & brochures.');
}
