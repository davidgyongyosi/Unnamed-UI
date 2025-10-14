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
      // Assertions for performance scores (>90% performance, >95% accessibility)
      assertions: {
        'categories:performance': ['warn', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.9 }],

        // Specific performance budget assertions
        'performance-budget:first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        'performance-budget:largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
        'performance-budget:speed-index': ['warn', { maxNumericValue: 3000 }],
        'performance-budget:interactive': ['warn', { maxNumericValue: 5000 }],
        'performance-budget:total-blocking-time': ['warn', { maxNumericValue: 200 }],

        // JavaScript size budgets
        'budgets:script-count': ['warn', { maxNumericValue: 10 }],
        'budgets:total-byte-weight': ['warn', { maxNumericValue: 250000 }],

        // Specific accessibility assertions
        'accessibility:aria-labels': 'error',
        'accessibility:button-name': 'error',
        'accessibility:link-name': 'error',
        'accessibility:html-has-lang': 'error',
        'accessibility:page-title': 'error',

        // Best practices assertions
        'best-practices:no-vulnerable-libraries': 'error',
        'best-practices:errors-in-console': 'error',
        'best-practices:https': 'warn',
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