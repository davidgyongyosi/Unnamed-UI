#!/usr/bin/env node

/**
 * Tree-Shaking Verification Script
 *
 * Tests that selective imports work correctly and unused components are excluded from bundles.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

class TreeShakingTester {
  constructor() {
    this.testResults = [];
    this.tempDir = 'temp-tree-shaking-test';
  }

  setup() {
    console.log('🔧 Setting up tree-shaking test environment...');

    // Create temporary directory
    if (fs.existsSync(this.tempDir)) {
      fs.rmSync(this.tempDir, { recursive: true, force: true });
    }
    fs.mkdirSync(this.tempDir, { recursive: true });

    // Initialize a minimal Angular project
    this.createTestProject();
  }

  createTestProject() {
    const packageJson = {
      name: 'tree-shaking-test',
      version: '1.0.0',
      dependencies: {
        '@angular/core': '^20.1.7',
        '@angular/common': '^20.1.7',
        '@angular/platform-browser': '^20.1.7',
        'rxjs': '~7.8.0',
        'zone.js': '~0.15.0',
        'ngx-unnamed': 'file:./dist/ngx-unnamed',
        'ngx-unnamed-icons': 'file:./dist/ngx-unnamed-icons'
      },
      devDependencies: {
        '@angular/compiler': '^20.1.7',
        '@angular/compiler-cli': '^20.1.7',
        '@angular-devkit/build-angular': '^20.1.6',
        '@angular/cli': '^20.1.6',
        'typescript': '~5.8.3'
      }
    };

    const tsConfig = {
      compilerOptions: {
        target: 'ES2022',
        useDefineForClassFields: true,
        lib: ['ES2022', 'dom'],
        module: 'ESNext',
        skipLibCheck: true,
        moduleResolution: 'bundler',
        allowImportingTsExtensions: true,
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
        strict: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        noFallthroughCasesInSwitch: true
      },
      include: ['src/**/*']
    };

    const angularJson = {
      $schema: './node_modules/@angular/cli/lib/config/schema.json',
      version: 1,
      newProjectRoot: '',
      projects: {
        'tree-shaking-test': {
          projectType: 'application',
          root: '',
          sourceRoot: 'src',
          prefix: 'app',
          architect: {
            build: {
              builder: '@angular-devkit/build-angular:browser',
              options: {
                outputPath: 'dist-test',
                index: 'src/index.html',
                main: 'src/main.ts',
                polyfills: ['zone.js'],
                tsConfig: 'tsconfig.json',
                assets: [],
                styles: [],
                scripts: [],
                optimization: true,
                sourceMap: false,
                buildOptimizer: true
              },
              configurations: {
                production: {
                  optimization: true,
                  sourceMap: false,
                  extractLicenses: false,
                  buildOptimizer: true
                }
              }
            }
          }
        }
      }
    };

    // Write configuration files
    fs.writeFileSync(path.join(this.tempDir, 'package.json'), JSON.stringify(packageJson, null, 2));
    fs.writeFileSync(path.join(this.tempDir, 'tsconfig.json'), JSON.stringify(tsConfig, null, 2));
    fs.writeFileSync(path.join(this.tempDir, 'angular.json'), JSON.stringify(angularJson, null, 2));

    // Create source directory and files
    const srcDir = path.join(this.tempDir, 'src');
    fs.mkdirSync(srcDir, { recursive: true });

    // Create minimal Angular app files
    this.createTestFiles(srcDir);
  }

  createTestFiles(srcDir) {
    // main.ts
    const mainTs = `
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app.component';

bootstrapApplication(AppComponent);
`;

    // app.component.ts
    const appComponentTs = `
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: '<div>Tree Shaking Test</div>',
  standalone: true
})
export class AppComponent {}
`;

    // index.html
    const indexHtml = `
<!DOCTYPE html>
<html>
<head>
  <title>Tree Shaking Test</title>
</head>
<body>
  <app-root></app-root>
</body>
</html>
`;

    fs.writeFileSync(path.join(srcDir, 'main.ts'), mainTs);
    fs.writeFileSync(path.join(srcDir, 'app.component.ts'), appComponentTs);
    fs.writeFileSync(path.join(srcDir, 'index.html'), indexHtml);
  }

  async runTest(testName, importStatement, expectedComponents, excludedComponents) {
    console.log(`\n🧪 Running test: ${testName}`);
    console.log(`   Import: ${importStatement}`);

    const startTime = Date.now();

    try {
      // Update test files with specific imports
      await this.updateTestFiles(importStatement);

      // Install dependencies
      console.log('   Installing dependencies...');
      execSync('npm install', {
        cwd: this.tempDir,
        stdio: 'pipe',
        env: { ...process.env, NODE_ENV: 'production' }
      });

      // Build the test application
      console.log('   Building test application...');
      execSync('npx ng build', {
        cwd: this.tempDir,
        stdio: 'pipe',
        env: { ...process.env, NODE_ENV: 'production' }
      });

      // Analyze the bundle
      const bundlePath = path.join(this.tempDir, 'dist-test/browser/main.js');
      if (!fs.existsSync(bundlePath)) {
        throw new Error('Bundle not found at expected location');
      }

      const bundleContent = fs.readFileSync(bundlePath, 'utf8');
      const gzippedSize = this.getGzippedSize(bundlePath);

      // Check for expected and excluded components
      const foundExpected = expectedComponents.every(comp =>
        bundleContent.includes(comp)
      );

      const foundExcluded = excludedComponents.some(comp =>
        bundleContent.includes(comp)
      );

      const buildTime = Date.now() - startTime;

      const result = {
        testName,
        importStatement,
        expectedComponents,
        excludedComponents,
        foundExpected,
        foundExcluded,
        bundleSize: Math.round(fs.statSync(bundlePath).size / 1024),
        gzippedSize,
        buildTime,
        timestamp: new Date().toISOString()
      };

      this.testResults.push(result);

      // Display results
      console.log(`   Bundle size: ${result.bundleSize} KB (gzipped: ${result.gzippedSize} KB)`);
      console.log(`   Build time: ${result.buildTime}ms`);
      console.log(`   Expected components: ${result.foundExpected ? '✅ Found' : '❌ Missing'}`);
      console.log(`   Excluded components: ${result.foundExcluded ? '❌ Found (BAD)' : '✅ Excluded'}`);

      if (result.foundExpected && !result.foundExcluded) {
        console.log(`   ✅ Test PASSED`);
      } else {
        console.log(`   ❌ Test FAILED`);
      }

      return result;

    } catch (error) {
      console.error(`   ❌ Test failed:`, error.message);
      const result = {
        testName,
        importStatement,
        error: error.message,
        success: false,
        timestamp: new Date().toISOString()
      };
      this.testResults.push(result);
      return result;
    }
  }

  async updateTestFiles(importStatement) {
    const srcDir = path.join(this.tempDir, 'src');

    // Update app.component.ts with the import
    const appComponentTs = `
import { Component } from '@angular/core';
${importStatement}

@Component({
  selector: 'app-root',
  template: '<div>Tree Shaking Test</div>',
  standalone: true
})
export class AppComponent {}
`;

    fs.writeFileSync(path.join(srcDir, 'app.component.ts'), appComponentTs);
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

  async runAllTests() {
    console.log('🚀 Starting tree-shaking verification tests...\n');

    this.setup();

    // Test 1: Import only ButtonComponent
    await this.runTest(
      'Button Component Only',
      `import { ButtonComponent } from 'ngx-unnamed/button';`,
      ['ButtonComponent'],
      ['InputComponent', 'NxIconDirective']
    );

    // Test 2: Import only InputDirective
    await this.runTest(
      'Input Directive Only',
      `import { InputDirective } from 'ngx-unnamed/input';`,
      ['InputDirective'],
      ['ButtonComponent', 'NxIconDirective']
    );

    // Test 3: Import only NxIconDirective
    await this.runTest(
      'Icon Directive Only',
      `import { NxIconDirective } from 'ngx-unnamed-icons';`,
      ['NxIconDirective'],
      ['ButtonComponent', 'InputComponent']
    );

    // Test 4: Import ButtonComponent and NxIconDirective
    await this.runTest(
      'Button + Icon',
      `import { ButtonComponent } from 'ngx-unnamed/button';
import { NxIconDirective } from 'ngx-unnamed-icons';`,
      ['ButtonComponent', 'NxIconDirective'],
      ['InputComponent']
    );

    // Test 5: Import all components
    await this.runTest(
      'All Components',
      `import { ButtonComponent } from 'ngx-unnamed/button';
import { InputDirective } from 'ngx-unnamed/input';
import { NxIconDirective } from 'ngx-unnamed-icons';`,
      ['ButtonComponent', 'InputDirective', 'NxIconDirective'],
      []
    );

    // Analyze results
    this.analyzeResults();

    // Cleanup
    this.cleanup();
  }

  analyzeResults() {
    console.log('\n📊 Tree-Shaking Analysis Results');
    console.log('=====================================');

    const successfulTests = this.testResults.filter(r => r.foundExpected && !r.foundExcluded);
    const failedTests = this.testResults.filter(r => !r.foundExpected || r.foundExcluded);

    console.log(`\n📈 Test Summary:`);
    console.log(`   Total tests: ${this.testResults.length}`);
    console.log(`   Passed: ${successfulTests.length}`);
    console.log(`   Failed: ${failedTests.length}`);

    if (successfulTests.length > 0) {
      const avgSize = Math.round(successfulTests.reduce((sum, r) => sum + r.bundleSize, 0) / successfulTests.length);
      const avgGzipped = Math.round(successfulTests.reduce((sum, r) => sum + r.gzippedSize, 0) / successfulTests.length);

      console.log(`\n📦 Bundle Size Analysis (successful tests):`);
      console.log(`   Average size: ${avgSize} KB`);
      console.log(`   Average gzipped: ${avgGzipped} KB`);

      // Size breakdown by test
      console.log(`\n📊 Size Breakdown:`);
      successfulTests.forEach(result => {
        console.log(`   ${result.testName}: ${result.bundleSize} KB (${result.gzippedSize} KB gzipped)`);
      });
    }

    if (failedTests.length > 0) {
      console.log(`\n❌ Failed Tests:`);
      failedTests.forEach(result => {
        console.log(`   ${result.testName}:`);
        if (!result.foundExpected) {
          console.log(`     Missing expected components`);
        }
        if (result.foundExcluded) {
          console.log(`     Found excluded components (tree-shaking failed)`);
        }
      });
    }

    // Tree-shaking effectiveness
    const singleComponentTests = successfulTests.filter(r =>
      r.expectedComponents.length === 1 && r.excludedComponents.length > 0
    );

    if (singleComponentTests.length > 0) {
      console.log(`\n🎯 Tree-Shaking Effectiveness:`);
      console.log(`   Single component imports: ${singleComponentTests.length} tests`);

      const smallestSize = Math.min(...singleComponentTests.map(r => r.gzippedSize));
      const largestSize = Math.max(...singleComponentTests.map(r => r.gzippedSize));

      console.log(`   Smallest single component: ${smallestSize} KB gzipped`);
      console.log(`   Largest single component: ${largestSize} KB gzipped`);
      console.log(`   Size variance: ${largestSize - smallestSize} KB`);
    }

    // Overall assessment
    const successRate = (successfulTests.length / this.testResults.length) * 100;
    console.log(`\n🎯 Overall Tree-Shaking Assessment:`);
    console.log(`   Success rate: ${successRate.toFixed(1)}%`);

    if (successRate >= 80) {
      console.log(`   ✅ Tree-shaking is working well!`);
    } else if (successRate >= 60) {
      console.log(`   ⚠️ Tree-shaking is partially working - needs optimization`);
    } else {
      console.log(`   ❌ Tree-shaking is not working properly - significant issues`);
    }

    // Save results
    const reportPath = 'dist/reports/tree-shaking-report.json';
    if (!fs.existsSync('dist/reports')) {
      fs.mkdirSync('dist/reports', { recursive: true });
    }

    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalTests: this.testResults.length,
        passed: successfulTests.length,
        failed: failedTests.length,
        successRate
      },
      results: this.testResults
    };

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📁 Detailed report saved to: ${reportPath}`);

    return successRate >= 80;
  }

  cleanup() {
    console.log('\n🧹 Cleaning up test environment...');
    try {
      if (fs.existsSync(this.tempDir)) {
        fs.rmSync(this.tempDir, { recursive: true, force: true });
      }
      console.log('✅ Cleanup completed');
    } catch (error) {
      console.warn('⚠️ Warning: Could not cleanup completely:', error.message);
    }
  }
}

// Main execution
if (require.main === module) {
  const tester = new TreeShakingTester();

  tester.runAllTests()
    .then(success => {
      if (success) {
        console.log('\n🎉 Tree-shaking verification completed successfully!');
        process.exit(0);
      } else {
        console.log('\n⚠️ Tree-shaking verification found issues');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('\n❌ Tree-shaking verification failed:', error.message);
      tester.cleanup();
      process.exit(1);
    });
}

module.exports = TreeShakingTester;