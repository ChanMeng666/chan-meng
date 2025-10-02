/**
 * Connect Module
 *
 * Displays Chan's contact information and professional links.
 */

import inquirer from 'inquirer';
import { displaySegment, displayDivider } from '../services/display.js';
import { connectModule } from '../content/connect.js';
import { getTerminalCapabilities } from '../utils/terminal.js';
import progressService from '../services/progress.js';
import chalk from 'chalk';
import boxen from 'boxen';

/**
 * Show Connect module
 * @param {NavigationState} navigationState - Current navigation state
 * @returns {Promise<string>} Action: 'menu', 'quit'
 */
export async function showConnect(navigationState) {
  const capabilities = getTerminalCapabilities();
  const module = connectModule;

  // Mark module as visited
  progressService.updatePosition(module.id, null);

  console.log('\n');
  displayDivider(capabilities);

  // Display contact info in a nice box
  const segment = module.segments[0];

  let contactText = `${module.title}\n\n${segment.content}`;

  if (capabilities.supportsColor && capabilities.width >= 80) {
    console.log(boxen(contactText, {
      padding: 1,
      margin: { top: 1, bottom: 1 },
      borderStyle: 'round',
      borderColor: 'cyan',
      textAlignment: 'left'
    }));
  } else {
    console.log(`\n${module.title}\n`);
    console.log(segment.content);
    console.log('');
  }

  displayDivider(capabilities);

  // Mark as completed
  progressService.completeModule(module.id);

  // Prompt for next action
  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        { name: 'Back to Menu', value: 'menu' },
        { name: 'Exit', value: 'quit' }
      ]
    }
  ]);

  return answer.action;
}

export default showConnect;
