#!/usr/bin/env node
// mkpkg.js - Build script for Stay Sharp Firefox Extension
// Usage: node mkpkg.js

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DIST_DIR = path.join(__dirname, 'binaries', 'dist');
const SRC_FILES = [
  'manifest.json',
  'background.js',
  'blocker.html',
  'blocker.js',
  'blocker.css',
  'options.html',
  'options.js',
  'options.css',
  'LICENSE',
  'README.md',
];
const COPY_DIRS = ['images', 'icons'];

function cleanDist() {
  if (fs.existsSync(DIST_DIR)) {
    fs.rmSync(DIST_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(DIST_DIR, { recursive: true });
}

function copyFiles() {
  for (const file of SRC_FILES) {
    fs.copyFileSync(path.join(__dirname, file), path.join(DIST_DIR, file));
  }
  for (const dir of COPY_DIRS) {
    const srcDir = path.join(__dirname, dir);
    const destDir = path.join(DIST_DIR, dir);
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

function main() {
  console.log('Building Stay Sharp Firefox Extension...');
  cleanDist();
  copyFiles();
  minifyAssets();
  console.log('Build complete! Distribution is in binaries/dist');
}

main();
