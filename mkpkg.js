#!/usr/bin/env node
// mkpkg.js - Build script for Stay Sharp Firefox Extension
// Usage: node mkpkg.js

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DIST_DIR = path.join(__dirname, 'binaries', 'dist');
const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, 'src', 'manifest.json'), 'utf8'));
const VERSION = manifest.version;
const DIST_ZIP = path.join(__dirname, 'binaries', `stay-sharp-firefox-ext-${VERSION}.zip`);
const SRC_FILES = [
  'src/manifest.json',
  'src/background.js',
  'src/blocker.html',
  'src/blocker.js',
  'src/blocker.css',
  'src/options.html',
  'src/options.js',
  'src/options.css',
  'PRIVACY.md',
  'LICENSE',
  'README.md',
];
const COPY_DIRS = ['src/images', 'src/icons'];

function cleanDist() {
  if (fs.existsSync(DIST_DIR)) {
    fs.rmSync(DIST_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(DIST_DIR, { recursive: true });
}

function copyFiles() {
  for (const file of SRC_FILES) {
    fs.copyFileSync(path.join(__dirname, file), path.join(DIST_DIR, path.basename(file)));
  }
  for (const dir of COPY_DIRS) {
    const srcDir = path.join(__dirname, dir);
    const destDir = path.join(DIST_DIR, path.basename(dir));
    if (fs.existsSync(srcDir)) {
      fs.cpSync(srcDir, destDir, { recursive: true });
    }
  }
}

function minify(file, type) {
  const terser = 'npx terser';
  const cleancss = 'npx cleancss';
  const src = path.join(DIST_DIR, file);
  const dest = src;
  if (type === 'js') {
    execSync(`${terser} ${src} -o ${dest} --compress --mangle`, { stdio: 'inherit' });
  } else if (type === 'css') {
    execSync(`${cleancss} -o ${dest} ${src}`, { stdio: 'inherit' });
  }
}

function minifyAssets() {
  minify('blocker.js', 'js');
  minify('options.js', 'js');
  minify('blocker.css', 'css');
  minify('options.css', 'css');
}

function zipDist() {
  // Remove old zip if exists
  if (fs.existsSync(DIST_ZIP)) fs.rmSync(DIST_ZIP);
  execSync(`cd "${DIST_DIR}" && zip -r ../stay-sharp-firefox-ext-${VERSION}.zip *`, { stdio: 'inherit' });
}

function main() {
  console.log('Building Stay Sharp Firefox Extension...');
  cleanDist();
  copyFiles();
  minifyAssets();
  zipDist();
  console.log(`Build complete! Distribution is in binaries/dist and binaries/stay-sharp-firefox-ext-${VERSION}.zip`);
}

main();
