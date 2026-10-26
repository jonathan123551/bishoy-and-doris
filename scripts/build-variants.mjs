import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '..', 'dist');

if (!fs.existsSync(distDir)) {
  console.error('dist directory does not exist. Run vite build first.');
  process.exit(1);
}

const baseHtmlPath = path.join(distDir, 'index.html');
const baseHtml = fs.readFileSync(baseHtmlPath, 'utf-8');

// Detect branch (Cloudflare Pages sets CF_PAGES_BRANCH)
let currentBranch = process.env.CF_PAGES_BRANCH || process.env.HEAD || process.env.BRANCH || '';
if (!currentBranch) {
  try {
    currentBranch = execSync('git branch --show-current', { encoding: 'utf-8' }).trim();
  } catch {
    currentBranch = '';
  }
}
console.log(`Building for branch: "${currentBranch || 'default'}"`);

// Ensure directories exist
const dirsToCreate = [
  path.join(distDir, 'party'),
  path.join(distDir, 'bishoy-doris-party'),
  path.join(distDir, 'church'),
  path.join(distDir, 'bishoy-doris-church'),
];

for (const dir of dirsToCreate) {
  fs.mkdirSync(dir, { recursive: true });
}

// Generate Party Variant HTML
const partyScript = '<script>window.__APP_VARIANT__="party";</script>';
let partyHtml = baseHtml;
if (!partyHtml.includes('window.__APP_VARIANT__')) {
  partyHtml = partyHtml.replace('<head>', `<head>\n    ${partyScript}`);
}

fs.writeFileSync(path.join(distDir, 'party', 'index.html'), partyHtml);
fs.writeFileSync(path.join(distDir, 'bishoy-doris-party', 'index.html'), partyHtml);
fs.writeFileSync(path.join(distDir, 'party.html'), partyHtml);
fs.writeFileSync(path.join(distDir, 'bishoy-doris-party.html'), partyHtml);

// Generate Church Variant HTML
const churchScript = '<script>window.__APP_VARIANT__="church";</script>';
let churchHtml = baseHtml;
churchHtml = churchHtml.replace(
  /<title>.*?<\/title>/,
  '<title>Bishoy & Doris — Wedding Ceremony — 14 November 2026</title>'
);
churchHtml = churchHtml.replace(
  /<meta name="description" content=".*?" \/>/,
  '<meta name="description" content="You are invited to celebrate the wedding ceremony of Bishoy and Doris. 14 November 2026 at 5:00 PM." />'
);
churchHtml = churchHtml.replace(
  /<meta property="og:title" content=".*?" \/>/,
  '<meta property="og:title" content="Bishoy & Doris — Wedding Ceremony — 14 November 2026" />'
);
churchHtml = churchHtml.replace(
  /<meta property="og:description" content=".*?" \/>/,
  '<meta property="og:description" content="You are invited to celebrate the wedding ceremony of Bishoy and Doris. 14 November 2026 at 5:00 PM." />'
);
if (!churchHtml.includes('window.__APP_VARIANT__')) {
  churchHtml = churchHtml.replace('<head>', `<head>\n    ${churchScript}`);
}

fs.writeFileSync(path.join(distDir, 'church', 'index.html'), churchHtml);
fs.writeFileSync(path.join(distDir, 'bishoy-doris-church', 'index.html'), churchHtml);
fs.writeFileSync(path.join(distDir, 'church.html'), churchHtml);
fs.writeFileSync(path.join(distDir, 'bishoy-doris-church.html'), churchHtml);

// If building specifically for the church branch or church variant, set root index.html to churchHtml
if (currentBranch.toLowerCase().includes('church')) {
  fs.writeFileSync(baseHtmlPath, churchHtml);
  console.log('✓ Root index.html set to Church variant');
} else {
  fs.writeFileSync(baseHtmlPath, partyHtml);
  console.log('✓ Root index.html set to Party variant');
}

// Cloudflare Pages _redirects file
const redirectsContent = `
/bishoy-doris-church   /bishoy-doris-church/index.html   200
/church                /church/index.html                200
/bishoy-doris-party    /bishoy-doris-party/index.html    200
/party                 /party/index.html                 200
`.trim();

fs.writeFileSync(path.join(distDir, '_redirects'), `${redirectsContent}\n`);

console.log('✓ Successfully generated Party and Church static routes and HTML variants in dist/');
