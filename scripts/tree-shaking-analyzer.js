#!/usr/bin/env node

/**
 * Tree-Shaking Analyzer
 *
 * Analyzes ESM bundles to verify tree-shaking capabilities and component exports.
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

class TreeShakingAnalyzer {
  constructor() {
    this.results = [];
    this.buildPath = 'dist';
  }

  getGzippedSize(filePath) {
    try {
      const fileContent = fs.readFileSync(filePath);
      const gzipped = zlib.gzipSync(fileContent);
      return Math.round(gzipped.length / 1024); // Return KB
    } catch (error) {
      console.warn(`Warning: Could not calculate gzipped size for ${filePath}:`, error.message);
      return 0;
    }
  }

  analyzeBundle(bundlePath, libraryName) {
    console.log(`🔍 Analyzing ${libraryName} bundle...`);

    if (!fs.existsSync(bundlePath)) {
      throw new Error(`Bundle not found: ${bundlePath}`);
    }

    const content = fs.readFileSync(bundlePath, 'utf8');
    const size = fs.statSync(bundlePath).size;
    const gzippedSize = this.getGzippedSize(bundlePath);

    // Extract exports, classes, and components
    const exports = this.extractExports(content);
    const classes = this.extractClasses(content);
    const components = this.extractComponents(content);
    const imports = this.extractImports(content);

    return {
      libraryName,
      bundlePath,
      size: Math.round(size / 1024), // KB
      gzippedSize,
      content,
      exports,
      classes,
      components,
      imports,
      hasESMFormat: bundlePath.endsWith('.mjs'),
      hasSideEffects: this.detectSideEffects(content)
    };
  }

  extractExports(content) {
    const exports = [];

    // Match ES6 exports
    const exportMatches = content.match(/export\s*{([^}]+)}/g);
    if (exportMatches) {
      exportMatches.forEach(match => {
        const exportsList = match.match(/{([^}]+)}/)[1];
        const individualExports = exportsList.split(',').map(e => e.trim().replace(/ as .+/, ''));
        exports.push(...individualExports);
      });
    }

    // Match default exports
    const defaultExports = content.match(/export\s+default\s+(\w+)/g);
    if (defaultExports) {
      defaultExports.forEach(match => {
        const name = match.match(/export\s+default\s+(\w+)/)[1];
        exports.push(`default: ${name}`);
      });
    }

    return [...new Set(exports)]; // Remove duplicates
  }

  extractClasses(content) {
    const classes = [];
    const classMatches = content.match(/class\s+(\w+)/g);
    if (classMatches) {
      classMatches.forEach(match => {
        const className = match.match(/class\s+(\w+)/)[1];
        classes.push(className);
      });
    }
    return classes;
  }

  extractComponents(content) {
    const components = [];

    // Match Angular component decorators
    const componentMatches = content.match(/Component\s*\(\s*{[^}]+selector\s*:\s*['"`]([^'"`]+)['"`]/g);
    if (componentMatches) {
      componentMatches.forEach(match => {
        const selector = match.match(/selector\s*:\s*['"`]([^'"`]+)['"`]/)[1];
        components.push({ selector, type: 'component' });
      });
    }

    // Match directive decorators
    const directiveMatches = content.match(/Directive\s*\(\s*{[^}]+selector\s*:\s*['"`]([^'"`]+)['"`]/g);
    if (directiveMatches) {
      directiveMatches.forEach(match => {
        const selector = match.match(/selector\s*:\s*['"`]([^'"`]+)['"`]/)[1];
        components.push({ selector, type: 'directive' });
      });
    }

    return components;
  }

  extractImports(content) {
    const imports = [];
    const importMatches = content.match(/import\s*{([^}]+)}\s*from\s*['"`]([^'"`]+)['"`]/g);
    if (importMatches) {
      importMatches.forEach(match => {
        const importsList = match.match(/{([^}]+)}/)[1];
        const source = match.match(/from\s*['"`]([^'"`]+)['"`]/)[1];
        const individualImports = importsList.split(',').map(i => i.trim().replace(/ as .+/, ''));
        imports.push({
          source,
          items: individualImports
        });
      });
    }
    return imports;
  }

  detectSideEffects(content) {
    // Look for potential side effects
    const sideEffectIndicators = [
      /console\./,
      /window\./,
      /document\./,
      /localStorage/,
      /sessionStorage/,
      /setTimeout/,
      /setInterval/,
      /XMLHttpRequest/,
      /fetch\s*\(/,
      /eval\s*\(/
    ];

    return sideEffectIndicators.some(pattern => pattern.test(content));
  }

  checkSpecificComponents(bundleAnalysis) {
    const { libraryName, content } = bundleAnalysis;

    // Known components that should be available
    const expectedComponents = {
      'ngx-unnamed': ['ButtonComponent'],
      'ngx-unnamed-icons': ['NxIconDirective']
    };

    const expected = expectedComponents[libraryName] || [];
    const found = expected.filter(comp => content.includes(comp));

    return {
      expected,
      found,
      missing: expected.filter(comp => !found.includes(comp))
    };
  }

  analyzeSecondaryEntryPoints() {
    console.log('\n🔍 Analyzing secondary entry points...');

    const secondaryPoints = [];

    // Check for secondary entry points in ngx-unnamed
    const buttonBundle = path.join(this.buildPath, 'ngx-unnamed', 'fesm2022', 'button.mjs');
    const inputBundle = path.join(this.buildPath, 'ngx-unnamed', 'fesm2022', 'input.mjs');

    [buttonBundle, inputBundle].forEach(bundlePath => {
      if (fs.existsSync(bundlePath)) {
        const componentName = path.basename(bundlePath, '.mjs');
        const analysis = this.analyzeBundle(bundlePath, `ngx-unnamed/${componentName}`);
        secondaryPoints.push(analysis);
      }
    });

    return secondaryPoints;
  }

  runAnalysis() {
    console.log('🚀 Starting tree-shaking analysis...\n');

    if (!fs.existsSync(this.buildPath)) {
      console.error('❌ Build output not found. Run "npm run build" first.');
      process.exit(1);
    }

    const results = {
      timestamp: new Date().toISOString(),
      libraries: {},
      secondaryEntryPoints: [],
      summary: {},
      recommendations: []
    };

    // Analyze main bundles
    const libraries = ['ngx-unnamed', 'ngx-unnamed-icons'];

    libraries.forEach(libName => {
      const bundlePath = path.join(this.buildPath, libName, 'fesm2022', `${libName}.mjs`);
      try {
        const analysis = this.analyzeBundle(bundlePath, libName);
        results.libraries[libName] = analysis;

        // Check specific components
        analysis.componentCheck = this.checkSpecificComponents(analysis);

        console.log(`✅ ${libName} bundle analyzed`);
        console.log(`   Size: ${analysis.size} KB (gzipped: ${analysis.gzippedSize} KB)`);
        console.log(`   Exports: ${analysis.exports.length}`);
        console.log(`   Components: ${analysis.components.length}`);
        console.log(`   ESM Format: ${analysis.hasESMFormat ? '✅' : '❌'}`);
        console.log(`   Side Effects: ${analysis.hasSideEffects ? '⚠️ Yes' : '✅ No'}`);
        console.log(`   Components Found: ${analysis.componentCheck.found.join(', ') || 'None'}`);
        if (analysis.componentCheck.missing.length > 0) {
          console.log(`   Missing: ${analysis.componentCheck.missing.join(', ')}`);
        }
        console.log('');

      } catch (error) {
        console.error(`❌ Failed to analyze ${libName}:`, error.message);
        results.libraries[libName] = { error: error.message };
      }
    });

    // Analyze secondary entry points
    results.secondaryEntryPoints = this.analyzeSecondaryEntryPoints();

    // Generate summary and recommendations
    this.generateSummary(results);
    this.generateRecommendations(results);

    // Save results
    const reportPath = 'dist/reports/tree-shaking-analysis.json';
    if (!fs.existsSync('dist/reports')) {
      fs.mkdirSync('dist/reports', { recursive: true });
    }

    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
    console.log(`📁 Detailed analysis saved to: ${reportPath}`);

    return results;
  }

  generateSummary(results) {
    const libraries = Object.values(results.libraries).filter(lib => !lib.error);

    const totalSize = libraries.reduce((sum, lib) => sum + lib.size, 0);
    const totalGzipped = libraries.reduce((sum, lib) => sum + lib.gzippedSize, 0);
    const avgSize = libraries.length > 0 ? Math.round(totalSize / libraries.length) : 0;

    const hasESM = libraries.every(lib => lib.hasESMFormat);
    const hasSideEffects = libraries.some(lib => lib.hasSideEffects);
    const allComponentsFound = libraries.every(lib =>
      lib.componentCheck && lib.componentCheck.missing.length === 0
    );

    results.summary = {
      totalLibraries: libraries.length,
      totalSize,
      totalGzipped,
      averageSize: avgSize,
      hasESMFormat: hasESM,
      hasSideEffects,
      allComponentsFound,
      secondaryEntryPoints: results.secondaryEntryPoints.length
    };

    console.log('📊 Tree-Shaking Analysis Summary');
    console.log('=====================================');
    console.log(`Libraries analyzed: ${results.summary.totalLibraries}`);
    console.log(`Total size: ${results.summary.totalSize} KB`);
    console.log(`Total gzipped: ${results.summary.totalGzipped} KB`);
    console.log(`ESM format: ${hasESM ? '✅ Yes' : '❌ No'}`);
    console.log(`Side effects: ${hasSideEffects ? '⚠️ Yes' : '✅ No'}`);
    console.log(`All components found: ${allComponentsFound ? '✅ Yes' : '❌ No'}`);
    console.log(`Secondary entry points: ${results.summary.secondaryEntryPoints}`);
  }

  generateRecommendations(results) {
    const recommendations = [];

    if (!results.summary.hasESMFormat) {
      recommendations.push({
        priority: 'high',
        issue: 'ESM format not detected',
        recommendation: 'Configure ng-packagr to generate ESM bundles for better tree-shaking'
      });
    }

    if (results.summary.hasSideEffects) {
      recommendations.push({
        priority: 'medium',
        issue: 'Side effects detected in bundles',
        recommendation: 'Review and remove side effects to improve tree-shaking effectiveness'
      });
    }

    if (!results.summary.allComponentsFound) {
      recommendations.push({
        priority: 'high',
        issue: 'Some components not found in bundles',
        recommendation: 'Check component exports and ensure proper module structure'
      });
    }

    if (results.summary.secondaryEntryPoints === 0) {
      recommendations.push({
        priority: 'medium',
        issue: 'No secondary entry points found',
        recommendation: 'Add secondary entry points for better tree-shaking of individual components'
      });
    }

    const largeLibraries = Object.entries(results.libraries)
      .filter(([name, lib]) => !lib.error && lib.gzippedSize > 100);

    if (largeLibraries.length > 0) {
      recommendations.push({
        priority: 'low',
        issue: 'Large bundle sizes detected',
        recommendation: 'Consider code splitting or lazy loading for large libraries'
      });
    }

    // Add positive recommendations
    if (results.summary.hasESMFormat && !results.summary.hasSideEffects && results.summary.allComponentsFound) {
      recommendations.push({
        priority: 'info',
        issue: 'Tree-shaking setup looks good',
        recommendation: 'Current configuration supports effective tree-shaking'
      });
    }

    results.recommendations = recommendations;

    console.log('\n💡 Recommendations:');
    recommendations.forEach(rec => {
      const priority = rec.priority === 'high' ? '🔴' :
                      rec.priority === 'medium' ? '🟡' :
                      rec.priority === 'low' ? '🟠' : '💚';
      console.log(`   ${priority} ${rec.issue}`);
      console.log(`      ${rec.recommendation}`);
    });
  }
}

// Main execution
if (require.main === module) {
  const analyzer = new TreeShakingAnalyzer();

  try {
    const results = analyzer.runAnalysis();

    // Determine success based on key metrics
    const success = results.summary.hasESMFormat &&
                   !results.summary.hasSideEffects &&
                   results.summary.allComponentsFound;

    if (success) {
      console.log('\n🎉 Tree-shaking analysis completed successfully!');
      process.exit(0);
    } else {
      console.log('\n⚠️ Tree-shaking analysis found areas for improvement');
      process.exit(1);
    }

  } catch (error) {
    console.error('\n❌ Tree-shaking analysis failed:', error.message);
    process.exit(1);
  }
}

module.exports = TreeShakingAnalyzer;