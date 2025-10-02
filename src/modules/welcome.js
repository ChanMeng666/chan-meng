/**
 * Welcome Module
 *
 * Handles the welcome screen and initial mode selection.
 * Adapts based on whether user is a first-time or returning visitor.
 */

import inquirer from 'inquirer';
import { displayWelcome, displayInfo } from '../services/display.js';
import { getTerminalCapabilities } from '../utils/terminal.js';
import chalk from 'chalk';

/**
 * Show welcome screen and get user's choice
 * @param {boolean} isFirstRun - Whether this is user's first run
 * @param {boolean} hasCompletedQuickTour - Whether user completed Quick Tour
 * @param {Object} lastSession - Last session data
 * @returns {Promise<string>} Selected mode: 'quick-tour', 'full-experience', or 'exit'
 */
export async function showWelcome(isFirstRun = true, hasCompletedQuickTour = false, lastSession = null) {
  const capabilities = getTerminalCapabilities();

  // Display welcome screen
  await displayWelcome(capabilities);

  // Welcome message
  if (isFirstRun) {
    console.log(capabilities.supportsColor
      ? chalk.white('Welcome! This interactive experience introduces Chan Meng—')
      : 'Welcome! This interactive experience introduces Chan Meng—'
    );
    console.log(capabilities.supportsColor
      ? chalk.white('a minimalist who lives with only what fits in one backpack.')
      : 'a minimalist who lives with only what fits in one backpack.'
    );
    console.log('');
  } else {
    console.log(capabilities.supportsColor
      ? chalk.cyan('Welcome back!')
      : 'Welcome back!'
    );

    if (lastSession && lastSession.moduleId) {
      const timestamp = new Date(lastSession.timestamp);
      const timeAgo = getTimeAgo(timestamp);

      displayInfo(
        `Last visit: ${timeAgo} (viewing: ${lastSession.moduleId})`,
        capabilities
      );
    }

    console.log('');
  }

  // Build choices based on user history
  const choices = [];

  if (isFirstRun || !hasCompletedQuickTour) {
    choices.push({
      name: capabilities.supportsColor
        ? chalk.cyan('⚡ Quick Tour') + chalk.dim(' (3 minutes - recommended for first-timers)')
        : 'Quick Tour (3 minutes - recommended for first-timers)',
      value: 'quick-tour',
      short: 'Quick Tour'
    });
  }

  choices.push({
    name: capabilities.supportsColor
      ? chalk.cyan('📚 Full Experience') + chalk.dim(' (explore at your own pace)')
      : 'Full Experience (explore at your own pace)',
    value: 'full-experience',
    short: 'Full Experience'
  });

  if (lastSession && lastSession.moduleId && !isFirstRun) {
    choices.push({
      name: capabilities.supportsColor
        ? chalk.yellow('↩  Resume') + chalk.dim(` (continue from ${lastSession.moduleId})`)
        : `Resume (continue from ${lastSession.moduleId})`,
      value: 'resume',
      short: 'Resume'
    });
  }

  choices.push({
    name: capabilities.supportsColor
      ? chalk.dim('Exit')
      : 'Exit',
    value: 'exit',
    short: 'Exit'
  });

  // Prompt for choice
  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'mode',
      message: 'How would you like to proceed?',
      choices,
      pageSize: 10
    }
  ]);

  return answer.mode;
}

/**
 * Get time ago string
 * @param {Date} date - Date to compare
 * @returns {string} Human-readable time ago
 */
function getTimeAgo(date) {
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) {
    return 'just now';
  } else if (diffMins < 60) {
    return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleDateString();
  }
}

/**
 * Display first-time tips
 * @param {Object} capabilities - Terminal capabilities
 */
export function displayFirstTimeTips(capabilities = null) {
  capabilities = capabilities || getTerminalCapabilities();

  console.log('');

  const tips = [
    '💡 You can exit at any time (your progress will be saved)',
    '⏱️  Time estimates are approximate',
    '↩️  You can always return to explore more'
  ];

  tips.forEach(tip => {
    if (capabilities.supportsColor) {
      console.log(chalk.dim.gray(`  ${tip}`));
    } else {
      console.log(`  ${tip.replace(/[💡⏱️↩️]/g, '-')}`);
    }
  });

  console.log('');
}

export default showWelcome;
