const fs = require('fs');
const path = require('path');

// Base directory containing the icons folder
const baseDir = path.join(__dirname, '');

// Function to create TypeScript file content
function createTsContent(name, theme, svgContent) {
  const capitalizedTheme = theme.charAt(0).toUpperCase() + theme.slice(1);
  const constName = `${capitalizeWords(name)}${capitalizedTheme}`;
  
  return `import { IconDefinition } from '../../types';

export const ${constName}: IconDefinition = {
  name: '${name}',
  theme: '${theme}',
  icon: \`${svgContent}\`
};`;
}

// Function to capitalize words separated by dashes or underscores
function capitalizeWords(str) {
  return str.replace(/(?:^|-)(\w)/g, (_, c) => c ? c.toUpperCase() : '');
}

// Function to process SVG files in a directory
function processSvgFiles(dir, theme) {
  fs.readdir(dir, (err, files) => {
    if (err) throw err;

    files.forEach(file => {
      const svgPath = path.join(dir, file);

      // Only process .svg files
      if (path.extname(file) === '.svg') {
        const iconName = path.basename(file, '.svg'); // e.g., 'ad-rectangle-off'

        // Read SVG content
        fs.readFile(svgPath, 'utf8', (err, data) => {
          if (err) throw err;

          // Create the TS content with embedded SVG
          const tsContent = createTsContent(iconName, theme, data);

          // Define output .ts filename
          const outputFilePath = path.join(dir, `${iconName}.ts`);
          fs.writeFile(outputFilePath, tsContent, 'utf8', err => {
            if (err) throw err;
            console.log(`Generated ${outputFilePath}`);
          });
        });
      }
    });
  });
}

// Paths to filled and outline folders
const filledDir = path.join(baseDir, 'fill');
const outlineDir = path.join(baseDir, 'outline');

// Process both filled and outline SVG directories
processSvgFiles(filledDir, 'fill');
processSvgFiles(outlineDir, 'outline');
