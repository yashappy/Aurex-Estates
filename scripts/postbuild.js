import fs from 'fs';
import path from 'path';

const distAdmin = path.resolve('dist/admin');
const distAssets = path.resolve('dist/assets');
const distIndex = path.resolve('dist/index.html');
const distHtaccess = path.resolve('dist/.htaccess');

if (fs.existsSync('dist')) {
  fs.mkdirSync(distAdmin, { recursive: true });
  if (fs.existsSync(distIndex)) {
    fs.copyFileSync(distIndex, path.join(distAdmin, 'index.html'));
  }
  if (fs.existsSync(distHtaccess)) {
    fs.copyFileSync(distHtaccess, path.join(distAdmin, '.htaccess'));
  }
  if (fs.existsSync(distAssets)) {
    fs.cpSync(distAssets, path.join(distAdmin, 'assets'), { recursive: true });
  }
  console.log('[Postbuild] Successfully generated dist/admin bundle for Hostinger admin subdomain.');
}
