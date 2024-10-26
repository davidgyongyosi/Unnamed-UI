const fs = require('fs');
const path = require('path');

// Base directory containing the icons folder
const baseDir = path.join(__dirname, '');
const outputFile = path.join(baseDir, 'public-api.ts');

// Function to generate export statement
function createExportStatement(name, theme) {
  const capitalizedTheme = theme.charAt(0).toUpperCase() + theme.slice(1);
  const constName = `${capitalizeWords(name)}${capitalizedTheme}`;
  return `export { ${constName} } from './${theme}/${name}';`;
}

// Function to capitalize words separated by dashes or underscores
function capitalizeWords(str) {
  return str.replace(/(?:^|-)(\w)/g, (_, c) => c ? c.toUpperCase() : '');
}

// Function to gather all exports from a directory
function gatherExports(dir, theme) {
  const exports = [];

  const files = fs.readdirSync(dir);
  files.forEach(file => {
    if (path.extname(file) === '.ts' && file !== 'public-api.ts') {
      const iconName = path.basename(file, '.ts'); // e.g., 'ad-rectangle-off'
      const exportStatement = createExportStatement(iconName, theme);
      exports.push(exportStatement);
    }
  });

  return exports;
}

// Gather exports from both filled and outline folders
const filledDir = path.join(baseDir, 'fill');
const outlineDir = path.join(baseDir, 'outline');

const filledExports = gatherExports(filledDir, 'fill');
const outlineExports = gatherExports(outlineDir, 'outline');

// Combine all exports
const allExports = [...filledExports, ...outlineExports].join('\n');

// Write to public-api.ts
fs.writeFileSync(outputFile, allExports, 'utf8');
console.log(`Generated ${outputFile}`);
