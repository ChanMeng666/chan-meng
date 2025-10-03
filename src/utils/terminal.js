/**
 * Terminal Capability Detection
 *
 * Detects terminal capabilities to enable graceful degradation
 * when advanced features aren't supported.
 */

import chalk from 'chalk';
import { stdout } from 'process';

/**
 * Detect terminal capabilities
 * @returns {Object} Capabilities object
 */
export function detectTerminalCapabilities() {
  const capabilities = {
    supportsColor: false,
    colorLevel: 0,
    supportsUnicode: true,
    supportsEmoji: true,
    width: 80,
    height: 24,
    isTTY: false
  };

  // Check if stdout is a TTY
  capabilities.isTTY = stdout.isTTY || false;

  // Check color support via chalk
  if (chalk.supportsColor) {
    capabilities.supportsColor = true;
    capabilities.colorLevel = chalk.supportsColor.level || 0;
  }

  // Enhanced color detection for modern terminals
  // Even if chalk doesn't detect TTY, check TERM and other indicators
  const term = process.env.TERM || '';
  const colorterm = process.env.COLORTERM || '';

  if (!capabilities.supportsColor) {
    // Check for color-capable terminals
    if (term.includes('256color') || term.includes('color') ||
        colorterm === 'truecolor' || colorterm === '24bit' ||
        process.env.WSL_DISTRO_NAME || process.env.WT_SESSION) {
      capabilities.supportsColor = true;
      capabilities.colorLevel = term.includes('256color') ? 2 : 1;
    }
  }

  // Check NO_COLOR environment variable (override all)
  if (process.env.NO_COLOR) {
    capabilities.supportsColor = false;
    capabilities.colorLevel = 0;
  }

  // Get terminal dimensions
  if (stdout.isTTY && stdout.columns && stdout.rows) {
    capabilities.width = stdout.columns;
    capabilities.height = stdout.rows;
  }

  // Unicode/Emoji support detection (heuristic)
  // Assume support unless explicitly disabled or on very old terminals
  const lang = process.env.LANG || '';

  // Known terminals with poor Unicode support
  const poorUnicodeTerms = ['linux', 'vt100', 'vt220'];
  if (poorUnicodeTerms.some(t => term.includes(t))) {
    capabilities.supportsUnicode = false;
    capabilities.supportsEmoji = false;
  }

  // Check for UTF-8 locale
  if (!lang.toLowerCase().includes('utf')) {
    capabilities.supportsUnicode = false;
    capabilities.supportsEmoji = false;
  }

  // Windows Command Prompt has limited emoji support
  if (process.platform === 'win32' && !process.env.WT_SESSION) {
    capabilities.supportsEmoji = false;
  }

  return capabilities;
}

/**
 * Check if terminal meets minimum requirements
 * @param {Object} capabilities - Terminal capabilities
 * @returns {Object} { meets: boolean, issues: string[] }
 */
export function checkMinimumRequirements(capabilities) {
  const issues = [];

  // Minimum width: 80 columns
  if (capabilities.width < 80) {
    issues.push(`Terminal too narrow: ${capabilities.width} columns (need 80+)`);
  }

  // Minimum height: 24 rows
  if (capabilities.height < 24) {
    issues.push(`Terminal too short: ${capabilities.height} rows (need 24+)`);
  }

  // Warn if not a TTY (might be piped/redirected)
  if (!capabilities.isTTY) {
    issues.push('Not running in a TTY (interactive terminal)');
  }

  return {
    meets: issues.length === 0,
    issues
  };
}

/**
 * Get terminal capabilities (cached after first call)
 */
let cachedCapabilities = null;

export function getTerminalCapabilities() {
  if (!cachedCapabilities) {
    cachedCapabilities = detectTerminalCapabilities();
  }
  return cachedCapabilities;
}

/**
 * Format text based on capabilities (helper)
 * @param {string} text - Text to format
 * @param {string} style - Style to apply ('bold', 'dim', 'cyan', etc.)
 * @param {Object} capabilities - Terminal capabilities
 * @returns {string} Formatted text
 */
export function formatText(text, style, capabilities) {
  if (!capabilities.supportsColor) {
    return text;
  }

  // Apply chalk styles if color is supported
  switch (style) {
    case 'bold':
      return chalk.bold(text);
    case 'dim':
      return chalk.dim(text);
    case 'cyan':
      return chalk.cyan(text);
    case 'green':
      return chalk.green(text);
    case 'yellow':
      return chalk.yellow(text);
    case 'red':
      return chalk.red(text);
    case 'magenta':
      return chalk.magenta(text);
    default:
      return text;
  }
}

/**
 * Display terminal info (for debugging)
 * @param {Object} capabilities - Terminal capabilities
 */
export function displayTerminalInfo(capabilities) {
  console.log('Terminal Capabilities:');
  console.log(`  TTY: ${capabilities.isTTY}`);
  console.log(`  Color: ${capabilities.supportsColor} (level ${capabilities.colorLevel})`);
  console.log(`  Unicode: ${capabilities.supportsUnicode}`);
  console.log(`  Emoji: ${capabilities.supportsEmoji}`);
  console.log(`  Size: ${capabilities.width}x${capabilities.height}`);
  console.log(`  Platform: ${process.platform}`);
  console.log(`  TERM: ${process.env.TERM || 'not set'}`);
}
