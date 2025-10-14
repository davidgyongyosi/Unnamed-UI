#!/usr/bin/env node

/**
 * Bundle Size Monitoring Script
 *
 * This script analyzes the build output of ngx-unnamed libraries to monitor
 * bundle sizes and ensure they stay within acceptable limits.
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Configuration
const CONFIG = {
  // Size limits in KB (gzipped)
  limits: {
    'ngx-unnamed': {
      total: 75, // Total library size (includes styles + components)
      components: {
        'button': 25,
        'input': 20,
        'icon': 30
      }
    },
    'ngx-unnamed-icons': {
      total: 200, // Icon library total (many SVG icons)
      icons: {
        'individual': 5 // Individual icon limit
      }
    }
  },
  // Build output directories
  buildDirs: {
    'ngx-unnamed': 'dist/ngx-unnamed',
    'ngx-unnamed-icons': 'dist/ngx-unnamed-icons'
  },
  // Report output
  reportDir: 'dist/reports',
  reportFile: 'bundle-size-report.json',
  visualReportFile: 'bundle-size-report.md'
};

/**
 * Calculate gzipped file size
 */
function getGzippedSize(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath);
    const gzipped = zlib.gzipSync(fileContent);
    return Math.round(gzipped.length / 1024); // Return KB
  } catch (error) {
    console.warn(`Warning: Could not calculate gzipped size for ${filePath}:`, error.message);
    return 0;
  }
}

/**
 * Get file size in KB
 */
function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return Math.round(stats.size / 1024); // Return KB
  } catch (error) {
    console.warn(`Warning: Could not get file size for ${filePath}:`, error.message);
    return 0;
  }
}

/**
 * Analyze a directory recursively
 */
function analyzeDirectory(dirPath, basePath = '') {
  const results = {
    files: [],
    totalSize: 0,
    totalGzippedSize: 0
  };

  try {
    const items = fs.readdirSync(dirPath);

    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const relativePath = basePath ? path.join(basePath, item) : item;
      const stats = fs.statSync(itemPath);

      if (stats.isFile()) {
        const fileSize = getFileSize(itemPath);
        const gzippedSize = getGzippedSize(itemPath);

        const fileInfo = {
          path: relativePath,
          size: fileSize,
          gzippedSize: gzippedSize,
          type: path.extname(itemPath)
        };

        results.files.push(fileInfo);
        results.totalSize += fileSize;
        results.totalGzippedSize += gzippedSize;
      } else if (stats.isDirectory()) {
        const subResults = analyzeDirectory(itemPath, relativePath);
        results.files.push(...subResults.files);
        results.totalSize += subResults.totalSize;
        results.totalGzippedSize += subResults.totalGzippedSize;
      }
    }
  } catch (error) {
    console.error(`Error analyzing directory ${dirPath}:`, error.message);
  }

  return results;
}

/**
 * Check if sizes are within limits
 */
function checkLimits(results) {
  const violations = [];

  for (const [libName, libConfig] of Object.entries(CONFIG.limits)) {
    const libResult = results[libName];
    if (!libResult) continue;

    // Check total size limit
    if (libResult.totalGzippedSize > libConfig.total) {
      violations.push({
        type: 'total',
        library: libName,
        actual: libResult.totalGzippedSize,
        limit: libConfig.total,
        percentage: Math.round((libResult.totalGzippedSize / libConfig.total) * 100)
      });
    }

    // Check component-specific limits
    if (libConfig.components) {
      for (const [componentName, limit] of Object.entries(libConfig.components)) {
        const componentFile = libResult.files.find(f =>
          f.path.includes(componentName) && f.path.endsWith('.js')
        );

        if (componentFile && componentFile.gzippedSize > limit) {
          violations.push({
            type: 'component',
            library: libName,
            component: componentName,
            actual: componentFile.gzippedSize,
            limit: limit,
            percentage: Math.round((componentFile.gzippedSize / limit) * 100)
          });
        }
      }
    }
  }

  return violations;
}

/**
 * Generate JSON report
 */
function generateJSONReport(results, violations) {
  const report = {
    timestamp: new Date().toISOString(),
    results,
    violations,
    summary: {
      totalLibraries: Object.keys(results).length,
      totalViolations: violations.length,
      totalSize: Object.values(results).reduce((sum, r) => sum + r.totalSize, 0),
      totalGzippedSize: Object.values(results).reduce((sum, r) => sum + r.totalGzippedSize, 0)
    }
  };

  return report;
}

/**
 * Generate markdown visual report
 */
function generateMarkdownReport(results, violations) {
  let markdown = `# Bundle Size Report\n\n`;
  markdown += `Generated on: ${new Date().toISOString()}\n\n`;

  // Summary section
  const totalSize = Object.values(results).reduce((sum, r) => sum + r.totalSize, 0);
  const totalGzippedSize = Object.values(results).reduce((sum, r) => sum + r.totalGzippedSize, 0);

  markdown += `## Summary\n\n`;
  markdown += `| Metric | Size |\n`;
  markdown += `|--------|------|\n`;
  markdown += `| Total Size | ${totalSize} KB |\n`;
  markdown += `| Total Gzipped | ${totalGzippedSize} KB |\n`;
  markdown += `| Violations | ${violations.length} |\n\n`;

  // Library details
  markdown += `## Library Details\n\n`;

  for (const [libName, libResult] of Object.entries(results)) {
    const limit = CONFIG.limits[libName]?.total || 0;
    const percentage = limit ? Math.round((libResult.totalGzippedSize / limit) * 100) : 0;
    const status = libResult.totalGzippedSize <= limit ? '✅ PASS' : '❌ FAIL';

    markdown += `### ${libName}\n\n`;
    markdown += `| Metric | Value | Status |\n`;
    markdown += `|--------|-------|--------|\n`;
    markdown += `| Size | ${libResult.totalSize} KB | ${status} |\n`;
    markdown += `| Gzipped | ${libResult.totalGzippedSize} KB | ${status} |\n`;
    markdown += `| Limit | ${limit} KB | - |\n`;
    markdown += `| Usage | ${percentage}% | ${percentage <= 100 ? '✅' : '⚠️'} |\n\n`;

    // Component breakdown
    const jsFiles = libResult.files.filter(f => f.path.endsWith('.js')).sort((a, b) => b.gzippedSize - a.gzippedSize);
    if (jsFiles.length > 0) {
      markdown += `**Component Breakdown:**\n\n`;
      markdown += `| File | Size | Gzipped |\n`;
      markdown += `|------|------|----------|\n`;

      for (const file of jsFiles.slice(0, 10)) { // Top 10 files
        markdown += `| ${file.path} | ${file.size} KB | ${file.gzippedSize} KB |\n`;
      }
      markdown += `\n`;
    }
  }

  // Violations section
  if (violations.length > 0) {
    markdown += `## ⚠️ Size Violations\n\n`;

    for (const violation of violations) {
      if (violation.type === 'total') {
        markdown += `### ${violation.library} - Total Size Exceeded\n`;
        markdown += `- **Actual**: ${violation.actual} KB\n`;
        markdown += `- **Limit**: ${violation.limit} KB\n`;
        markdown += `- **Usage**: ${violation.percentage}%\n\n`;
      } else if (violation.type === 'component') {
        markdown += `### ${violation.library} - ${violation.component} Component\n`;
        markdown += `- **Actual**: ${violation.actual} KB\n`;
        markdown += `- **Limit**: ${violation.limit} KB\n`;
        markdown += `- **Usage**: ${violation.percentage}%\n\n`;
      }
    }
  } else {
    markdown += `## ✅ All Size Limits Passed\n\n`;
  }

  // Recommendations
  markdown += `## Recommendations\n\n`;
  if (violations.length > 0) {
    markdown += `- Review and optimize components exceeding size limits\n`;
    markdown += `- Consider code splitting for large components\n`;
    markdown += `- Remove unused dependencies or imports\n`;
  } else {
    markdown += `- All components are within size limits ✅\n`;
    markdown += `- Continue monitoring bundle sizes in CI\n`;
  }
  markdown += `- Consider setting up alerts for future size regressions\n\n`;

  return markdown;
}

/**
 * Main execution function
 */
function main() {
  console.log('🔍 Analyzing bundle sizes...\n');

  // Ensure report directory exists
  if (!fs.existsSync(CONFIG.reportDir)) {
    fs.mkdirSync(CONFIG.reportDir, { recursive: true });
  }

  const results = {};

  // Analyze each library
  for (const [libName, buildDir] of Object.entries(CONFIG.buildDirs)) {
    if (fs.existsSync(buildDir)) {
      console.log(`Analyzing ${libName}...`);
      results[libName] = analyzeDirectory(buildDir);
      console.log(`  Size: ${results[libName].totalSize} KB (gzipped: ${results[libName].totalGzippedSize} KB)`);
    } else {
      console.warn(`Warning: Build directory ${buildDir} not found for ${libName}`);
    }
  }

  // Check limits
  const violations = checkLimits(results);

  // Generate reports
  const jsonReport = generateJSONReport(results, violations);
  const markdownReport = generateMarkdownReport(results, violations);

  // Write reports
  const jsonReportPath = path.join(CONFIG.reportDir, CONFIG.reportFile);
  const markdownReportPath = path.join(CONFIG.reportDir, CONFIG.visualReportFile);

  fs.writeFileSync(jsonReportPath, JSON.stringify(jsonReport, null, 2));
  fs.writeFileSync(markdownReportPath, markdownReport);

  console.log(`\n📊 Reports generated:`);
  console.log(`  JSON: ${jsonReportPath}`);
  console.log(`  Markdown: ${markdownReportPath}`);

  // Display summary
  console.log(`\n📈 Summary:`);
  console.log(`  Total size: ${jsonReport.summary.totalSize} KB`);
  console.log(`  Total gzipped: ${jsonReport.summary.totalGzippedSize} KB`);
  console.log(`  Violations: ${violations.length}`);

  if (violations.length > 0) {
    console.log(`\n❌ Size violations detected:`);
    for (const violation of violations) {
      if (violation.type === 'total') {
        console.log(`  ${violation.library}: ${violation.actual} KB (limit: ${violation.limit} KB)`);
      } else {
        console.log(`  ${violation.library}/${violation.component}: ${violation.actual} KB (limit: ${violation.limit} KB)`);
      }
    }
    process.exit(1); // Fail the build if there are violations
  } else {
    console.log(`\n✅ All size limits passed!`);
    process.exit(0);
  }
}

// Execute if run directly
if (require.main === module) {
  main();
}

module.exports = {
  CONFIG,
  analyzeDirectory,
  checkLimits,
  generateJSONReport,
  generateMarkdownReport
};