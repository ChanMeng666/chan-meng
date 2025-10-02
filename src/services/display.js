/**
 * Display Utilities
 *
 * Handles all terminal display logic with graceful degradation
 * for terminals with limited capabilities.
 */

import chalk from 'chalk';
import boxen from 'boxen';
import { getTerminalCapabilities } from '../utils/terminal.js';

// Lazy load heavy modules
let figlet = null;
let gradientString = null;

async function loadFiglet() {
  if (!figlet) {
    figlet = (await import('figlet')).default;
  }
  return figlet;
}

async function loadGradient() {
  if (!gradientString) {
    gradientString = (await import('gradient-string')).default;
  }
  return gradientString;
}

/**
 * Display welcome screen with ASCII art
 * @param {Object} capabilities - Terminal capabilities
 */
export async function displayWelcome(capabilities = null) {
  capabilities = capabilities || getTerminalCapabilities();

  console.log('\n');

  // Try to display ASCII art title
  if (capabilities.supportsColor && capabilities.width >= 80) {
    try {
      const fig = await loadFiglet();
      const gradient = await loadGradient();

      // Main title with big, bold ASCII art
      const asciiTitle = fig.textSync('CHAN MENG', {
        font: 'ANSI Shadow',
        horizontalLayout: 'default',
        verticalLayout: 'default'
      });

      // Apply gradient (cyan to magenta, similar to Gemini CLI)
      console.log(gradient.cyan.magenta.multiline(asciiTitle));

      // Subtitle with Chinese text
      const subtitle = fig.textSync('Ji Jian Sheng Huo', {
        font: 'Small',
        horizontalLayout: 'default'
      });

      console.log(gradient.cristal.multiline(subtitle));
      console.log(chalk.dim.gray('                           极简生活 · Minimalist Living\n'));

      // Decorative line
      const decorativeLine = '─'.repeat(Math.min(capabilities.width - 4, 80));
      console.log(gradient.atlas(decorativeLine));

    } catch (error) {
      // Fallback to simple title with gradient
      try {
        const gradient = await loadGradient();
        const simpleTitle = '\n█▀▀ █░█ ▄▀█ █▄░█   █▀▄▀█ █▀▀ █▄░█ █▀▀\n█▄▄ █▀█ █▀█ █░▀█   █░▀░█ ██▄ █░▀█ █▄█\n';
        console.log(gradient.cyan.magenta(simpleTitle));
        console.log(chalk.dim.gray('     极简生活 · Minimalist Living\n'));
      } catch (err) {
        // Final fallback
        console.log(chalk.bold.cyan('='.repeat(50)));
        console.log(chalk.bold.cyan('           CHAN MENG'));
        console.log(chalk.dim.gray('         极简生活 · Minimalist Living'));
        console.log(chalk.bold.cyan('='.repeat(50)));
      }
    }
  } else {
    // Simple fallback
    console.log('='.repeat(50));
    console.log('           CHAN MENG');
    console.log('      极简生活 · Minimalist Living');
    console.log('='.repeat(50));
  }

  console.log('\n');
}

/**
 * Display main menu
 * @param {Array} modules - Array of module objects
 * @param {Array} visitedModules - Array of visited module IDs
 * @param {Object} capabilities - Terminal capabilities
 */
export function displayMenu(modules, visitedModules = [], capabilities = null) {
  capabilities = capabilities || getTerminalCapabilities();

  const supportsColor = capabilities.supportsColor;
  const supportsEmoji = capabilities.supportsEmoji;

  console.log('\n');

  if (supportsColor) {
    console.log(chalk.bold.cyan('📖  Choose Your Journey:'));
  } else {
    console.log('Choose Your Journey:');
  }

  console.log('\n');

  modules.forEach((module, index) => {
    const number = `${index + 1}.`;
    const icon = supportsEmoji ? module.icon || '▸' : '>';
    const visited = visitedModules.includes(module.id) ? (supportsEmoji ? ' ✓' : ' [visited]') : '';
    const time = module.estimatedTime ? ` (~${Math.ceil(module.estimatedTime / 60)}min)` : '';

    let line = `${number} ${icon} ${module.title}${visited}${time}`;

    if (supportsColor) {
      const titleColor = visitedModules.includes(module.id) ? chalk.dim.cyan : chalk.cyan;
      line = `${chalk.bold(number)} ${icon} ${titleColor(module.title)}${chalk.dim(visited)}${chalk.dim.gray(time)}`;
    }

    console.log(`  ${line}`);

    if (module.description) {
      const desc = supportsColor
        ? chalk.dim.gray(`     ${module.description}`)
        : `     ${module.description}`;
      console.log(desc);
    }

    console.log('');
  });
}

/**
 * Display a story segment
 * @param {Object} segment - Segment object
 * @param {Object} module - Module object
 * @param {Object} capabilities - Terminal capabilities
 */
export function displaySegment(segment, module = null, capabilities = null) {
  capabilities = capabilities || getTerminalCapabilities();

  const supportsColor = capabilities.supportsColor;
  const maxWidth = Math.min(capabilities.width - 4, 100);

  console.log('\n');

  // Module context (if provided)
  if (module) {
    const moduleHeader = supportsColor
      ? chalk.dim.cyan(`[${module.title}]`)
      : `[${module.title}]`;
    console.log(moduleHeader);
  }

  // Segment title
  if (segment.title) {
    const title = supportsColor
      ? chalk.bold.white(segment.title)
      : segment.title;

    if (supportsColor && capabilities.width >= 80) {
      console.log(boxen(title, {
        padding: { left: 2, right: 2, top: 0, bottom: 0 },
        margin: { top: 1, bottom: 1 },
        borderStyle: 'round',
        borderColor: 'cyan'
      }));
    } else {
      console.log(`\n${title}\n`);
    }
  }

  // Segment content
  const content = segment.content || '';
  const lines = content.split('\n');

  lines.forEach(line => {
    // Wrap long lines if needed
    if (line.length > maxWidth) {
      const words = line.split(' ');
      let currentLine = '';

      words.forEach(word => {
        if ((currentLine + word).length > maxWidth) {
          console.log(currentLine.trim());
          currentLine = word + ' ';
        } else {
          currentLine += word + ' ';
        }
      });

      if (currentLine.trim()) {
        console.log(currentLine.trim());
      }
    } else {
      console.log(line);
    }
  });

  // Metadata (if present)
  if (segment.metadata) {
    console.log('');

    if (segment.metadata.quote) {
      const quote = supportsColor
        ? chalk.italic.dim(`"${segment.metadata.quote}"`)
        : `"${segment.metadata.quote}"`;

      console.log(`  ${quote}`);
    }

    if (segment.metadata.year) {
      const year = supportsColor
        ? chalk.dim.gray(`  Year: ${segment.metadata.year}`)
        : `  Year: ${segment.metadata.year}`;
      console.log(year);
    }

    if (segment.metadata.location) {
      const location = supportsColor
        ? chalk.dim.gray(`  Location: ${segment.metadata.location}`)
        : `  Location: ${segment.metadata.location}`;
      console.log(location);
    }
  }

  console.log('\n');
}

/**
 * Display closing message
 * @param {string} mode - Session mode ('quick-tour' or 'full-experience')
 * @param {Object} stats - Session statistics
 * @param {Object} capabilities - Terminal capabilities
 */
export function displayClosingMessage(mode, stats = {}, capabilities = null) {
  capabilities = capabilities || getTerminalCapabilities();

  const supportsColor = capabilities.supportsColor;

  console.log('\n');

  let message = 'Thank you for exploring Chan Meng\'s journey.\n\n';

  if (mode === 'quick-tour') {
    message += 'This was the Quick Tour. Run again to explore the full experience.';
  } else {
    message += 'Feel free to return anytime to explore more.';
  }

  if (stats.duration) {
    const minutes = Math.floor(stats.duration / 60);
    const seconds = stats.duration % 60;
    const timeStr = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
    message += `\n\nTime spent: ${timeStr}`;
  }

  if (supportsColor && capabilities.width >= 80) {
    console.log(boxen(message, {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'green',
      textAlignment: 'center'
    }));
  } else {
    console.log(message);
  }

  console.log('\n');
}

/**
 * Display error message
 * @param {string} message - Error message
 * @param {Object} capabilities - Terminal capabilities
 */
export function displayError(message, capabilities = null) {
  capabilities = capabilities || getTerminalCapabilities();

  const supportsColor = capabilities.supportsColor;

  console.log('\n');

  if (supportsColor) {
    console.error(chalk.red.bold('Error: ') + chalk.red(message));
  } else {
    console.error(`Error: ${message}`);
  }

  console.log('\n');
}

/**
 * Display info message
 * @param {string} message - Info message
 * @param {Object} capabilities - Terminal capabilities
 */
export function displayInfo(message, capabilities = null) {
  capabilities = capabilities || getTerminalCapabilities();

  const supportsColor = capabilities.supportsColor;

  if (supportsColor) {
    console.log(chalk.cyan('ℹ ') + message);
  } else {
    console.log(`[i] ${message}`);
  }
}

/**
 * Display progress indicator
 * @param {number} current - Current position
 * @param {number} total - Total items
 * @param {Object} capabilities - Terminal capabilities
 */
export function displayProgress(current, total, capabilities = null) {
  capabilities = capabilities || getTerminalCapabilities();

  const supportsColor = capabilities.supportsColor;
  const percentage = Math.round((current / total) * 100);

  const progressText = `Progress: ${current}/${total} (${percentage}%)`;

  if (supportsColor) {
    console.log(chalk.dim.gray(progressText));
  } else {
    console.log(progressText);
  }
}

/**
 * Clear screen (if supported)
 * @param {Object} capabilities - Terminal capabilities
 */
export function clearScreen(capabilities = null) {
  capabilities = capabilities || getTerminalCapabilities();

  if (capabilities.isTTY) {
    console.clear();
  } else {
    // Fallback: print newlines
    console.log('\n'.repeat(3));
  }
}

/**
 * Display section divider
 * @param {Object} capabilities - Terminal capabilities
 */
export function displayDivider(capabilities = null) {
  capabilities = capabilities || getTerminalCapabilities();

  const supportsColor = capabilities.supportsColor;
  const width = Math.min(capabilities.width - 4, 80);

  const divider = '─'.repeat(width);

  if (supportsColor) {
    console.log(chalk.dim.gray(divider));
  } else {
    console.log(divider);
  }
}
