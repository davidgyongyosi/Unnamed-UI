#!/bin/bash

echo "🚀 Testing GitHub Actions Workflows Locally"
echo "=========================================="

# Function to run a test and check results
run_test() {
    local test_name="$1"
    local command="$2"

    echo ""
    echo "📋 Testing: $test_name"
    echo "Command: $command"
    echo "----------------------------------------"

    if eval "$command"; then
        echo "✅ SUCCESS: $test_name"
        return 0
    else
        echo "❌ FAILED: $test_name"
        return 1
    fi
}

# Test 1: Deploy Documentation Workflow
echo ""
echo "🔧 Testing Deploy Documentation Workflow"
echo "======================================="

run_test "Build ngx-unnamed-icons library" "npm run build -- ngx-unnamed-icons" && \
run_test "Build ngx-unnamed library" "npm run build -- ngx-unnamed" && \
run_test "Generate Compodoc documentation" "npx compodoc -p projects/ngx-unnamed/tsconfig.lib.json -d docs-compodoc --theme material --disablePrivate --disableInternal" && \
run_test "Build Storybook" "npm run build-storybook"

# Test 2: Lighthouse CI Workflow (modified for local testing)
echo ""
echo "🔧 Testing Lighthouse CI Workflow"
echo "================================="

run_test "Build libraries for Lighthouse" "npm run build -- ngx-unnamed-icons && npm run build -- ngx-unnamed" && \
run_test "Build playground app" "npm run build:prod -- playground"

# Test 3: Angular CLI serve command fix
echo ""
echo "🔧 Testing Angular CLI Commands"
echo "=============================="

run_test "Test ng serve help" "ng serve --help | grep -q 'host'" && \
echo "✅ Angular CLI supports --host option" || \
echo "❌ Angular CLI --host option issue found"

# Test 4: Test basic npm scripts
echo ""
echo "🔧 Testing Basic NPM Scripts"
echo "============================"

run_test "Test npm build command" "npm run build --help" && \
run_test "Test Angular CLI version" "ng version"

echo ""
echo "🏁 Local Testing Complete"
echo "========================="
echo "If all tests passed, the GitHub Actions should work!"
echo ""
echo "⚠️  Note: Some workflow features like:"
echo "   - Chromatic (requires project token)"
echo "   - Lighthouse CI server upload"
echo "   - GitHub Pages deployment"
echo "   cannot be fully tested locally but the core build steps are verified."