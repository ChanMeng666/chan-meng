# Implementation Guide - Remaining Tasks

**Project**: chan-meng CLI
**Current Status**: 14/29 tasks completed
**Remaining**: 15 tasks (T015-T029)

---

## ✅ Completed Tasks (T001-T014)

- [x] T001-T004: Setup & Foundation
- [x] T005-T011: Content Data Files
- [x] T012-T013: Utilities Layer
- [x] T014: Progress Service

---

## 📋 Remaining Tasks Overview

### Phase 3.4: Services Layer (2 tasks)
- [ ] T015: Navigation state manager (`src/services/navigation.js`)
- [ ] T016: Display utilities (`src/services/display.js`)

### Phase 3.5: Content Modules (6 tasks - 5 parallel)
- [ ] T017: Welcome module (`src/modules/welcome.js`)
- [ ] T018: Journey module (`src/modules/journey.js`)
- [ ] T019: Philosophy module (`src/modules/philosophy.js`)
- [ ] T020: Practical module (`src/modules/practical.js`)
- [ ] T021: Connect module (`src/modules/connect.js`)
- [ ] T022: Quick Tour module (`src/modules/quickTour.js`)

### Phase 3.6: CLI Orchestration (2 tasks)
- [ ] T023: Main menu logic (`src/cli.js`)
- [ ] T024: CLI startup flow (`src/cli.js` - extend)

### Phase 3.7: Testing (4 tasks - parallel)
- [ ] T025: Content validation tests
- [ ] T026: Service unit tests
- [ ] T027: Quick Tour integration test
- [ ] T028: Full Experience integration test

### Phase 3.8: Polish (1 task)
- [ ] T029: Manual validation

---

## 🔧 Task Implementation

### T015: Navigation State Manager

**File**: `src/services/navigation.js`

```javascript
/**
 * Navigation State Manager
 *
 * Tracks user's current position and navigation history
 * throughout the CLI experience.
 */

class NavigationState {
  constructor() {
    this.mode = 'welcome'; // 'welcome' | 'quick-tour' | 'full-experience' | 'exiting'
    this.currentModuleId = null;
    this.currentSegmentId = null;
    this.history = []; // Array of { moduleId, segmentId, timestamp }
    this.sessionStart = new Date();
    this.quickTourIndex = null; // For quick tour progression
  }

  /**
   * Navigate to a specific module
   * @param {string} moduleId - Module ID to navigate to
   */
  goToModule(moduleId) {
    this.addToHistory(this.currentModuleId, this.currentSegmentId);
    this.currentModuleId = moduleId;
    this.currentSegmentId = null; // Reset segment when entering new module
  }

  /**
   * Navigate to a specific segment
   * @param {string} moduleId - Module ID
   * @param {number} segmentId - Segment ID
   */
  goToSegment(moduleId, segmentId) {
    this.addToHistory(this.currentModuleId, this.currentSegmentId);
    this.currentModuleId = moduleId;
    this.currentSegmentId = segmentId;
  }

  /**
   * Go back to previous location
   * @returns {Object|null} Previous location { moduleId, segmentId } or null
   */
  goBack() {
    if (this.history.length === 0) {
      return null;
    }

    const previous = this.history.pop();
    this.currentModuleId = previous.moduleId;
    this.currentSegmentId = previous.segmentId;

    return previous;
  }

  /**
   * Return to main menu
   */
  exitToMenu() {
    this.currentModuleId = null;
    this.currentSegmentId = null;
    this.mode = 'full-experience';
    // Clear history when returning to menu
    this.history = [];
  }

  /**
   * Set mode to exiting
   */
  quit() {
    this.mode = 'exiting';
  }

  /**
   * Set the current mode
   * @param {string} mode - Mode to set
   */
  setMode(mode) {
    this.mode = mode;
  }

  /**
   * Add current position to history
   * @param {string} moduleId - Module ID
   * @param {number} segmentId - Segment ID
   */
  addToHistory(moduleId, segmentId) {
    if (moduleId) {
      this.history.push({
        moduleId,
        segmentId,
        timestamp: new Date()
      });

      // Limit history size to prevent memory leaks
      if (this.history.length > 100) {
        this.history.shift();
      }
    }
  }

  /**
   * Advance quick tour index
   */
  advanceQuickTour() {
    if (this.quickTourIndex === null) {
      this.quickTourIndex = 0;
    } else {
      this.quickTourIndex++;
    }
  }

  /**
   * Check if quick tour is complete
   * @param {number} totalSteps - Total steps in quick tour
   * @returns {boolean} True if complete
   */
  isQuickTourComplete(totalSteps) {
    return this.quickTourIndex !== null && this.quickTourIndex >= totalSteps;
  }

  /**
   * Get current position
   * @returns {Object} { moduleId, segmentId }
   */
  getCurrentPosition() {
    return {
      moduleId: this.currentModuleId,
      segmentId: this.currentSegmentId
    };
  }

  /**
   * Get session duration in seconds
   * @returns {number} Duration in seconds
   */
  getSessionDuration() {
    return Math.floor((Date.now() - this.sessionStart.getTime()) / 1000);
  }
}

// Export singleton instance
const navigationState = new NavigationState();
export default navigationState;

// Also export class for testing
export { NavigationState };
```

---

### T016: Display Utilities

**File**: `src/services/display.js`

```javascript
/**
 * Display Utilities
 *
 * Handles all terminal output, formatting, and visual presentation.
 */

import chalk from 'chalk';
import boxen from 'boxen';
import { getTerminalCapabilities, formatText } from '../utils/terminal.js';
import { QUOTES, DECORATIONS, getModuleIcon } from '../content/ascii-art.js';

/**
 * Display welcome screen with ASCII art
 * @param {boolean} isReturningUser - Whether user has been here before
 * @param {Object} capabilities - Terminal capabilities
 */
export async function displayWelcome(isReturningUser = false, capabilities = null) {
  capabilities = capabilities || getTerminalCapabilities();

  // Lazy load figlet for performance
  const figlet = (await import('figlet')).default;

  console.clear();

  // Generate ASCII title
  const title = figlet.textSync('Chan Meng', {
    font: 'Standard',
    horizontalLayout: 'default'
  });

  if (capabilities.supportsColor) {
    // Use gradient if supported
    try {
      const gradient = (await import('gradient-string')).default;
      console.log(gradient.pastel.multiline(title));
    } catch {
      // Fallback to plain cyan
      console.log(chalk.cyan(title));
    }
  } else {
    console.log(title);
  }

  console.log();

  // Welcome message
  const greeting = isReturningUser ? 'Welcome back! 👋' : 'Welcome';
  const message = isReturningUser
    ? 'Ready to continue exploring?'
    : 'An interactive journey into minimalist living';

  console.log(boxen(
    chalk.bold(greeting) + '\n\n' + message,
    {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'cyan'
    }
  ));

  console.log();
}

/**
 * Display main menu with modules
 * @param {Array} modules - Array of module objects
 * @param {Array} visitedModules - Array of visited module IDs
 * @param {Object} capabilities - Terminal capabilities
 */
export function displayMenu(modules, visitedModules = [], capabilities = null) {
  capabilities = capabilities || getTerminalCapabilities();

  console.log(chalk.bold.cyan('\n═'.repeat(50)));
  console.log(chalk.bold.cyan('  EXPLORE CHAN\'S WORLD'));
  console.log(chalk.bold.cyan('═'.repeat(50)) + '\n');

  modules.forEach((module, index) => {
    const icon = getModuleIcon(module.id, capabilities.supportsEmoji);
    const visited = visitedModules.includes(module.id) ? chalk.green(' ✓') : '';
    const timeEstimate = capabilities.supportsColor
      ? chalk.dim(` (~${Math.ceil(module.estimatedTime / 60)} min)`)
      : ` (~${Math.ceil(module.estimatedTime / 60)} min)`;

    console.log(
      `  ${icon} ${chalk.bold(module.title)}${visited}${timeEstimate}`
    );
    console.log(
      chalk.dim(`     ${module.description}`)
    );
    console.log();
  });

  console.log(chalk.dim('  ❌ Exit\n'));
  console.log(chalk.dim('  Use ↑↓ to navigate, Enter to select\n'));
}

/**
 * Display a segment
 * @param {Object} segment - Segment object
 * @param {number} currentIndex - Current segment index (1-based)
 * @param {number} totalSegments - Total segments in module
 * @param {Object} capabilities - Terminal capabilities
 */
export function displaySegment(segment, currentIndex, totalSegments, capabilities = null) {
  capabilities = capabilities || getTerminalCapabilities();

  console.clear();

  // Segment header
  const progress = `[${currentIndex}/${totalSegments}]`;
  console.log(chalk.bold.cyan('\n' + segment.title + ' ' + chalk.dim(progress)));
  console.log(chalk.cyan('─'.repeat(60)) + '\n');

  // Content
  console.log(segment.content + '\n');

  // Quote if present
  if (segment.metadata && segment.metadata.quote) {
    console.log(boxen(
      chalk.italic(segment.metadata.quote),
      {
        padding: { top: 0, bottom: 0, left: 2, right: 2 },
        margin: { top: 1, bottom: 1, left: 4, right: 4 },
        borderStyle: 'single',
        borderColor: 'yellow'
      }
    ));
  }

  // ASCII art if present
  if (segment.metadata && segment.metadata.asciiArt) {
    console.log(chalk.dim(segment.metadata.asciiArt));
  }

  // Navigation hints
  console.log(chalk.dim('\n  ↵ Continue  |  m Menu  |  q Quit\n'));
}

/**
 * Display closing message
 * @param {string} mode - Mode that was completed ('quick-tour' or 'full-experience')
 * @param {Object} stats - User statistics
 * @param {Object} capabilities - Terminal capabilities
 */
export function displayClosingMessage(mode, stats, capabilities = null) {
  capabilities = capabilities || getTerminalCapabilities();

  console.clear();

  const quotes = mode === 'quick-tour' ? QUOTES.quickTourEnd : QUOTES.fullExperienceEnd;

  const message = [
    '',
    'Thank you for exploring Chan\'s journey.',
    '',
    ...quotes,
    '',
    `Sessions: ${stats.totalSessions}`,
    `Time spent: ${Math.floor(stats.totalTimeSpent / 60)} minutes`,
    '',
    'May you find your own path to intentional living.',
    ''
  ].join('\n');

  console.log(boxen(
    message,
    {
      padding: 1,
      margin: 1,
      borderStyle: 'double',
      borderColor: 'magenta'
    }
  ));

  console.log();
}

/**
 * Display error message
 * @param {string} message - Error message
 */
export function displayError(message) {
  console.error(boxen(
    chalk.red.bold('Error\n\n') + message,
    {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'red'
    }
  ));
}

/**
 * Display loading spinner
 * @param {string} text - Loading text
 * @returns {Object} Ora spinner instance
 */
export async function displayLoading(text = 'Loading...') {
  const ora = (await import('ora')).default;
  return ora(text).start();
}

/**
 * Display transition message between sections
 * @param {string} message - Transition message
 */
export function displayTransition(message) {
  console.log('\n' + chalk.dim(message) + '\n');
  // Pause briefly for effect
  return new Promise(resolve => setTimeout(resolve, 1000));
}

/**
 * Format time estimate
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time (e.g., "~5 min")
 */
export function formatTimeEstimate(seconds) {
  const minutes = Math.ceil(seconds / 60);
  return `~${minutes} min`;
}
```

---

### T017: Welcome Module

**File**: `src/modules/welcome.js`

```javascript
/**
 * Welcome Module
 *
 * Handles welcome screen and mode selection.
 */

import inquirer from 'inquirer';
import { displayWelcome } from '../services/display.js';
import { getTerminalCapabilities } from '../utils/terminal.js';
import progressService from '../services/progress.js';

/**
 * Show welcome screen and get user choice
 * @returns {Promise<string>} Selected mode: 'quick-tour', 'full-experience', or 'exit'
 */
export async function showWelcome() {
  const capabilities = getTerminalCapabilities();
  const isReturningUser = !progressService.isFirstRun();
  const lastSession = progressService.getLastSession();

  await displayWelcome(isReturningUser, capabilities);

  // Build choices based on user history
  const choices = [];

  if (isReturningUser && lastSession.moduleId) {
    // Returning user with progress
    const stats = progressService.getStats();
    const lastVisitInfo = lastSession.timestamp
      ? `Last visit: ${new Date(lastSession.timestamp).toLocaleDateString()}`
      : '';

    console.log(`\n  ${lastVisitInfo}`);
    console.log(`  Explored: ${progressService.getVisitedModules().length} areas\n`);

    choices.push(
      { name: '▶️  Continue exploring (Full Experience)', value: 'full-experience' },
      { name: '⚡ Quick Tour (~3 min)', value: 'quick-tour' },
      { name: '🔄 Start fresh', value: 'start-fresh' },
      { name: '👋 Exit', value: 'exit' }
    );
  } else {
    // First-time user
    choices.push(
      { name: '⚡ Quick Tour (~3 min) - Recommended for first visit', value: 'quick-tour' },
      { name: '🗺️  Full Experience - Explore at your own pace', value: 'full-experience' },
      { name: '👋 Exit', value: 'exit' }
    );
  }

  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'mode',
      message: 'How would you like to explore?',
      choices
    }
  ]);

  // Handle special cases
  if (answer.mode === 'start-fresh') {
    // Mark as not first run, but user chose fresh start
    progressService.completeFirstRun();
    return 'full-experience';
  }

  if (answer.mode !== 'exit') {
    progressService.completeFirstRun();
  }

  return answer.mode;
}
```

---

### T018-T021: Module Implementations

**Files**: `src/modules/journey.js`, `philosophy.js`, `practical.js`, `connect.js`

All four modules follow the same pattern. Here's the template:

```javascript
/**
 * [Module Name] Module
 *
 * Displays the [module description] module content.
 */

import inquirer from 'inquirer';
import { displaySegment, displayTransition } from '../services/display.js';
import { [moduleName]Module } from '../content/[moduleName].js';
import progressService from '../services/progress.js';
import navigationState from '../services/navigation.js';

/**
 * Show [Module Name] module
 * @returns {Promise<string>} Action: 'menu', 'quit', or 'continue'
 */
export async function show[ModuleName]() {
  const module = [moduleName]Module;
  const segments = module.segments;

  // Update navigation
  navigationState.goToModule(module.id);
  progressService.updatePosition(module.id, null);

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];

    // Display segment
    displaySegment(segment, i + 1, segments.length);

    // Update progress
    progressService.updatePosition(module.id, segment.id);

    // If last segment, mark module as completed
    if (i === segments.length - 1) {
      progressService.completeModule(module.id);
    }

    // Get user action (except on last segment)
    if (i < segments.length - 1) {
      const action = await promptForAction();

      if (action === 'menu') {
        navigationState.exitToMenu();
        return 'menu';
      } else if (action === 'quit') {
        navigationState.quit();
        return 'quit';
      }
      // Otherwise continue to next segment
    }
  }

  // Module complete - return to menu
  await displayTransition('Module complete. Returning to menu...');
  navigationState.exitToMenu();
  return 'menu';
}

/**
 * Prompt user for next action
 * @returns {Promise<string>} Action: 'continue', 'menu', or 'quit'
 */
async function promptForAction() {
  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What next?',
      choices: [
        { name: '↵ Continue', value: 'continue' },
        { name: 'm Back to Menu', value: 'menu' },
        { name: 'q Quit', value: 'quit' }
      ]
    }
  ]);

  return answer.action;
}
```

**Create these 4 files with appropriate names**:
- `src/modules/journey.js` - Use `journeyModule` from `../content/journey.js`
- `src/modules/philosophy.js` - Use `philosophyModule`
- `src/modules/practical.js` - Use `practicalModule`
- `src/modules/connect.js` - Use `connectModule` (simpler, usually just one segment)

---

### T022: Quick Tour Module

**File**: `src/modules/quickTour.js`

```javascript
/**
 * Quick Tour Module
 *
 * Guides user through a curated 3-minute tour of Chan's story.
 */

import inquirer from 'inquirer';
import { displaySegment, displayTransition } from '../services/display.js';
import { quickTourFlow } from '../content/quick-tour.js';
import { getSegment } from '../content/stories.js';
import progressService from '../services/progress.js';
import navigationState from '../services/navigation.js';

/**
 * Show Quick Tour
 * @returns {Promise<string>} Action: 'full-experience', 'exit'
 */
export async function showQuickTour() {
  navigationState.setMode('quick-tour');
  progressService.startSession('quick-tour');

  for (const step of quickTourFlow) {
    // Show transition if present
    if (step.transition) {
      await displayTransition(step.transition);
    }

    // Display each segment in this step
    for (const segmentId of step.segmentIds) {
      const segment = getSegment(step.moduleId, segmentId);

      if (!segment) {
        console.error(`Segment not found: ${step.moduleId}/${segmentId}`);
        continue;
      }

      // Display segment
      displaySegment(
        segment,
        quickTourFlow.indexOf(step) + 1,
        quickTourFlow.length
      );

      // Update progress
      progressService.updatePosition(step.moduleId, segmentId);
      navigationState.advanceQuickTour();

      // Pause between segments
      await new Promise(resolve => setTimeout(resolve, 500));

      // Check for user interrupt (basic - just continue for now)
      // In full implementation, listen for keypress to skip
    }
  }

  // Quick Tour complete!
  progressService.completeQuickTour();

  // Ask what to do next
  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'next',
      message: '\n✨ Quick Tour complete! What would you like to do?',
      choices: [
        { name: '🗺️  Explore Full Experience', value: 'full-experience' },
        { name: '👋 Exit', value: 'exit' }
      ]
    }
  ]);

  return answer.next;
}
```

---

### T023-T024: CLI Orchestration

**File**: `src/cli.js`

```javascript
/**
 * CLI Orchestration
 *
 * Main CLI logic, menu system, and application flow.
 */

import inquirer from 'inquirer';
import { displayMenu, displayClosingMessage, displayError } from './services/display.js';
import {
  getTerminalCapabilities,
  checkMinimumRequirements
} from './utils/terminal.js';
import progressService from './services/progress.js';
import navigationState from './services/navigation.js';
import { allModules } from './content/stories.js';

// Import modules
import { showWelcome } from './modules/welcome.js';
import { showJourney } from './modules/journey.js';
import { showPhilosophy } from './modules/philosophy.js';
import { showPractical } from './modules/practical.js';
import { showConnect } from './modules/connect.js';
import { showQuickTour } from './modules/quickTour.js';

/**
 * Main CLI entry point
 */
export async function startCLI() {
  try {
    // Check terminal capabilities
    const capabilities = getTerminalCapabilities();
    const requirements = checkMinimumRequirements(capabilities);

    if (!requirements.meets) {
      displayError(
        'Terminal requirements not met:\n\n' +
        requirements.issues.join('\n') +
        '\n\nPlease resize your terminal or use a different terminal emulator.'
      );
      process.exit(1);
    }

    // Start session
    progressService.startSession();

    // Show welcome and get mode selection
    const mode = await showWelcome();

    if (mode === 'exit') {
      await handleExit();
      return;
    }

    // Route to appropriate flow
    if (mode === 'quick-tour') {
      const result = await showQuickTour();

      if (result === 'full-experience') {
        await runFullExperience();
      } else {
        await handleExit();
      }
    } else if (mode === 'full-experience') {
      await runFullExperience();
    }

    // Normal exit
    await handleExit();

  } catch (error) {
    if (error.isTtyError) {
      displayError('Prompt could not be rendered in this environment');
    } else if (error.name === 'ExitPromptError') {
      // User pressed Ctrl+C - graceful exit
      await handleExit(true);
    } else {
      console.error('An error occurred:', error);
      process.exit(1);
    }
  }
}

/**
 * Run full experience mode (main menu loop)
 */
async function runFullExperience() {
  navigationState.setMode('full-experience');

  let running = true;

  while (running) {
    // Show main menu
    const choice = await showMainMenu();

    if (choice === 'exit') {
      running = false;
      continue;
    }

    // Route to module
    const result = await routeToModule(choice);

    if (result === 'quit') {
      running = false;
    }
    // If 'menu', loop continues
  }
}

/**
 * Show main menu and get user choice
 * @returns {Promise<string>} Module ID or 'exit'
 */
async function showMainMenu() {
  const visitedModules = progressService.getVisitedModules();

  displayMenu(allModules, visitedModules);

  const choices = allModules.map(module => ({
    name: module.title,
    value: module.id
  }));

  choices.push({ name: 'Exit', value: 'exit' });

  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'module',
      message: 'Select a module to explore:',
      choices
    }
  ]);

  return answer.module;
}

/**
 * Route to appropriate module
 * @param {string} moduleId - Module ID
 * @returns {Promise<string>} Result: 'menu', 'quit'
 */
async function routeToModule(moduleId) {
  switch (moduleId) {
    case 'journey':
      return await showJourney();
    case 'philosophy':
      return await showPhilosophy();
    case 'practical':
      return await showPractical();
    case 'connect':
      return await showConnect();
    default:
      console.error(`Unknown module: ${moduleId}`);
      return 'menu';
  }
}

/**
 * Handle application exit
 * @param {boolean} interrupted - Whether exit was interrupted (Ctrl+C)
 */
async function handleExit(interrupted = false) {
  // Save session
  progressService.endSession();

  if (!interrupted) {
    // Show closing message
    const stats = progressService.getStats();
    const mode = navigationState.mode;
    displayClosingMessage(mode, stats);
  }

  console.log('\n');
  process.exit(0);
}
```

---

## 📝 Testing Tasks (T025-T028)

Due to space, I'll provide simplified test templates. You can expand these:

### T025: Content Validation Tests

**File**: `tests/unit/content-validation.test.js`

```javascript
import { describe, test, expect } from '@jest/globals';
import { allModules, validateContent } from '../../src/content/stories.js';

describe('Content Validation', () => {
  test('all modules have required fields', () => {
    allModules.forEach(module => {
      expect(module.id).toBeDefined();
      expect(module.title).toBeDefined();
      expect(module.segments).toBeDefined();
      expect(Array.isArray(module.segments)).toBe(true);
      expect(module.segments.length).toBeGreaterThan(0);
    });
  });

  test('validateContent returns no errors', () => {
    const result = validateContent();
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('module IDs are unique', () => {
    const ids = allModules.map(m => m.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});
```

### T026: Service Unit Tests

**File**: `tests/unit/services.test.js`

```javascript
import { describe, test, expect, beforeEach } from '@jest/globals';
import progressService from '../../src/services/progress.js';
import navigationState from '../../src/services/navigation.js';

describe('Progress Service', () => {
  beforeEach(() => {
    // Reset state before each test
  });

  test('tracks visited modules', () => {
    // Test implementation
  });

  test('calculates session duration', () => {
    // Test implementation
  });
});

describe('Navigation State', () => {
  test('navigates to module', () => {
    navigationState.goToModule('journey');
    expect(navigationState.currentModuleId).toBe('journey');
  });

  test('maintains history', () => {
    navigationState.goToModule('journey');
    navigationState.goToModule('philosophy');
    expect(navigationState.history.length).toBeGreaterThan(0);
  });
});
```

### T027-T028: Integration Tests

Create similar test files for:
- `tests/integration/quick-tour.test.js`
- `tests/integration/full-experience.test.js`

Mock `inquirer` prompts and test full flows.

---

## ✅ T029: Manual Validation

Follow the checklist in `specs/001-build-an-interactive/quickstart.md`:

1. **Test locally**:
   ```bash
   npm pack
   npx ./chan-meng-1.0.0.tgz
   ```

2. **Verify all scenarios** from quickstart.md

3. **Test on multiple terminals**:
   - macOS Terminal.app
   - iTerm2
   - Windows Terminal (WSL)

4. **Performance testing**:
   ```bash
   time npx ./chan-meng-1.0.0.tgz
   # Should be < 5 seconds
   ```

---

## 🚀 Execution Order

1. **Complete Services** (Sequential):
   - T015 (navigation.js)
   - T016 (display.js)

2. **Create Modules** (Can do in parallel):
   - T017 (welcome.js)
   - T018-T021 (journey, philosophy, practical, connect)
   - T022 (quickTour.js)

3. **CLI Integration** (Sequential):
   - T023 (main menu logic)
   - T024 (startup flow)

4. **Testing** (Can do in parallel):
   - T025-T028 (all tests)

5. **Final Validation**:
   - T029 (manual testing)

---

## 📦 Final Steps

After completing all tasks:

1. **Update README.md** with installation and usage instructions

2. **Test the package**:
   ```bash
   npm test
   npm pack
   npx ./chan-meng-1.0.0.tgz
   ```

3. **Prepare for publishing** (optional):
   ```bash
   npm publish --dry-run
   ```

---

## 📞 Need Help?

If you encounter issues:
1. Check `CLAUDE.md` for project context
2. Review `specs/001-build-an-interactive/plan.md` for architecture
3. Consult `specs/001-build-an-interactive/tasks.md` for task details

Good luck! 🚀
