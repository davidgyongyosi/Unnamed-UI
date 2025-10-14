#!/usr/bin/env node

/**
 * Build Metrics Collector
 *
 * Collects, analyzes, and stores build performance metrics over time.
 * Tracks build duration, bundle sizes, and other performance indicators.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const zlib = require('zlib');

class BuildMetricsCollector {
  constructor() {
    this.metricsFile = 'dist/reports/build-metrics-history.json';
    this.currentMetrics = {};
    this.history = this.loadHistory();
  }

  loadHistory() {
    try {
      if (fs.existsSync(this.metricsFile)) {
        const data = fs.readFileSync(this.metricsFile, 'utf8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.warn('Warning: Could not load metrics history:', error.message);
    }
    return {
      builds: [],
      summary: {
        totalBuilds: 0,
        averageBuildTime: 0,
        averageBundleSize: 0,
        lastBuildDate: null
      }
    };
  }

  saveHistory() {
    try {
      const reportsDir = path.dirname(this.metricsFile);
      if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
      }

      fs.writeFileSync(this.metricsFile, JSON.stringify(this.history, null, 2));
    } catch (error) {
      console.error('Error saving metrics history:', error.message);
    }
  }

  startMetricsCollection(buildType = 'production') {
    console.log(`📊 Starting build metrics collection for: ${buildType}`);
    this.currentMetrics = {
      buildType,
      startTime: Date.now(),
      timestamp: new Date().toISOString(),
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      memory: {
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024), // MB
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) // MB
      }
    };
  }

  recordBuildStep(stepName, duration) {
    if (!this.currentMetrics.steps) {
      this.currentMetrics.steps = [];
    }

    this.currentMetrics.steps.push({
      name: stepName,
      duration,
      timestamp: Date.now()
    });

    console.log(`   ${stepName}: ${this.formatTime(duration)}`);
  }

  recordBundleMetrics() {
    console.log('📦 Collecting bundle metrics...');

    const libraries = ['ngx-unnamed', 'ngx-unnamed-icons'];
    const bundleMetrics = {};

    libraries.forEach(libName => {
      const bundlePath = `dist/${libName}/fesm2022/${libName}.mjs`;
      if (fs.existsSync(bundlePath)) {
        const stats = fs.statSync(bundlePath);
        const gzippedSize = this.getGzippedSize(bundlePath);

        bundleMetrics[libName] = {
          size: Math.round(stats.size / 1024), // KB
          gzippedSize,
          path: bundlePath
        };
      }
    });

    this.currentMetrics.bundleMetrics = bundleMetrics;

    const totalSize = Object.values(bundleMetrics).reduce((sum, m) => sum + m.size, 0);
    const totalGzipped = Object.values(bundleMetrics).reduce((sum, m) => sum + m.gzippedSize, 0);

    console.log(`   Total bundle size: ${totalSize} KB (${totalGzipped} KB gzipped)`);
    return bundleMetrics;
  }

  getGzippedSize(filePath) {
    try {
      const fileContent = fs.readFileSync(filePath);
      const gzipped = zlib.gzipSync(fileContent);
      return Math.round(gzipped.length / 1024); // Return KB
    } catch (error) {
      return 0;
    }
  }

  finishMetricsCollection(success = true) {
    if (!this.currentMetrics.startTime) {
      console.warn('Warning: No metrics collection started');
      return;
    }

    const endTime = Date.now();
    const totalDuration = endTime - this.currentMetrics.startTime;

    this.currentMetrics.endTime = endTime;
    this.currentMetrics.totalDuration = totalDuration;
    this.currentMetrics.success = success;
    this.currentMetrics.finalMemory = {
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024), // MB
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) // MB
    };

    // Record bundle metrics
    this.recordBundleMetrics();

    // Add to history
    this.history.builds.push(this.currentMetrics);
    this.updateSummary();

    // Save history
    this.saveHistory();

    // Display current metrics
    this.displayCurrentMetrics();

    // Check for performance regressions
    this.checkPerformanceRegressions();

    return this.currentMetrics;
  }

  updateSummary() {
    const builds = this.history.builds;
    const successfulBuilds = builds.filter(b => b.success);

    this.history.summary = {
      totalBuilds: builds.length,
      successfulBuilds: successfulBuilds.length,
      averageBuildTime: successfulBuilds.length > 0
        ? Math.round(successfulBuilds.reduce((sum, b) => sum + b.totalDuration, 0) / successfulBuilds.length)
        : 0,
      averageBundleSize: successfulBuilds.length > 0
        ? Math.round(successfulBuilds.reduce((sum, b) => {
            const bundleTotal = Object.values(b.bundleMetrics || {}).reduce((s, m) => s + m.size, 0);
            return sum + bundleTotal;
          }, 0) / successfulBuilds.length)
        : 0,
      lastBuildDate: builds.length > 0 ? builds[builds.length - 1].timestamp : null,
      lastBuildDuration: builds.length > 0 ? builds[builds.length - 1].totalDuration : 0,
      lastBuildSuccess: builds.length > 0 ? builds[builds.length - 1].success : false
    };
  }

  displayCurrentMetrics() {
    const metrics = this.currentMetrics;
    console.log('\n📊 Build Metrics Summary');
    console.log('=========================');
    console.log(`Build Type: ${metrics.buildType}`);
    console.log(`Duration: ${this.formatTime(metrics.totalDuration)}`);
    console.log(`Success: ${metrics.success ? '✅ Yes' : '❌ No'}`);
    console.log(`Timestamp: ${metrics.timestamp}`);

    if (metrics.steps && metrics.steps.length > 0) {
      console.log('\n📈 Build Steps:');
      metrics.steps.forEach(step => {
        console.log(`  ${step.name}: ${this.formatTime(step.duration)}`);
      });
    }

    if (metrics.bundleMetrics) {
      console.log('\n📦 Bundle Sizes:');
      Object.entries(metrics.bundleMetrics).forEach(([lib, bundle]) => {
        console.log(`  ${lib}: ${bundle.size} KB (${bundle.gzippedSize} KB gzipped)`);
      });

      const totalSize = Object.values(metrics.bundleMetrics).reduce((sum, m) => sum + m.size, 0);
      const totalGzipped = Object.values(metrics.bundleMetrics).reduce((sum, m) => sum + m.gzippedSize, 0);
      console.log(`  Total: ${totalSize} KB (${totalGzipped} KB gzipped)`);
    }

    if (metrics.memory && metrics.finalMemory) {
      console.log('\n💾 Memory Usage:');
      console.log(`  Start: ${metrics.memory.used} MB used / ${metrics.memory.total} MB total`);
      console.log(`  End: ${metrics.finalMemory.used} MB used / ${metrics.finalMemory.total} MB total`);
      const memoryIncrease = metrics.finalMemory.used - metrics.memory.used;
      console.log(`  Increase: ${memoryIncrease > 0 ? '+' : ''}${memoryIncrease} MB`);
    }
  }

  checkPerformanceRegressions() {
    if (this.history.builds.length < 5) {
      console.log('\n📈 Not enough build history for regression analysis (need 5+ builds)');
      return;
    }

    const recentBuilds = this.history.builds.slice(-10); // Last 10 builds
    const successfulRecentBuilds = recentBuilds.filter(b => b.success);

    if (successfulRecentBuilds.length < 3) {
      console.log('\n⚠️ Not enough successful recent builds for regression analysis');
      return;
    }

    // Calculate averages
    const avgBuildTime = Math.round(
      successfulRecentBuilds.reduce((sum, b) => sum + b.totalDuration, 0) / successfulRecentBuilds.length
    );

    const avgBundleSize = Math.round(
      successfulRecentBuilds.reduce((sum, b) => {
        const bundleTotal = Object.values(b.bundleMetrics || {}).reduce((s, m) => s + m.size, 0);
        return sum + bundleTotal;
      }, 0) / successfulRecentBuilds.length
    );

    // Compare with current build
    const currentBuild = this.currentMetrics;
    const currentBundleTotal = Object.values(currentBuild.bundleMetrics || {}).reduce((s, m) => s + m.size, 0);

    const buildTimeIncrease = ((currentBuild.totalDuration - avgBuildTime) / avgBuildTime) * 100;
    const bundleSizeIncrease = ((currentBundleTotal - avgBundleSize) / avgBundleSize) * 100;

    console.log('\n📈 Performance Analysis');
    console.log('=======================');
    console.log(`Recent average build time: ${this.formatTime(avgBuildTime)}`);
    console.log(`Recent average bundle size: ${avgBundleSize} KB`);
    console.log(`Current build time: ${this.formatTime(currentBuild.totalDuration)}`);
    console.log(`Current bundle size: ${currentBundleTotal} KB`);

    const regressions = [];

    if (buildTimeIncrease > 20) {
      regressions.push({
        type: 'build_time',
        severity: 'high',
        increase: `${buildTimeIncrease.toFixed(1)}%`,
        message: `Build time increased significantly (${buildTimeIncrease.toFixed(1)}% above recent average)`
      });
    } else if (buildTimeIncrease > 10) {
      regressions.push({
        type: 'build_time',
        severity: 'medium',
        increase: `${buildTimeIncrease.toFixed(1)}%`,
        message: `Build time increased moderately (${buildTimeIncrease.toFixed(1)}% above recent average)`
      });
    }

    if (bundleSizeIncrease > 15) {
      regressions.push({
        type: 'bundle_size',
        severity: 'high',
        increase: `${bundleSizeIncrease.toFixed(1)}%`,
        message: `Bundle size increased significantly (${bundleSizeIncrease.toFixed(1)}% above recent average)`
      });
    } else if (bundleSizeIncrease > 8) {
      regressions.push({
        type: 'bundle_size',
        severity: 'medium',
        increase: `${bundleSizeIncrease.toFixed(1)}%`,
        message: `Bundle size increased moderately (${bundleSizeIncrease.toFixed(1)}% above recent average)`
      });
    }

    if (regressions.length > 0) {
      console.log('\n⚠️ Performance Regressions Detected:');
      regressions.forEach(reg => {
        const severity = reg.severity === 'high' ? '🔴' : '🟡';
        console.log(`  ${severity} ${reg.message}`);
      });

      // Save regressions to a separate file
      this.saveRegressions(regressions);
    } else {
      console.log('\n✅ No significant performance regressions detected');
      if (buildTimeIncrease < -10) {
        console.log(`🎉 Build time improved by ${Math.abs(buildTimeIncrease).toFixed(1)}%`);
      }
      if (bundleSizeIncrease < -5) {
        console.log(`🎉 Bundle size improved by ${Math.abs(bundleSizeIncrease).toFixed(1)}%`);
      }
    }
  }

  saveRegressions(regressions) {
    const regressionFile = 'dist/reports/performance-regressions.json';
    const existingRegressions = fs.existsSync(regressionFile)
      ? JSON.parse(fs.readFileSync(regressionFile, 'utf8'))
      : { regressions: [], summary: {} };

    // Add current build info to regressions
    regressions.forEach(reg => {
      existingRegressions.regressions.push({
        ...reg,
        buildTimestamp: this.currentMetrics.timestamp,
        buildType: this.currentMetrics.buildType,
        buildDuration: this.currentMetrics.totalDuration
      });
    });

    // Keep only last 50 regressions
    if (existingRegressions.regressions.length > 50) {
      existingRegressions.regressions = existingRegressions.regressions.slice(-50);
    }

    existingRegressions.summary = {
      totalRegressions: existingRegressions.regressions.length,
      lastRegressionDate: existingRegressions.regressions.length > 0
        ? existingRegressions.regressions[existingRegressions.regressions.length - 1].buildTimestamp
        : null,
      regressionsByType: this.groupRegressionsByType(existingRegressions.regressions)
    };

    fs.writeFileSync(regressionFile, JSON.stringify(existingRegressions, null, 2));
  }

  groupRegressionsByType(regressions) {
    const grouped = {};
    regressions.forEach(reg => {
      if (!grouped[reg.type]) {
        grouped[reg.type] = { count: 0, high: 0, medium: 0 };
      }
      grouped[reg.type].count++;
      grouped[reg.type][reg.severity]++;
    });
    return grouped;
  }

  generatePerformanceReport() {
    console.log('\n📊 Generating Performance Report...');

    const report = {
      timestamp: new Date().toISOString(),
      summary: this.history.summary,
      recentTrends: this.analyzeTrends(),
      recommendations: this.generateRecommendations(),
      buildHistory: this.history.builds.slice(-20) // Last 20 builds
    };

    const reportFile = 'dist/reports/performance-report.json';
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));

    // Generate markdown report
    this.generateMarkdownReport(report);

    console.log(`📁 Performance report saved to: ${reportFile}`);
    console.log(`📁 Markdown report saved to: dist/reports/performance-report.md`);

    return report;
  }

  analyzeTrends() {
    if (this.history.builds.length < 10) {
      return { message: 'Insufficient data for trend analysis (need 10+ builds)' };
    }

    const recentBuilds = this.history.builds.slice(-20);
    const successfulBuilds = recentBuilds.filter(b => b.success);

    if (successfulBuilds.length < 5) {
      return { message: 'Insufficient successful builds for trend analysis' };
    }

    const buildTimes = successfulBuilds.map(b => b.totalDuration);
    const bundleSizes = successfulBuilds.map(b => {
      return Object.values(b.bundleMetrics || {}).reduce((sum, m) => sum + m.size, 0);
    });

    // Calculate trends (simple linear regression)
    const buildTimeTrend = this.calculateTrend(buildTimes);
    const bundleSizeTrend = this.calculateTrend(bundleSizes);

    return {
      buildTime: {
        trend: buildTimeTrend > 5 ? 'increasing' : buildTimeTrend < -5 ? 'decreasing' : 'stable',
        changePerBuild: Math.round(buildTimeTrend),
        average: Math.round(buildTimes.reduce((a, b) => a + b, 0) / buildTimes.length)
      },
      bundleSize: {
        trend: bundleSizeTrend > 2 ? 'increasing' : bundleSizeTrend < -2 ? 'decreasing' : 'stable',
        changePerBuild: Math.round(bundleSizeTrend),
        average: Math.round(bundleSizes.reduce((a, b) => a + b, 0) / bundleSizes.length)
      }
    };
  }

  calculateTrend(values) {
    const n = values.length;
    if (n < 2) return 0;

    const x = Array.from({ length: n }, (_, i) => i);
    const xMean = x.reduce((a, b) => a + b, 0) / n;
    const yMean = values.reduce((a, b) => a + b, 0) / n;

    const numerator = x.reduce((sum, xi, i) => sum + (xi - xMean) * (values[i] - yMean), 0);
    const denominator = x.reduce((sum, xi) => sum + Math.pow(xi - xMean, 2), 0);

    return denominator === 0 ? 0 : numerator / denominator;
  }

  generateRecommendations() {
    const recommendations = [];
    const summary = this.history.summary;

    if (summary.averageBuildTime > 180000) { // 3 minutes
      recommendations.push({
        priority: 'high',
        category: 'performance',
        title: 'Build Time Optimization Needed',
        description: `Average build time is ${Math.round(summary.averageBuildTime / 1000)}s, which is quite long`,
        suggestions: [
          'Enable build caching',
          'Use parallel builds',
          'Optimize TypeScript configuration',
          'Reduce number of dependencies'
        ]
      });
    }

    if (summary.averageBundleSize > 500) { // 500 KB
      recommendations.push({
        priority: 'medium',
        category: 'bundle-size',
        title: 'Bundle Size Optimization',
        description: `Average bundle size is ${summary.averageBundleSize} KB, consider optimization`,
        suggestions: [
          'Enable tree-shaking verification',
          'Remove unused dependencies',
          'Optimize asset loading',
          'Use code splitting'
        ]
      });
    }

    const successRate = (summary.successfulBuilds / summary.totalBuilds) * 100;
    if (successRate < 90) {
      recommendations.push({
        priority: 'high',
        category: 'reliability',
        title: 'Improve Build Success Rate',
        description: `Build success rate is ${successRate.toFixed(1)}%, which should be improved`,
        suggestions: [
          'Investigate frequent build failures',
          'Improve error handling',
          'Add pre-build validation',
          'Fix flaky tests'
        ]
      });
    }

    if (recommendations.length === 0) {
      recommendations.push({
        priority: 'info',
        category: 'general',
        title: 'Build Performance Looks Good',
        description: 'No significant issues detected with build performance',
        suggestions: [
          'Continue monitoring build metrics',
          'Consider setting up automated alerts',
          'Share best practices with team'
        ]
      });
    }

    return recommendations;
  }

  generateMarkdownReport(report) {
    let markdown = `# Build Performance Report\n\n`;
    markdown += `Generated on: ${report.timestamp}\n\n`;

    // Summary section
    markdown += `## 📊 Summary\n\n`;
    markdown += `- **Total Builds**: ${report.summary.totalBuilds}\n`;
    markdown += `- **Successful Builds**: ${report.summary.successfulBuilds}\n`;
    markdown += `- **Success Rate**: ${((report.summary.successfulBuilds / report.summary.totalBuilds) * 100).toFixed(1)}%\n`;
    markdown += `- **Average Build Time**: ${Math.round(report.summary.averageBuildTime / 1000)}s\n`;
    markdown += `- **Average Bundle Size**: ${report.summary.averageBundleSize} KB\n`;
    markdown += `- **Last Build**: ${report.summary.lastBuildDate ? new Date(report.summary.lastBuildDate).toLocaleDateString() : 'N/A'}\n\n`;

    // Trends section
    if (report.recentTrends.buildTime) {
      markdown += `## 📈 Recent Trends\n\n`;

      const bt = report.recentTrends.buildTime;
      markdown += `### Build Time\n`;
      markdown += `- **Trend**: ${bt.trend}\n`;
      markdown += `- **Average**: ${Math.round(bt.average / 1000)}s\n`;
      markdown += `- **Change per build**: ${bt.changePerBuild}ms\n\n`;

      const bs = report.recentTrends.bundleSize;
      markdown += `### Bundle Size\n`;
      markdown += `- **Trend**: ${bs.trend}\n`;
      markdown += `- **Average**: ${bs.average} KB\n`;
      markdown += `- **Change per build**: ${bs.changePerBuild} KB\n\n`;
    }

    // Recommendations section
    markdown += `## 💡 Recommendations\n\n`;
    report.recommendations.forEach((rec, index) => {
      const priority = rec.priority === 'high' ? '🔴' :
                      rec.priority === 'medium' ? '🟡' :
                      rec.priority === 'low' ? '🟠' : '💚';
      markdown += `### ${index + 1}. ${priority} ${rec.title}\n\n`;
      markdown += `**Category**: ${rec.category}\n\n`;
      markdown += `${rec.description}\n\n`;

      if (rec.suggestions && rec.suggestions.length > 0) {
        markdown += `**Suggestions**:\n`;
        rec.suggestions.forEach(suggestion => {
          markdown += `- ${suggestion}\n`;
        });
        markdown += `\n`;
      }
    });

    // Recent builds section
    markdown += `## 📋 Recent Builds (Last 10)\n\n`;
    markdown += `| Date | Type | Duration | Success | Bundle Size |\n`;
    markdown += `|------|------|----------|---------|-------------|\n`;

    report.buildHistory.slice(-10).reverse().forEach(build => {
      const date = new Date(build.timestamp).toLocaleDateString();
      const duration = Math.round(build.totalDuration / 1000);
      const success = build.success ? '✅' : '❌';
      const bundleTotal = Object.values(build.bundleMetrics || {}).reduce((sum, m) => sum + m.size, 0);

      markdown += `| ${date} | ${build.buildType} | ${duration}s | ${success} | ${bundleTotal} KB |\n`;
    });

    markdown += `\n---\n`;
    markdown += `*This report was generated automatically by the Build Metrics Collector.*\n`;

    const reportFile = 'dist/reports/performance-report.md';
    fs.writeFileSync(reportFile, markdown);
  }

  formatTime(ms) {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`;
    return `${(ms / 60000).toFixed(2)}m`;
  }

  // Integration method for use with other build scripts
  wrapBuildCommand(command, buildType = 'production') {
    return new Promise((resolve, reject) => {
      this.startMetricsCollection(buildType);

      try {
        const startTime = Date.now();
        console.log(`🚀 Executing: ${command}`);

        execSync(command, {
          stdio: 'inherit',
          env: process.env
        });

        const endTime = Date.now();
        this.recordBuildStep('Main Build', endTime - startTime);

        const metrics = this.finishMetricsCollection(true);
        resolve(metrics);
      } catch (error) {
        console.error(`Build failed:`, error.message);
        const metrics = this.finishMetricsCollection(false);
        reject({ error, metrics });
      }
    });
  }
}

// Main execution
if (require.main === module) {
  const collector = new BuildMetricsCollector();

  // Get command from arguments or run a default build
  const args = process.argv.slice(2);
  const command = args.length > 0 ? args.join(' ') : 'npm run build:parallel';
  const buildType = args.includes('development') ? 'development' : 'production';

  console.log('🚀 Build Metrics Collector');
  console.log('=============================\n');

  collector.wrapBuildCommand(command, buildType)
    .then(metrics => {
      if (metrics.success) {
        console.log('\n🎉 Build completed successfully!');
        console.log('📊 Performance report generated with build metrics.');
      } else {
        console.log('\n❌ Build failed - metrics still recorded for analysis.');
      }

      // Generate performance report
      collector.generatePerformanceReport();

      process.exit(metrics.success ? 0 : 1);
    })
    .catch(error => {
      console.error('\n❌ Build metrics collection failed:', error.message);
      process.exit(1);
    });
}

module.exports = BuildMetricsCollector;