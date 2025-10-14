#!/usr/bin/env node

/**
 * Parallel Build Script
 *
 * Builds all libraries in parallel for faster CI/CD pipelines.
 */

const { spawn } = require('child_process');
const processEnv = process.env;

function buildLibrary(libraryName) {
  return new Promise((resolve, reject) => {
    console.log(`🔄 Building ${libraryName}...`);
    const startTime = Date.now();

    const childProcess = spawn('ng', ['build', libraryName, '--configuration', 'production'], {
      stdio: 'inherit',
      env: { ...processEnv, NG_BUILD_PARALLEL: 'true' }
    });

    childProcess.on('close', (code) => {
      const duration = Date.now() - startTime;

      if (code === 0) {
        console.log(`✅ ${libraryName} completed in ${(duration / 1000).toFixed(2)}s`);
        resolve({ library: libraryName, success: true, duration });
      } else {
        console.error(`❌ ${libraryName} failed with exit code ${code}`);
        reject(new Error(`${libraryName} build failed`));
      }
    });

    childProcess.on('error', (error) => {
      console.error(`❌ ${libraryName} failed:`, error.message);
      reject(error);
    });
  });
}

async function buildAllParallel() {
  const startTime = Date.now();
  console.log('🚀 Starting parallel builds...\n');

  const libraries = ['ngx-unnamed', 'ngx-unnamed-icons'];

  try {
    // Start all builds in parallel
    const buildPromises = libraries.map(buildLibrary);

    // Wait for all builds to complete
    const results = await Promise.all(buildPromises);

    const totalTime = Date.now() - startTime;
    const allSuccessful = results.every(r => r.success);

    console.log('\n📊 Build Summary:');
    console.log(`   Total Time: ${(totalTime / 1000).toFixed(2)}s`);
    results.forEach(result => {
      const status = result.success ? '✅' : '❌';
      console.log(`   ${result.library}: ${(result.duration / 1000).toFixed(2)}s ${status}`);
    });

    if (allSuccessful) {
      console.log('\n🎉 All builds completed successfully!');

      // Run bundle size check after successful builds
      console.log('\n📦 Running bundle size analysis...');
      try {
        const { spawn } = require('child_process');
        const bundleProcess = spawn('node', ['scripts/bundle-size-check.js'], {
          stdio: 'inherit',
          env: processEnv
        });

        bundleProcess.on('close', (code) => {
          if (code === 0) {
            console.log('\n✅ Parallel builds and bundle size check completed successfully!');
            process.exit(0);
          } else {
            console.log('\n⚠️ Builds completed but bundle size check failed');
            process.exit(1);
          }
        });
      } catch (error) {
        console.warn('⚠️ Could not run bundle size check:', error.message);
        process.exit(0);
      }
    } else {
      console.log('\n❌ Some builds failed');
      process.exit(1);
    }

  } catch (error) {
    console.error('\n❌ Parallel build failed:', error.message);
    process.exit(1);
  }
}

// Build specific libraries if provided as arguments
const args = process.argv.slice(2);
if (args.length > 0) {
  console.log(`🚀 Building specified libraries: ${args.join(', ')}\n`);

  Promise.all(args.map(buildLibrary))
    .then((results) => {
      console.log('\n🎉 Specified builds completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Specified builds failed:', error.message);
      process.exit(1);
    });
} else {
  // Build all libraries
  buildAllParallel();
}