// server/start.js
// A wrapper script to start the server with better error handling

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the directory name using ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to the main server file
const serverPath = join(__dirname, 'index.js');

console.log('Starting Cricket Academy server...');
console.log(`Server file: ${serverPath}`);

// Spawn the server process
const server = spawn('node', [serverPath], {
  stdio: 'inherit',
  env: process.env
});

// Handle server process events
server.on('error', (error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

server.on('exit', (code, signal) => {
  if (code !== 0) {
    console.error(`Server process exited with code ${code} and signal ${signal}`);
    process.exit(code);
  }
});

// Handle process signals
process.on('SIGINT', () => {
  console.log('Received SIGINT. Shutting down server gracefully...');
  server.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM. Shutting down server gracefully...');
  server.kill('SIGTERM');
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  server.kill('SIGTERM');
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection at:', promise, 'reason:', reason);
  server.kill('SIGTERM');
  process.exit(1);
});