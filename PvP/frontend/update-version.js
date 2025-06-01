// update-version.js - Fixed for ES Modules
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to your built index.html file (adjust if your build directory is different)
// Notice we're looking in the backend/static directory where Vite is outputting files
const indexPath = path.join(__dirname, '..', 'backend', 'static', 'index.html');
const versionSrc = path.join(__dirname, 'src', 'version.js');
const versionDest = path.join(__dirname, '..', 'backend', 'static', 'version.js');

// Current timestamp to use as version
const timestamp = new Date().getTime();

// First, copy version.js to dist
try {
  fs.copyFileSync(versionSrc, versionDest);
  console.log('✅ Copied version.js to static folder');
} catch (error) {
  console.error('❌ Error copying version.js:', error);
  console.error(error);
}

try {
  // Read the file
  let html = fs.readFileSync(indexPath, 'utf8');
  
  // Add version.js script right before closing body tag
  html = html.replace(
    '</body>',
    `  <script src="/version.js?v=${timestamp}"></script>\n</body>`
  );
  
  // Also add cache control meta tags
  html = html.replace(
    '<head>',
    `<head>\n  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />\n  <meta http-equiv="Pragma" content="no-cache" />\n  <meta http-equiv="Expires" content="0" />`
  );
  
  // Update all script and link tags with version parameter
  html = html.replace(
    /<script\s+([^>]*)\s+src="([^"]+)"/g, 
    `<script $1 src="$2?v=${timestamp}"`
  );
  
  html = html.replace(
    /<link\s+([^>]*)\s+href="([^"]+)"/g, 
    `<link $1 href="$2?v=${timestamp}"`
  );
  
  // Write the updated file
  fs.writeFileSync(indexPath, html);
  
  console.log(`✅ Successfully updated index.html with version ${timestamp}`);
} catch (error) {
  console.error('❌ Error updating index.html:', error);
  console.error(error);
}
