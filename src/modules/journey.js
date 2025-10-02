/**
 * Journey Module
 *
 * Displays Chan's life journey through interactive segments.
 */

import inquirer from 'inquirer';
import { displaySegment, displayDivider } from '../services/display.js';
import { journeyModule } from '../content/journey.js';
import { getTerminalCapabilities } from '../utils/terminal.js';
import progressService from '../services/progress.js';

/**
 * Show Journey module
 * @param {NavigationState} navigationState - Current navigation state
 * @returns {Promise<string>} Action: 'continue', 'menu', 'quit'
 */
export async function showJourney(navigationState) {
  const capabilities = getTerminalCapabilities();
  const module = journeyModule;

  // Mark module as visited
  progressService.updatePosition(module.id, null);

  // Display module intro
  console.log('\n');
  displayDivider(capabilities);
  console.log(`\n${module.title}\n`);
  console.log(module.description);
  displayDivider(capabilities);

  // Iterate through segments
  for (let i = 0; i < module.segments.length; i++) {
    const segment = module.segments[i];

    // Update position
    progressService.updatePosition(module.id, segment.id);

    // Display segment
    displaySegment(segment, module, capabilities);

    // Check if last segment
    if (i === module.segments.length - 1) {
      // Last segment - mark as completed
      progressService.completeModule(module.id);

      const answer = await inquirer.prompt([
        {
          type: 'list',
          name: 'action',
          message: 'Journey complete. What would you like to do?',
          choices: [
            { name: 'Back to Menu', value: 'menu' },
            { name: 'Exit', value: 'quit' }
          ]
        }
      ]);

      return answer.action;
    }

    // Prompt for next action
    const answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          { name: 'Continue', value: 'continue' },
          { name: 'Back to Menu', value: 'menu' },
          { name: 'Exit', value: 'quit' }
        ]
      }
    ]);

    if (answer.action === 'menu') {
      return 'menu';
    } else if (answer.action === 'quit') {
      return 'quit';
    }
    // else continue to next segment
  }

  return 'menu';
}

export default showJourney;
