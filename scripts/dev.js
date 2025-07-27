#!/usr/bin/env bun

const { spawn } = require('child_process');

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

// Start Next.js dev with filtered arguments
const nextDev = spawn('bunx', ['next', 'dev', '--turbopack', '-p', '7777', ...nextArgs], {
  stdio: 'inherit',
  shell: true
});

nextDev.on('error', (error) => {
  console.error(`Error starting dev server: ${error}`);
  process.exit(1);
});

nextDev.on('close', (code) => {
  process.exit(code);
});