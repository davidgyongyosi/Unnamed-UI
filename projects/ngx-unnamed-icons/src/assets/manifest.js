const fs = require('fs');
const path = require('path');

// Base directory containing the icons folder
const baseDir = path.join(__dirname, '');
const outputFile = path.join(baseDir, 'manifest.ts');

// Function to format the name for the manifest (remove suffixes like -fill, -outline, or file extensions)
function formatIconName(fileName) {
  return fileName.replace(/\.ts$/, ''); // Remove .ts extension
}

// Function to gather icon names from a specified folder
function gatherIcons(dir) {
  const icons = [];
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    if (path.extname(file) === '.ts') {
      const iconName = formatIconName(file);
      icons.push(iconName);
    }
  });

  return icons;
}

// Paths to filled and outline folders
const filledDir = path.join(baseDir, 'fill');
const outlineDir = path.join(baseDir, 'outline');

// Gather icons from both filled and outline folders
const fillIcons = gatherIcons(filledDir);
const outlineIcons = gatherIcons(outlineDir);

// Create the content for manifest.ts
const manifestContent = `export interface Manifest {
  fill: string[];
  outline: string[];
}

export const manifest: Manifest = {
  fill: ${JSON.stringify(fillIcons, null, 2)},
  outline: ${JSON.stringify(outlineIcons, null, 2)}
};
`;

// Write to manifest.ts
fs.writeFileSync(outputFile, manifestContent, 'utf8');
console.log(`Generated ${outputFile}`);
