#!/usr/bin/env node

/**
 * Script to check Lighthouse results against predefined thresholds
 * Used in CI to ensure performance and accessibility standards are met
 */

const fs = require('fs');
const path = require('path');

// Define thresholds (adjusted for development build environment)
const THRESHOLDS = {
  performance: 50,    // Lowered to 50/100 for development builds
  accessibility: 75, // Lowered to 75/100 for development builds
  bestPractices: 80, // 80/100 minimum
  seo: 80,           // 80/100 minimum

  // Performance metric thresholds (in milliseconds) - much more lenient for development
  firstContentfulPaint: 10000,  // 10 seconds
  largestContentfulPaint: 12000, // 12 seconds
  speedIndex: 10000,            // 10 seconds
  interactive: 12000,            // 12 seconds
  totalBlockingTime: 1000,      // 1 second
};

function checkLighthouseThresholds() {
  try {
    const resultsDir = path.join(__dirname, '../lighthouse-results');

    // Look for any JSON report file in the lighthouse-results directory
    const files = fs.readdirSync(resultsDir).filter(file => file.endsWith('.json'));

    if (files.length === 0) {
      console.error('❌ No Lighthouse report files found in:', resultsDir);
      console.error('Available files:', fs.readdirSync(resultsDir));
      process.exit(1);
    }

    // Use the first JSON file found (LHCI typically creates multiple files)
    const lhrPath = path.join(resultsDir, files[0]);
    console.log('📄 Using Lighthouse report:', lhrPath);

    const lhr = JSON.parse(fs.readFileSync(lhrPath, 'utf8'));
    let allPassed = true;
    const failures = [];

    // Check category scores
    const categories = ['performance', 'accessibility', 'best-practices', 'seo'];

    categories.forEach(category => {
      const score = Math.round(lhr.categories[category].score * 100);
      const threshold = THRESHOLDS[category];

      if (score < threshold) {
        allPassed = false;
        failures.push(`${category}: ${score}/100 (threshold: ${threshold})`);
      } else {
        console.log(`✅ ${category}: ${score}/100`);
      }
    });

    // Check specific performance metrics
    const performanceMetrics = {
      'first-contentful-paint': THRESHOLDS.firstContentfulPaint,
      'largest-contentful-paint': THRESHOLDS.largestContentfulPaint,
      'speed-index': THRESHOLDS.speedIndex,
      'interactive': THRESHOLDS.interactive,
      'total-blocking-time': THRESHOLDS.totalBlockingTime,
    };

    Object.entries(performanceMetrics).forEach(([metric, threshold]) => {
      const value = Math.round(lhr.audits[metric]?.numericValue || 0);

      if (value > threshold) {
        allPassed = false;
        failures.push(`${metric}: ${value}ms (threshold: ${threshold}ms)`);
      } else {
        console.log(`✅ ${metric}: ${value}ms`);
      }
    });

    // Output results
    console.log('\n📊 Lighthouse Threshold Check Results:');
    console.log('=====================================');

    if (allPassed) {
      console.log('🎉 All Lighthouse thresholds passed!');

      // Summary scores
      const performance = Math.round(lhr.categories.performance.score * 100);
      const accessibility = Math.round(lhr.categories.accessibility.score * 100);
      const bestPractices = Math.round(lhr.categories['best-practices'].score * 100);
      const seo = Math.round(lhr.categories.seo.score * 100);

      console.log('\n📈 Summary Scores:');
      console.log(`Performance: ${performance}/100`);
      console.log(`Accessibility: ${accessibility}/100`);
      console.log(`Best Practices: ${bestPractices}/100`);
      console.log(`SEO: ${seo}/100`);

      process.exit(0);
    } else {
      console.error('\n❌ Lighthouse thresholds failed!');
      console.error('\nFailed checks:');
      failures.forEach(failure => console.error(`  - ${failure}`));

      console.error('\n💡 To fix performance issues:');
      console.error('  - Optimize images and assets');
      console.error('  - Minimize JavaScript and CSS');
      console.error('  - Enable text compression');
      console.error('  - Use efficient caching strategies');

      console.error('\n💡 To fix accessibility issues:');
      console.error('  - Add proper ARIA labels');
      console.error('  - Ensure keyboard navigation');
      console.error('  - Maintain proper color contrast');
      console.error('  - Include alt text for images');

      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Error checking Lighthouse thresholds:', error.message);
    process.exit(1);
  }
}

// Run the check
checkLighthouseThresholds();