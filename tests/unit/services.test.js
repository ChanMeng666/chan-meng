/**
 * Service Unit Tests
 *
 * Tests for progress service, navigation service, and other utilities.
 */

import { jest } from '@jest/globals';
import { ProgressService } from '../../src/services/progress.js';
import { NavigationState } from '../../src/services/navigation.js';
import {
  detectTerminalCapabilities,
  checkMinimumRequirements
} from '../../src/utils/terminal.js';

describe('Progress Service', () => {
  let progressService;

  beforeEach(() => {
    // Create new instance for each test
    progressService = new ProgressService();
  });

  test('startSession initializes session', () => {
    progressService.startSession('quick-tour');

    expect(progressService.sessionStartTime).not.toBeNull();
    expect(progressService.currentSessionData.mode).toBe('quick-tour');
  });

  test('updatePosition tracks current position', () => {
    progressService.updatePosition('journey', 1);

    expect(progressService.currentSessionData.moduleId).toBe('journey');
    expect(progressService.currentSessionData.segmentId).toBe(1);
  });

  test('getCurrentSessionDuration returns valid duration', () => {
    progressService.startSession('full-experience');

    // Wait a bit
    const duration = progressService.getCurrentSessionDuration();

    expect(duration).toBeGreaterThanOrEqual(0);
    expect(typeof duration).toBe('number');
  });

  test('formatDuration handles seconds correctly', () => {
    expect(ProgressService.formatDuration(30)).toBe('30 seconds');
    expect(ProgressService.formatDuration(1)).toBe('1 second');
  });

  test('formatDuration handles minutes correctly', () => {
    expect(ProgressService.formatDuration(60)).toBe('1 minute');
    expect(ProgressService.formatDuration(120)).toBe('2 minutes');
    expect(ProgressService.formatDuration(90)).toBe('1m 30s');
  });

  test('getCompletionPercentage calculates correctly', () => {
    const mockModules = [
      { id: 'journey' },
      { id: 'philosophy' },
      { id: 'practical' },
      { id: 'connect' }
    ];

    // Mock getVisitedModules
    progressService.getVisitedModules = jest.fn(() => ['journey', 'philosophy']);

    const percentage = progressService.getCompletionPercentage(mockModules);

    expect(percentage).toBe(50); // 2 out of 4 modules
  });
});

describe('Navigation State', () => {
  let navigationState;

  beforeEach(() => {
    navigationState = new NavigationState();
  });

  test('initializes with correct defaults', () => {
    expect(navigationState.mode).toBe('welcome');
    expect(navigationState.currentModuleId).toBeNull();
    expect(navigationState.currentSegmentId).toBeNull();
    expect(navigationState.history).toEqual([]);
    expect(navigationState.shouldExit).toBe(false);
  });

  test('goToModule updates state correctly', () => {
    navigationState.goToModule('journey');

    expect(navigationState.currentModuleId).toBe('journey');
    expect(navigationState.mode).toBe('module');
  });

  test('goToSegment updates state correctly', () => {
    navigationState.goToSegment('philosophy', 2);

    expect(navigationState.currentModuleId).toBe('philosophy');
    expect(navigationState.currentSegmentId).toBe(2);
  });

  test('goBack returns to previous state', () => {
    navigationState.goToModule('journey');
    navigationState.goToModule('philosophy');

    const success = navigationState.goBack();

    expect(success).toBe(true);
    expect(navigationState.currentModuleId).toBe('journey');
  });

  test('goBack returns false when no history', () => {
    const success = navigationState.goBack();

    expect(success).toBe(false);
  });

  test('exitToMenu resets module state', () => {
    navigationState.goToModule('journey');
    navigationState.exitToMenu();

    expect(navigationState.currentModuleId).toBeNull();
    expect(navigationState.currentSegmentId).toBeNull();
    expect(navigationState.mode).toBe('full-experience');
  });

  test('startQuickTour sets correct mode', () => {
    navigationState.startQuickTour(0);

    expect(navigationState.mode).toBe('quick-tour');
    expect(navigationState.quickTourIndex).toBe(0);
  });

  test('advanceQuickTour increments index', () => {
    navigationState.startQuickTour(0);
    const success = navigationState.advanceQuickTour();

    expect(success).toBe(true);
    expect(navigationState.quickTourIndex).toBe(1);
  });

  test('quit sets exit flag', () => {
    navigationState.quit();

    expect(navigationState.shouldQuit()).toBe(true);
  });

  test('history is limited to 100 items', () => {
    // Add 150 items
    for (let i = 0; i < 150; i++) {
      navigationState.goToModule(`module-${i}`);
    }

    expect(navigationState.history.length).toBeLessThanOrEqual(100);
  });

  test('getState returns current state', () => {
    navigationState.goToModule('journey');
    const state = navigationState.getState();

    expect(state).toHaveProperty('mode');
    expect(state).toHaveProperty('currentModuleId');
    expect(state).toHaveProperty('currentSegmentId');
    expect(state.currentModuleId).toBe('journey');
  });

  test('getSessionDuration returns valid duration', () => {
    const duration = navigationState.getSessionDuration();

    expect(duration).toBeGreaterThanOrEqual(0);
    expect(typeof duration).toBe('number');
  });

  test('reset clears all state', () => {
    navigationState.goToModule('journey');
    navigationState.quit();
    navigationState.reset();

    expect(navigationState.mode).toBe('welcome');
    expect(navigationState.currentModuleId).toBeNull();
    expect(navigationState.shouldExit).toBe(false);
    expect(navigationState.history).toEqual([]);
  });
});

describe('Terminal Capabilities', () => {
  test('detectTerminalCapabilities returns valid object', () => {
    const capabilities = detectTerminalCapabilities();

    expect(capabilities).toHaveProperty('supportsColor');
    expect(capabilities).toHaveProperty('colorLevel');
    expect(capabilities).toHaveProperty('supportsUnicode');
    expect(capabilities).toHaveProperty('supportsEmoji');
    expect(capabilities).toHaveProperty('width');
    expect(capabilities).toHaveProperty('height');
    expect(capabilities).toHaveProperty('isTTY');

    expect(typeof capabilities.supportsColor).toBe('boolean');
    expect(typeof capabilities.colorLevel).toBe('number');
    expect(typeof capabilities.width).toBe('number');
    expect(typeof capabilities.height).toBe('number');
  });

  test('checkMinimumRequirements detects narrow terminals', () => {
    const capabilities = {
      width: 60,
      height: 24,
      isTTY: true
    };

    const result = checkMinimumRequirements(capabilities);

    expect(result.meets).toBe(false);
    expect(result.issues.length).toBeGreaterThan(0);
    expect(result.issues[0]).toMatch(/narrow/i);
  });

  test('checkMinimumRequirements detects short terminals', () => {
    const capabilities = {
      width: 80,
      height: 20,
      isTTY: true
    };

    const result = checkMinimumRequirements(capabilities);

    expect(result.meets).toBe(false);
    expect(result.issues.length).toBeGreaterThan(0);
    expect(result.issues[0]).toMatch(/short/i);
  });

  test('checkMinimumRequirements passes for valid terminals', () => {
    const capabilities = {
      width: 100,
      height: 30,
      isTTY: true
    };

    const result = checkMinimumRequirements(capabilities);

    expect(result.meets).toBe(true);
    expect(result.issues).toEqual([]);
  });
});
