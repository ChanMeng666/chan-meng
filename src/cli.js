/**
 * Main CLI Logic
 *
 * Orchestrates the entire CLI experience, handling navigation,
 * module routing, and session management.
 */

import inquirer from 'inquirer';
import chalk from 'chalk';
import { showWelcome, displayFirstTimeTips } from './modules/welcome.js';
import { showQuickTour } from './modules/quickTour.js';
import { showJourney } from './modules/journey.js';
import { showPhilosophy } from './modules/philosophy.js';
import { showPractical } from './modules/practical.js';
import { showConnect } from './modules/connect.js';
import { displayMenu, displayClosingMessage, displayError } from './services/display.js';
import { getTerminalCapabilities, checkMinimumRequirements } from './utils/terminal.js';
import NavigationState from './services/navigation.js';
import progressService from './services/progress.js';
import { allModules } from './content/stories.js';

/**
 * Show main menu and handle module selection
 * @param {NavigationState} navigationState - Current navigation state
 * @returns {Promise<string>} Action: 'continue', 'quit'
 */
async function showMainMenu(navigationState) {
  const capabilities = getTerminalCapabilities();

  // Get visited modules
  const visitedModules = progressService.getVisitedModules();

  // Display menu
  displayMenu(allModules, visitedModules, capabilities);

  // Build choices
  const choices = allModules.map((module, index) => {
    const visited = visitedModules.includes(module.id) ? '✓ ' : '';
    const icon = module.icon || '▸';

    return {
      name: capabilities.supportsColor
        ? `${chalk.cyan(icon)} ${visited}${module.title}${chalk.dim.gray(` (~${Math.ceil(module.estimatedTime / 60)}min)`)}`
        : `${icon} ${visited}${module.title} (~${Math.ceil(module.estimatedTime / 60)}min)`,
      value: module.id,
      short: module.title
    };
  });

  // Add menu options
  choices.push(new inquirer.Separator());
  choices.push({
    name: capabilities.supportsColor ? chalk.dim('Exit') : 'Exit',
    value: 'exit'
  });

  // Prompt for selection
  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'selection',
      message: 'Select a module to explore:',
      choices,
      pageSize: 15
    }
  ]);

  if (answer.selection === 'exit') {
    return 'quit';
  }

  // Route to selected module
  navigationState.goToModule(answer.selection);

  return 'continue';
}

/**
 * Route to appropriate module handler
 * @param {string} moduleId - Module ID
 * @param {NavigationState} navigationState - Navigation state
 * @returns {Promise<string>} Action result
 */
async function routeToModule(moduleId, navigationState) {
  switch (moduleId) {
    case 'journey':
      return await showJourney(navigationState);
    case 'philosophy':
      return await showPhilosophy(navigationState);
    case 'practical':
      return await showPractical(navigationState);
    case 'connect':
      return await showConnect(navigationState);
    default:
      displayError(`Unknown module: ${moduleId}`);
      return 'menu';
  }
}

/**
 * Main CLI entry point
 */
export async function startCLI() {
  const capabilities = getTerminalCapabilities();

  // Check terminal requirements
  const requirements = checkMinimumRequirements(capabilities);

  // Only prompt if there are actual blocking issues (not just warnings)
  if (!requirements.meets && requirements.issues.length > 0) {
    console.log(chalk.yellow.bold('\nWarning: Terminal requirements not met\n'));
    requirements.issues.forEach(issue => {
      console.log(chalk.yellow(`  • ${issue}`));
    });
    console.log('\nThe CLI may not display correctly. Continue anyway?\n');

    const answer = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'continue',
        message: 'Continue?',
        default: true
      }
    ]);

    if (!answer.continue) {
      console.log('\nGoodbye!\n');
      return;
    }
  }
  // Show warnings silently (don't block execution)
  else if (requirements.warnings && requirements.warnings.length > 0) {
    // Silently continue - warnings are informational only
    // This allows npx and other non-TTY contexts to work seamlessly
  }

  // Initialize navigation state
  const navigationState = new NavigationState();

  // Check if first run
  const isFirstRun = progressService.isFirstRun();
  const hasCompletedQuickTour = progressService.hasCompletedQuickTour();
  const lastSession = progressService.getLastSession();

  try {
    // Show welcome screen
    const mode = await showWelcome(isFirstRun, hasCompletedQuickTour, lastSession);

    // Mark first run as completed
    if (isFirstRun) {
      progressService.completeFirstRun();
    }

    // Handle exit
    if (mode === 'exit') {
      console.log('\nGoodbye!\n');
      return;
    }

    // Start session
    progressService.startSession(mode);

    // Show first-time tips
    if (isFirstRun) {
      displayFirstTimeTips(capabilities);
    }

    // Handle resume mode
    if (mode === 'resume' && lastSession && lastSession.moduleId) {
      navigationState.goToModule(lastSession.moduleId);
      const result = await routeToModule(lastSession.moduleId, navigationState);

      if (result === 'quit') {
        navigationState.quit();
      } else if (result === 'menu') {
        // Continue to main menu loop
      }
    }
    // Handle Quick Tour mode
    else if (mode === 'quick-tour') {
      const result = await showQuickTour(navigationState);

      if (result === 'quit') {
        navigationState.quit();
      } else if (result === 'full-experience') {
        // Continue to main menu loop
        navigationState.mode = 'full-experience';
      }
    }
    // Handle Full Experience mode
    else if (mode === 'full-experience') {
      navigationState.mode = 'full-experience';
    }

    // Main menu loop (for Full Experience)
    while (!navigationState.shouldQuit() && navigationState.mode !== 'quit') {
      const action = await showMainMenu(navigationState);

      if (action === 'quit') {
        navigationState.quit();
        break;
      }

      // Route to selected module
      const moduleId = navigationState.currentModuleId;
      const result = await routeToModule(moduleId, navigationState);

      if (result === 'quit') {
        navigationState.quit();
        break;
      } else if (result === 'menu') {
        navigationState.exitToMenu();
      }
    }

    // End session
    progressService.endSession();

    // Display closing message
    const stats = {
      duration: navigationState.getSessionDuration()
    };
    displayClosingMessage(navigationState.mode, stats, capabilities);

  } catch (error) {
    // Handle user interrupt (Ctrl+C)
    if (error.isTtyError || error.name === 'ExitPromptError') {
      console.log('\n\nSession interrupted. Your progress has been saved.\n');
    } else {
      console.error('\nAn error occurred:', error.message);
      console.error('Please report this issue if it persists.\n');
    }

    // Ensure session is ended
    progressService.endSession();
  }
}

export default startCLI;
