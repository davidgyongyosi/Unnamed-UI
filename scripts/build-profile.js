#!/usr/bin/env node

/**
 * Build Performance Profiler
 *
 * Profiles build performance to identify bottlenecks and optimize build times.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function formatTime(ms) {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`;
  return `${(ms / 60000).toFixed(2)}m`;
}

function runCommandWithTiming(command, description) {
  console.log(`🔄 ${description}...`);
  const startTime = Date.now();

  try {
    execSync(command, {
      encoding: 'utf8',
      stdio: 'pipe',
      env: { ...process.env, NG_BUILD_TIMING: 'true' }
    });

    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log(`✅ ${description} completed in ${formatTime(duration)}`);
    return { success: true, duration, startTime, endTime };
  } catch (error) {
    const endTime = Date.now();
    const duration = endTime - startTime;

    console.error(`❌ ${description} failed after ${formatTime(duration)}:`, error.message);
    return { success: false, duration, startTime, endTime, error: error.message };
  }
}

function cleanDist() {
  console.log('🧹 Cleaning dist directories...');
  try {
    if (fs.existsSync('dist')) {
      fs.rmSync('dist', { recursive: true, force: true });
    }
    console.log('✅ Dist directories cleaned');
  } catch (error) {
    console.warn('⚠️ Warning: Could not clean dist directories:', error.message);
  }
}

function profileParallelBuilds() {
  console.log('\n🚀 Profiling parallel builds...\n');

  const results = {
    cleanDist: {},
    parallelBuilds: {},
    individualBuilds: {},
    summary: {}
  };

  // Clean dist first
  cleanDist();

  // Profile parallel builds
  console.log('1️⃣ Testing parallel builds...');
  const parallelStart = Date.now();

  // Run builds in parallel using spawn to get proper timing
  const { spawn } = require('child_process');
  const processEnv = process.env;

  const buildPromises = [
    new Promise((resolve) => {
      const startTime = Date.now();
      const childProcess = spawn('ng', ['build', 'ngx-unnamed', '--configuration', 'production'], {
        stdio: 'pipe',
        env: processEnv
      });

      childProcess.on('close', (code) => {
        const duration = Date.now() - startTime;
        resolve({
          library: 'ngx-unnamed',
          success: code === 0,
          duration,
          startTime
        });
      });
    }),

    new Promise((resolve) => {
      const startTime = Date.now();
      const childProcess = spawn('ng', ['build', 'ngx-unnamed-icons', '--configuration', 'production'], {
        stdio: 'pipe',
        env: processEnv
      });

      childProcess.on('close', (code) => {
        const duration = Date.now() - startTime;
        resolve({
          library: 'ngx-unnamed-icons',
          success: code === 0,
          duration,
          startTime
        });
      });
    })
  ];

  Promise.all(buildPromises).then((buildResults) => {
    const parallelEnd = Date.now();
    const parallelDuration = parallelEnd - parallelStart;

    results.parallelBuilds = {
      totalTime: parallelDuration,
      builds: buildResults,
      success: buildResults.every(r => r.success)
    };

    console.log(`\n📊 Parallel Build Results:`);
    console.log(`   Total Time: ${formatTime(parallelDuration)}`);
    buildResults.forEach(result => {
      const status = result.success ? '✅' : '❌';
      console.log(`   ${result.library}: ${formatTime(result.duration)} ${status}`);
    });

    // Profile individual builds for comparison
    console.log('\n2️⃣ Testing individual builds...');

    cleanDist();
    const ngxUnnamedResult = runCommandWithTiming(
      'ng build ngx-unnamed --configuration production',
      'Building ngx-unnamed individually'
    );

    cleanDist();
    const ngxIconsResult = runCommandWithTiming(
      'ng build ngx-unnamed-icons --configuration production',
      'Building ngx-unnamed-icons individually'
    );

    results.individualBuilds = {
      'ngx-unnamed': ngxUnnamedResult,
      'ngx-unnamed-icons': ngxIconsResult,
      totalTime: ngxUnnamedResult.duration + ngxIconsResult.duration
    };

    // Generate summary
    const totalIndividualTime = results.individualBuilds.totalTime;
    const totalParallelTime = results.parallelBuilds.totalTime;
    const speedup = ((totalIndividualTime - totalParallelTime) / totalIndividualTime * 100).toFixed(1);

    results.summary = {
      individualBuildTime: totalIndividualTime,
      parallelBuildTime: totalParallelTime,
      speedupPercent: parseFloat(speedup),
      parallelFaster: totalParallelTime < totalIndividualTime
    };

    console.log('\n📈 Performance Summary:');
    console.log(`   Individual Builds: ${formatTime(totalIndividualTime)}`);
    console.log(`   Parallel Builds: ${formatTime(totalParallelTime)}`);
    console.log(`   Speedup: ${speedup}% (${results.summary.parallelFaster ? '✅ Parallel is faster' : '❌ Parallel is slower'})`);

    // Check 5-minute target
    const target5Min = 5 * 60 * 1000; // 5 minutes in ms
    const meetsTarget = totalParallelTime < target5Min;

    console.log(`   5-min Target: ${meetsTarget ? '✅' : '❌'} ${formatTime(target5Min)} ${meetsTarget ? 'met' : 'NOT met'}`);

    // Save results
    const reportPath = 'dist/reports/build-profile.json';
    if (!fs.existsSync('dist/reports')) {
      fs.mkdirSync('dist/reports', { recursive: true });
    }

    fs.writeFileSync(reportPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      results,
      recommendations: generateRecommendations(results)
    }, null, 2));

    console.log(`\n📁 Detailed report saved to: ${reportPath}`);

    if (!meetsTarget) {
      console.log('\n⚠️ Build time exceeds 5-minute target. Consider additional optimizations.');
      process.exit(1);
    } else {
      console.log('\n✅ Build time meets 5-minute target!');
    }
  });
}

function generateRecommendations(results) {
  const recommendations = [];

  if (results.summary.parallelFaster) {
    recommendations.push('✅ Parallel builds are faster - continue using parallel build strategy');
  } else {
    recommendations.push('⚠️ Consider using sequential builds for this project');
  }

  if (results.summary.parallelBuildTime > 4 * 60 * 1000) { // 4 minutes
    recommendations.push('⚠️ Build time is approaching 5-minute limit - consider further optimizations');
  }

  // Check individual build times
  const ngxBuild = results.individualBuilds['ngx-unnamed'];
  const iconsBuild = results.individualBuilds['ngx-unnamed-icons'];

  if (ngxBuild.duration > 90 * 1000) { // 90 seconds
    recommendations.push('🔧 ngx-unnamed build is slow - check for large assets or complex styles');
  }

  if (iconsBuild.duration > 60 * 1000) { // 60 seconds
    recommendations.push('🔧 ngx-unnamed-icons build is slow - consider optimizing SVG assets');
  }

  recommendations.push('💡 Use the parallel build script: npm run build:parallel');
  recommendations.push('💡 Monitor build times regularly with this profiler');

  return recommendations;
}

// Main execution
if (require.main === module) {
  console.log('🔍 Build Performance Profiler');
  console.log('=====================================\n');

  profileParallelBuilds();
}

module.exports = {
  runCommandWithTiming,
  profileParallelBuilds,
  formatTime
};