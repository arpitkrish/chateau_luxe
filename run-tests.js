#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Chateau Luxe Testing Suite\n');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(color, message) {
  console.log(`${color}${message}${colors.reset}`);
}

async function runCommand(command, args, description) {
  return new Promise((resolve, reject) => {
    log(colors.blue, `📋 Running: ${description}`);

    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      cwd: path.join(__dirname)
    });

    child.on('close', (code) => {
      if (code === 0) {
        log(colors.green, `✅ ${description} - PASSED`);
        resolve();
      } else {
        log(colors.red, `❌ ${description} - FAILED (exit code: ${code})`);
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    child.on('error', (error) => {
      log(colors.red, `❌ ${description} - ERROR: ${error.message}`);
      reject(error);
    });
  });
}

async function runTests() {
  try {
    // Check if dependencies are installed
    log(colors.yellow, '🔍 Checking test dependencies...');
    try {
      require('jest');
      require('supertest');
      log(colors.green, '✅ Dependencies OK');
    } catch (error) {
      log(colors.red, '❌ Missing test dependencies. Run: npm install');
      throw error;
    }

    // Run unit tests
    log(colors.cyan, '\n🧪 Running Unit Tests...');
    await runCommand('npx', ['jest', 'tests/User.test.js', '--verbose'], 'Unit Tests');

    // Run integration tests
    log(colors.cyan, '\n🔗 Running Integration Tests...');
    await runCommand('npx', ['jest', 'tests/api.integration.test.js', '--verbose'], 'Integration Tests');

    // Run legacy API tests
    log(colors.cyan, '\n🌐 Running Legacy API Tests...');
    await runCommand('node', ['test-apis.js'], 'Legacy API Tests');

    log(colors.green, '\n🎉 All tests completed successfully!');
    log(colors.magenta, '📊 Run "npm test -- --coverage" for detailed coverage report');

  } catch (error) {
    log(colors.red, `\n💥 Testing failed: ${error.message}`);
    process.exit(1);
  }
}

// Check if server is running for integration tests
async function checkServer() {
  const http = require('http');

  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3001,
      path: '/',
      method: 'GET',
      timeout: 2000
    }, (res) => {
      resolve(true);
    });

    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}

async function main() {
  log(colors.magenta, '🏨 Chateau Luxe Hotel Management System - Testing Suite');
  log(colors.magenta, '=' .repeat(60));

  // Check if server is running
  const serverRunning = await checkServer();
  if (!serverRunning) {
    log(colors.yellow, '⚠️  Warning: Server not detected on port 3001');
    log(colors.yellow, '   Integration tests may fail. Start server with: npm run dev');
  } else {
    log(colors.green, '✅ Server detected on port 3001');
  }

  await runTests();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { runTests, checkServer };