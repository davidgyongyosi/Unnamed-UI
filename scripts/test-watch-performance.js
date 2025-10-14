#!/usr/bin/env node

/**
 * Watch Mode Performance Test
 *
 * Tests watch mode rebuild performance by making changes and measuring rebuild times.
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const processEnv = process.env;

function formatTime(ms) {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

class WatchPerformanceTester {
  constructor() {
    this.watchProcesses = [];
    this.results = [];
    this.originalContent = {};
  }

  async startWatchMode(projectName) {
    return new Promise((resolve, reject) => {
      console.log(`🔄 Starting watch mode for ${projectName}...`);

      const watchProcess = spawn('ng', ['build', projectName, '--watch', '--configuration', 'development'], {
        stdio: ['pipe', 'pipe', 'pipe'],
        env: processEnv
      });

      let isReady = false;
      let outputBuffer = '';

      const onData = (data) => {
        const output = data.toString();
        outputBuffer += output;

        // Look for completion indicators
        if (output.includes('Watching for file changes') ||
            output.includes('Live reload server') ||
            output.includes('Compiled successfully')) {
          if (!isReady) {
            isReady = true;
            console.log(`✅ ${projectName} watch mode ready`);
            resolve(watchProcess);
          }
        }
      };

      watchProcess.stdout.on('data', onData);
      watchProcess.stderr.on('data', onData);

      watchProcess.on('error', (error) => {
        console.error(`❌ Failed to start watch for ${projectName}:`, error.message);
        reject(error);
      });

      watchProcess.on('close', (code) => {
        if (!isReady) {
          console.error(`❌ Watch process for ${projectName} exited with code ${code}`);
          console.error('Output:', outputBuffer);
          reject(new Error(`Watch process exited unexpectedly: ${code}`));
        }
      });

      // Timeout after 30 seconds
      setTimeout(() => {
        if (!isReady) {
          console.error(`❌ Watch mode for ${projectName} failed to start within 30 seconds`);
          watchProcess.kill();
          reject(new Error('Watch mode startup timeout'));
        }
      }, 30000);
    });
  }

  async startAllWatchModes() {
    const projects = ['ngx-unnamed', 'ngx-unnamed-icons'];

    for (const project of projects) {
      try {
        const watchProcess = await this.startWatchMode(project);
        this.watchProcesses.push({ name: project, process: watchProcess });

        // Small delay between starting watch modes
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`Failed to start watch mode for ${project}:`, error.message);
        throw error;
      }
    }
  }

  backupFiles() {
    const filesToTest = [
      'projects/ngx-unnamed/src/lib/components/button/button.component.ts',
      'projects/ngx-unnamed-icons/src/public-api.ts'
    ];

    filesToTest.forEach(filePath => {
      if (fs.existsSync(filePath)) {
        this.originalContent[filePath] = fs.readFileSync(filePath, 'utf8');
      }
    });
  }

  restoreFiles() {
    for (const [filePath, content] of Object.entries(this.originalContent)) {
      if (fs.existsSync(filePath) && content) {
        fs.writeFileSync(filePath, content);
      }
    }
  }

  async makeChangeAndMeasure(projectName, filePath, changeDescription) {
    return new Promise((resolve, reject) => {
      console.log(`📝 Making change to ${filePath}: ${changeDescription}`);

      const startTime = Date.now();
      let rebuildDetected = false;

      // Find the watch process for this project
      const watchProcessInfo = this.watchProcesses.find(wp => wp.name === projectName);
      if (!watchProcessInfo) {
        reject(new Error(`No watch process found for ${projectName}`));
        return;
      }

      const { process: watchProcess } = watchProcessInfo;

      // Listen for rebuild output
      const onData = (data) => {
        const output = data.toString();

        if (output.includes('Compilation complete') ||
            output.includes('Compiled successfully') ||
            output.includes('Build at')) {
          if (!rebuildDetected) {
            rebuildDetected = true;
            const rebuildTime = Date.now() - startTime;

            const result = {
              project: projectName,
              file: filePath,
              change: changeDescription,
              rebuildTime,
              timestamp: new Date().toISOString()
            };

            this.results.push(result);
            console.log(`⚡ ${projectName} rebuild completed in ${formatTime(rebuildTime)}`);

            // Remove listener after rebuild detected
            watchProcess.stdout.removeListener('data', onData);
            watchProcess.stderr.removeListener('data', onData);

            resolve(result);
          }
        }
      };

      watchProcess.stdout.on('data', onData);
      watchProcess.stderr.on('data', onData);

      // Make the actual change
      try {
        let content = fs.readFileSync(filePath, 'utf8');

        // Add a small comment change
        if (filePath.endsWith('.ts')) {
          content += `\n// Test change: ${changeDescription} at ${Date.now()}\n`;
        } else if (filePath.endsWith('.scss')) {
          content += `\n/* Test change: ${changeDescription} */\n`;
        }

        fs.writeFileSync(filePath, content);

        // Timeout after 15 seconds
        setTimeout(() => {
          if (!rebuildDetected) {
            watchProcess.stdout.removeListener('data', onData);
            watchProcess.stderr.removeListener('data', onData);
            reject(new Error(`Rebuild timeout for ${filePath}`));
          }
        }, 15000);

      } catch (error) {
        watchProcess.stdout.removeListener('data', onData);
        watchProcess.stderr.removeListener('data', onData);
        reject(error);
      }
    });
  }

  async runPerformanceTests() {
    console.log('🧪 Starting watch mode performance tests...\n');

    try {
      // Backup original files
      this.backupFiles();

      // Start watch modes
      await this.startAllWatchModes();

      // Wait a bit for everything to stabilize
      console.log('\n⏳ Waiting for watch modes to stabilize...');
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Test different types of changes
      const tests = [
        {
          project: 'ngx-unnamed',
          file: 'projects/ngx-unnamed/src/lib/components/button/button.component.ts',
          change: 'Button component comment change'
        },
        {
          project: 'ngx-unnamed-icons',
          file: 'projects/ngx-unnamed-icons/src/public-api.ts',
          change: 'Icons public API comment change'
        }
      ];

      console.log('\n🚀 Running performance tests...');

      for (let i = 0; i < tests.length; i++) {
        const test = tests[i];
        console.log(`\n${i + 1}/${tests.length}: Testing ${test.project}`);

        try {
          await this.makeChangeAndMeasure(test.project, test.file, test.change);

          // Wait between tests
          await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
          console.error(`❌ Test failed for ${test.project}:`, error.message);
        }
      }

      // Analyze results
      this.analyzeResults();

    } finally {
      // Cleanup
      await this.cleanup();
    }
  }

  analyzeResults() {
    console.log('\n📊 Watch Mode Performance Analysis');
    console.log('=====================================');

    if (this.results.length === 0) {
      console.log('❌ No rebuild measurements captured');
      return;
    }

    const resultsByProject = {};
    this.results.forEach(result => {
      if (!resultsByProject[result.project]) {
        resultsByProject[result.project] = [];
      }
      resultsByProject[result.project].push(result);
    });

    console.log('\n📈 Rebuild Times by Project:');

    let allTimes = [];
    for (const [project, projectResults] of Object.entries(resultsByProject)) {
      const times = projectResults.map(r => r.rebuildTime);
      const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
      const minTime = Math.min(...times);
      const maxTime = Math.max(...times);

      allTimes.push(...times);

      console.log(`\n${project}:`);
      console.log(`  Average: ${formatTime(avgTime)}`);
      console.log(`  Min: ${formatTime(minTime)}`);
      console.log(`  Max: ${formatTime(maxTime)}`);
      console.log(`  Tests: ${times.length}`);

      projectResults.forEach((result, index) => {
        console.log(`    Test ${index + 1}: ${formatTime(result.rebuildTime)} - ${result.change}`);
      });
    }

    // Overall analysis
    const overallAvg = allTimes.reduce((a, b) => a + b, 0) / allTimes.length;
    const overallMin = Math.min(...allTimes);
    const overallMax = Math.max(...allTimes);

    console.log(`\n🎯 Overall Performance:`);
    console.log(`  Average: ${formatTime(overallAvg)}`);
    console.log(`  Fastest: ${formatTime(overallMin)}`);
    console.log(`  Slowest: ${formatTime(overallMax)}`);

    // Check 10-second target
    const target10Sec = 10 * 1000;
    const meetsTarget = overallAvg < target10Sec;

    console.log(`\n🎯 10-Second Target: ${meetsTarget ? '✅' : '❌'} ${formatTime(target10Sec)} ${meetsTarget ? 'MET' : 'NOT MET'}`);

    if (!meetsTarget) {
      console.log('⚠️  Watch mode rebuilds exceed 10-second target. Consider optimizations:');
      console.log('   - Reduce number of files processed');
      console.log('   - Exclude non-essential files from watch');
      console.log('   - Optimize TypeScript configuration');
      console.log('   - Use file watching exclusions');
    } else {
      console.log('✅ Watch mode performance is excellent!');
    }

    // Save results
    const reportPath = 'dist/reports/watch-performance.json';
    if (!fs.existsSync('dist/reports')) {
      fs.mkdirSync('dist/reports', { recursive: true });
    }

    const report = {
      timestamp: new Date().toISOString(),
      results: this.results,
      analysis: {
        overallAverage: overallAvg,
        overallMin,
        overallMax,
        meets10SecondTarget: meetsTarget,
        resultsByProject
      }
    };

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📁 Detailed report saved to: ${reportPath}`);

    return meetsTarget;
  }

  async cleanup() {
    console.log('\n🧹 Cleaning up...');

    // Restore original files
    this.restoreFiles();

    // Kill watch processes
    for (const watchProcessInfo of this.watchProcesses) {
      try {
        console.log(`🛑 Stopping watch mode for ${watchProcessInfo.name}`);
        watchProcessInfo.process.kill('SIGTERM');

        // Force kill if it doesn't stop gracefully
        setTimeout(() => {
          try {
            watchProcessInfo.process.kill('SIGKILL');
          } catch (e) {
            // Process already dead
          }
        }, 2000);
      } catch (error) {
        console.warn(`Warning: Could not stop watch process for ${watchProcessInfo.name}:`, error.message);
      }
    }

    // Wait for processes to fully terminate
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log('✅ Cleanup completed');
  }
}

// Main execution
if (require.main === module) {
  const tester = new WatchPerformanceTester();

  tester.runPerformanceTests()
    .then(meetsTarget => {
      if (meetsTarget) {
        console.log('\n🎉 Watch mode performance meets targets!');
        process.exit(0);
      } else {
        console.log('\n⚠️ Watch mode performance needs improvement');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('\n❌ Watch performance test failed:', error.message);
      process.exit(1);
    });
}

module.exports = WatchPerformanceTester;