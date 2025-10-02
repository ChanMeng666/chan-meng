#!/usr/bin/env node

/**
 * chan-meng CLI - Entry Point
 *
 * An interactive CLI to meet Chan Meng and explore her minimalist philosophy.
 * Run via: npx chan-meng
 */

import { startCLI } from './src/cli.js';

// Start the CLI application
startCLI().catch((error) => {
  console.error('An unexpected error occurred:', error.message);
  process.exit(1);
});
