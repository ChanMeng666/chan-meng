/**
 * Quick Tour Module
 *
 * Provides a curated 3-minute tour through Chan's story.
 * Automatically progresses through selected segments from all modules.
 */

import inquirer from 'inquirer';
import { displaySegment, displayDivider, displayInfo } from '../services/display.js';
import { quickTourFlow } from '../content/quick-tour.js';
import { allModules } from '../content/stories.js';
import { getTerminalCapabilities } from '../utils/terminal.js';
import progressService from '../services/progress.js';
import chalk from 'chalk';

/**
 * Show Quick Tour
 * @param {NavigationState} navigationState - Current navigation state
 * @returns {Promise<string>} Action: 'full-experience', 'quit'
 */
export async function showQuickTour(navigationState) {
  const capabilities = getTerminalCapabilities();

  console.log('\n');
  displayDivider(capabilities);

  if (capabilities.supportsColor) {
    console.log(chalk.bold.cyan('\n⚡ Quick Tour\n'));
    console.log(chalk.dim('A curated 3-minute journey through Chan Meng\'s story.\n'));
  } else {
    console.log('\nQuick Tour\n');
    console.log('A curated 3-minute journey through Chan Meng\'s story.\n');
  }

  displayDivider(capabilities);

  // Set navigation mode
  navigationState.startQuickTour(0);

  // Iterate through quick tour segments
  for (let i = 0; i < quickTourFlow.length; i++) {
    const item = quickTourFlow[i];

    // Find the module and segment
    const module = allModules.find(m => m.id === item.moduleId);
    if (!module) continue;

    const segment = module.segments.find(s => s.id === item.segmentId);
    if (!segment) continue;

    // Update position
    progressService.updatePosition(module.id, segment.id);

    // Display transition text if present
    if (item.transition) {
      console.log('\n');
      if (capabilities.supportsColor) {
        console.log(chalk.dim.italic(item.transition));
      } else {
        console.log(item.transition);
      }
      console.log('');
    }

    // Display segment
    displaySegment(segment, module, capabilities);

    // Show progress
    const progress = `[${i + 1}/${quickTourFlow.length}]`;
    if (capabilities.supportsColor) {
      console.log(chalk.dim.gray(progress));
    } else {
      console.log(progress);
    }

    // Check if last segment
    if (i === quickTourFlow.length - 1) {
      // Last segment - mark quick tour as completed
      progressService.completeQuickTour();

      console.log('\n');
      displayDivider(capabilities);

      if (capabilities.supportsColor) {
        console.log(chalk.green.bold('\n✓ Quick Tour Complete!\n'));
        console.log(chalk.white('You\'ve experienced a glimpse of Chan Meng\'s minimalist journey.'));
        console.log(chalk.dim('There\'s much more to explore in the full experience.\n'));
      } else {
        console.log('\nQuick Tour Complete!\n');
        console.log('You\'ve experienced a glimpse of Chan Meng\'s minimalist journey.');
        console.log('There\'s much more to explore in the full experience.\n');
      }

      displayDivider(capabilities);

      const answer = await inquirer.prompt([
        {
          type: 'list',
          name: 'action',
          message: 'What would you like to do next?',
          choices: [
            { name: 'Explore Full Experience', value: 'full-experience' },
            { name: 'Exit (you can return anytime)', value: 'quit' }
          ]
        }
      ]);

      return answer.action;
    }

    // Prompt to continue
    const answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'Continue?',
        choices: [
          { name: 'Continue', value: 'continue' },
          { name: 'Skip to Full Experience', value: 'full-experience' },
          { name: 'Exit', value: 'quit' }
        ]
      }
    ]);

    if (answer.action === 'full-experience') {
      progressService.completeQuickTour();
      return 'full-experience';
    } else if (answer.action === 'quit') {
      return 'quit';
    }
    // else continue to next segment
  }

  return 'full-experience';
}

export default showQuickTour;
