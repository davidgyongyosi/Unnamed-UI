#!/usr/bin/env node

/**
 * Bundle Size Comparison Test Script
 *
 * This script simulates the bundle size comparison that happens in CI
 * to verify the bundle size monitoring works correctly.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function runCommand(command, description) {
  console.log(`🔄 ${description}...`);
  try {
    const output = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
    console.log(`✅ ${description} completed`);
    return output;
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    throw error;
  }
}

function compareBundleSizes(reportPath1, reportPath2) {
  console.log('\n📊 Comparing bundle sizes...');

  try {
    const report1 = JSON.parse(fs.readFileSync(reportPath1, 'utf8'));
    const report2 = JSON.parse(fs.readFileSync(reportPath2, 'utf8'));

    const size1 = report1.summary.totalGzippedSize;
    const size2 = report2.summary.totalGzippedSize;
    const diff = size2 - size1;
    const percentChange = Math.round((diff / size1) * 100);

    console.log(`\n📈 Size Comparison:`);
    console.log(`  Report 1: ${size1} KB`);
    console.log(`  Report 2: ${size2} KB`);
    console.log(`  Difference: ${diff > 0 ? '+' : ''}${diff} KB (${percentChange}%)`);

    if (percentChange > 10) {
      console.log(`⚠️  Significant increase detected!`);
    } else if (diff > 0) {
      console.log(`📊 Size increased slightly`);
    } else {
      console.log(`✅ Size decreased or unchanged`);
    }

    return { size1, size2, diff, percentChange };
  } catch (error) {
    console.error('❌ Failed to compare bundle sizes:', error.message);
    throw error;
  }
}

function main() {
  console.log('🧪 Testing Bundle Size Comparison Script\n');

  // Ensure reports directory exists
  const reportsDir = 'dist/reports';
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  try {
    // Generate first bundle size report
    console.log('1️⃣ Generating first bundle size report...');
    runCommand('npm run bundle-size', 'Bundle size analysis 1');

    // Copy first report
    const firstReport = path.join(reportsDir, 'bundle-size-report-1.json');
    fs.copyFileSync(
      path.join(reportsDir, 'bundle-size-report.json'),
      firstReport
    );

    // Make a small change to simulate PR changes
    console.log('\n2️⃣ Simulating code changes...');
    // We can't actually change code in this test, but we can re-run
    // the bundle size analysis to simulate the process

    // Generate second bundle size report
    console.log('\n3️⃣ Generating second bundle size report...');
    runCommand('npm run bundle-size', 'Bundle size analysis 2');

    // Copy second report
    const secondReport = path.join(reportsDir, 'bundle-size-report-2.json');
    fs.copyFileSync(
      path.join(reportsDir, 'bundle-size-report.json'),
      secondReport
    );

    // Compare the reports
    console.log('\n4️⃣ Comparing reports...');
    const comparison = compareBundleSizes(firstReport, secondReport);

    console.log('\n✅ Bundle size comparison test completed successfully!');
    console.log(`📁 Test reports saved to:`);
    console.log(`   ${firstReport}`);
    console.log(`   ${secondReport}`);

    return comparison;

  } catch (error) {
    console.error('\n❌ Bundle size comparison test failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { runCommand, compareBundleSizes };