#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧹 Cleaning development environment...');

// Remove .next directory if it exists
const nextDir = path.join(process.cwd(), '.next');
if (fs.existsSync(nextDir)) {
  console.log('Removing .next directory...');
  execSync('rm -rf .next', { stdio: 'inherit' });
}

console.log('✅ Environment cleaned!');
console.log('🚀 Starting development server...');

// Start the development server
execSync('next dev', { stdio: 'inherit' });