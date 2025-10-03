#!/usr/bin/env node

/**
 * chan-meng CLI - Entry Point
 *
 * An interactive CLI to meet Chan Meng and explore her minimalist philosophy.
 * Run via: npx chan-meng
 */

// Force color support for better cross-platform experience
// This ensures colors work in npx, piped output, and all terminals
if (!process.env.FORCE_COLOR && !process.env.NO_COLOR) {
  // Level 2 = 256 colors (widely supported)
  // Level 3 = 16 million colors (truecolor)
  process.env.FORCE_COLOR = '2';
}

import { startCLI } from './src/cli.js';

// Start the CLI application
startCLI().catch((error) => {
  console.error('An unexpected error occurred:', error.message);
  process.exit(1);
});
