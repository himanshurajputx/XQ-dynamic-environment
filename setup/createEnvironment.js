const fs = require('fs');
const path = require('path');

function createEnvironment() {
  const env = process.env.NODE_ENV?.trim() || 'development';
  const folderName = 'environment';
  const folderPath = path.resolve(process.cwd(), folderName);
  const fileName = `${env}.env`;
  const fullPath = path.join(folderPath, fileName);

  const log = (msg) => console.log(`[ENV-SETUP] ${new Date().toISOString()} - ${msg}`);

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
    log(`✅ Directory created at: ${folderPath}`);
  } else {
    log(`📁 Directory already exists at: ${folderPath}`);
  }

  if (!fs.existsSync(fullPath)) {
    const content = `# Environment File for ${env}\nKEY=value\n`;
    fs.writeFileSync(fullPath, content);
    log(`📝 File created at: ${fullPath}`);
  } else {
    log(`📄 File already exists at: ${fullPath}`);
  }
}

module.exports = { createEnvironment };

// To call it:
createEnvironment();
