#!/usr/bin/env bun

const { spawn } = require('child_process');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);

// Check for revalidate flags and set environment variable
const hasRevalidateFlag = args.some(arg =>
  arg.includes('--revalidate') || arg === '-r'
);

if (hasRevalidateFlag) {
  process.env.CACHE_REVALIDATE = 'true';
}

// Filter out our custom flags
const nextArgs = args.filter(arg =>
  !arg.includes('--revalidate') &&
  arg !== '-r'
);

// Start Python YouTube Music API server
const projectRoot = path.join(__dirname, '..');
const pythonServerPath = path.join(projectRoot, 'python-server');
const runScript = path.join(pythonServerPath, 'run.sh');

console.log('🎵 Starting YouTube Music API server...');

const pythonDev = spawn(runScript, [], {
  stdio: 'inherit',
  cwd: pythonServerPath,
  shell: true
});

pythonDev.on('error', (error) => {
  console.error(`⚠️  Python server error: ${error.message}`);
  console.log('⚠️  YouTube Music features may not work');
});

// Start Next.js dev with filtered arguments
const nextDev = spawn('bunx', ['next', 'dev', '--turbopack', '-p', '7777', ...nextArgs], {
  stdio: 'inherit',
  shell: true
});

nextDev.on('error', (error) => {
  console.error(`Error starting dev server: ${error}`);
  process.exit(1);
});

// Graceful shutdown - kill both processes
const cleanup = () => {
  console.log('\n🛑 Shutting down servers...');
  pythonDev.kill();
  nextDev.kill();
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

nextDev.on('close', (code) => {
  pythonDev.kill();
  process.exit(code);
});