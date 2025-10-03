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

  // Get environment variables for color detection
  const term = process.env.TERM || '';
  const colorterm = process.env.COLORTERM || '';
  const forceColor = process.env.FORCE_COLOR;

  // Check NO_COLOR first (highest priority - user wants no color)
  if (process.env.NO_COLOR) {
    capabilities.supportsColor = false;
    capabilities.colorLevel = 0;
  }
  // Check FORCE_COLOR (second priority - explicitly requested)
  else if (forceColor !== undefined && forceColor !== '0' && forceColor !== 'false') {
    capabilities.supportsColor = true;
    // Map FORCE_COLOR values to chalk levels
    const level = parseInt(forceColor, 10);
    capabilities.colorLevel = isNaN(level) ? 1 : Math.min(Math.max(level, 1), 3);
  }
  // Check chalk's detection (third priority)
  else if (chalk.supportsColor) {
    capabilities.supportsColor = true;
    capabilities.colorLevel = chalk.supportsColor.level || 0;
  }
  // Fallback: Enhanced detection for modern terminals (fourth priority)
  else if (
    term.includes('256color') ||
    term.includes('color') ||
    colorterm === 'truecolor' ||
    colorterm === '24bit' ||
    process.env.WSL_DISTRO_NAME ||
    process.env.WT_SESSION ||
    process.env.COLORTERM
  ) {
    capabilities.supportsColor = true;
    capabilities.colorLevel = term.includes('256color') || colorterm === 'truecolor' ? 2 : 1;
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
 * @returns {Object} { meets: boolean, issues: string[], warnings: string[] }
 */
export function checkMinimumRequirements(capabilities) {
  const issues = [];
  const warnings = [];

  // Minimum width: 80 columns (only check if we have column info)
  if (capabilities.width && capabilities.width < 80) {
    issues.push(`Terminal too narrow: ${capabilities.width} columns (need 80+)`);
  }

  // Minimum height: 24 rows (only check if we have row info)
  if (capabilities.height && capabilities.height < 24) {
    issues.push(`Terminal too short: ${capabilities.height} rows (need 24+)`);
  }

  // Not being in a TTY is just a warning, not a blocking issue
  // Many tools (like npx in non-interactive mode) work fine without TTY
  if (!capabilities.isTTY) {
    warnings.push('Running in non-TTY mode (this is usually fine)');
  }

  return {
    meets: issues.length === 0,
    issues,
    warnings
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
