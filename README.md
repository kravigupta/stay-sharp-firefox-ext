# Stay Sharp
A plugin for Mozilla Firefox which makes you focus on your work and blocks distractors. 

## Purpose
Purpose is to help users block distracting websites and stay focused. Also, when you try to access a blocked website, you will be presented to a page which can be customise to help you kill time. 

The custom page can have -
1. Website you can visit for a break - Learning resources, news, etc.
2. Custom message for yourself to remind you why you are blocking the site.
3. and more.. 

## Features
- Block specific websites (like Facebook, Twitter, etc.)
- Custom HTML message when visiting blocked sites
- Options page to manage your block list
- Lightweight and privacy-friendly

## How to build
1. Clone the repository:
   ```bash
   git clone https://github.com/kravigupta/stay-sharp-firefox-ext.git
   ```
2. Navigate to the directory:
   ```bash
   cd stay-sharp-firefox-ext
   ```
3. Install dependencies (requires Node.js):
   ```bash
   npm install
   ```
4. Build the extension and create a distributable zip:
   ```bash
   node mkpkg.js
   ```
   This will:
   - Minify and copy all source files to `binaries/dist/`
   - Create a versioned zip file in `binaries/` (e.g., `stay-sharp-firefox-ext-1.0.zip`)

5. To load the extension in Firefox for testing:
   - Go to `about:debugging#/runtime/this-firefox`
   - Click "Load Temporary Add-on"
   - Select any file in the `binaries/dist/` folder (e.g., `manifest.json`)

6. To submit to Mozilla Add-ons (AMO):
   - Upload the zip file from `binaries/` (e.g., `stay-sharp-firefox-ext-1.0.zip`)

For more details, see the privacy policy in `PRIVACY.md` and the license in `LICENSE`.

## Authors
- [@kravigupta](https://github.com/kravigupta)