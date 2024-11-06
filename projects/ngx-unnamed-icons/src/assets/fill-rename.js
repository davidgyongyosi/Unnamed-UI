const fs = require('fs');
const path = require('path');

// Directory containing the filled icons
const fillDir = path.join(__dirname, '', 'fill');

// Function to remove '-fill' from file names in the fill directory
function removeFillSuffix() {
  fs.readdir(fillDir, (err, files) => {
    if (err) throw err;

    files.forEach(file => {
      // Only process files that contain '-fill' in the name
      if (file.includes('-fill')) {
        const oldPath = path.join(fillDir, file);
        const newFileName = file.replace('-fill', ''); // Remove '-fill'
        const newPath = path.join(fillDir, newFileName);

        // Rename the file
        fs.rename(oldPath, newPath, err => {
          if (err) throw err;
          console.log(`Renamed ${oldPath} to ${newPath}`);
        });
      }
    });
  });
}

// Run the function
removeFillSuffix();
