module.exports = {
  ci: {
    collect: {
      // Number of times to run Lighthouse for each URL
      numberOfRuns: 3,
      // Start server before collecting
      startServerCommand: 'npm run start:ci',
      // Wait for server to be ready
      startServerReadyPattern: 'Local:',
      // Server URL (will be automatically started by LHCI)
      url: ['http://localhost:4200'],
      // Settings for Lighthouse runs
      settings: {
        // Chrome flags for headless mode
        chromeFlags: ['--no-sandbox', '--headless', '--disable-gpu'],
        // Presets for testing
        preset: 'desktop',
        // Only audit categories we care about
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        // Disable throttling for CI environment
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
          requestLatencyMs: 0,
          downloadThroughputKbps: 0,
          uploadThroughputKbps: 0,
        },
      },
    },
    assert: {
      // Assertions for performance scores (lowered thresholds for CI environment)
      assertions: {
        'categories:performance': ['warn', { minScore: 0.5 }],
        'categories:accessibility': ['warn', { minScore: 0.8 }],
        'categories:best-practices': ['warn', { minScore: 0.8 }],
        'categories:seo': ['warn', { minScore: 0.8 }],

        // Specific performance budget assertions
        'first-contentful-paint': ['warn', { maxNumericValue: 4000 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 6000 }],
        'speed-index': ['warn', { maxNumericValue: 5000 }],
        'interactive': ['warn', { maxNumericValue: 8000 }],
        'total-blocking-time': ['warn', { maxNumericValue: 600 }],

        // JavaScript size budgets (relaxed for development build)
        'script-count': ['warn', { maxNumericValue: 25 }],
        'total-byte-weight': ['warn', { maxNumericValue: 3500000 }],

        // Specific accessibility assertions
        'aria-labels': 'warn',
        'button-name': 'warn',
        'link-name': 'warn',
        'html-has-lang': 'warn',
        'page-title': 'warn',

        // Best practices assertions
        'no-vulnerable-libraries': 'warn',
        'errors-in-console': 'warn',
        'https': 'off',
        'is-on-https': 'off',
      },
    },
    upload: {
      // Upload to Lighthouse CI server (optional)
      // target: 'temporary-public-storage',

      // For now, just generate reports locally
      target: 'filesystem',
      outputDir: './lighthouse-results',
    },
  },
};