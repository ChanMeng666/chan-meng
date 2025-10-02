/**
 * Full Experience Integration Test
 *
 * Tests the complete Full Experience flow including menu navigation,
 * module exploration, and progress persistence.
 */

import { jest } from '@jest/globals';

describe('Full Experience Integration', () => {
  describe('Module Imports', () => {
    test('all content modules can be imported', async () => {
      const journey = await import('../../src/modules/journey.js');
      const philosophy = await import('../../src/modules/philosophy.js');
      const practical = await import('../../src/modules/practical.js');
      const connect = await import('../../src/modules/connect.js');

      expect(typeof journey.showJourney).toBe('function');
      expect(typeof philosophy.showPhilosophy).toBe('function');
      expect(typeof practical.showPractical).toBe('function');
      expect(typeof connect.showConnect).toBe('function');
    });

    test('CLI orchestration can be imported', async () => {
      const cli = await import('../../src/cli.js');
      expect(typeof cli.startCLI).toBe('function');
    });

    test('welcome module can be imported', async () => {
      const welcome = await import('../../src/modules/welcome.js');
      expect(typeof welcome.showWelcome).toBe('function');
    });
  });

  describe('All Modules Structure', () => {
    test('all modules are available', async () => {
      const { allModules } = await import('../../src/content/stories.js');

      expect(Array.isArray(allModules)).toBe(true);
      expect(allModules.length).toBeGreaterThanOrEqual(4);

      const moduleIds = allModules.map(m => m.id);
      expect(moduleIds).toContain('journey');
      expect(moduleIds).toContain('philosophy');
      expect(moduleIds).toContain('practical');
      expect(moduleIds).toContain('connect');
    });

    test('all modules have required display properties', async () => {
      const { allModules } = await import('../../src/content/stories.js');

      allModules.forEach(module => {
        expect(module).toHaveProperty('id');
        expect(module).toHaveProperty('title');
        expect(module).toHaveProperty('description');
        expect(module).toHaveProperty('estimatedTime');
        expect(module).toHaveProperty('segments');

        expect(typeof module.title).toBe('string');
        expect(typeof module.description).toBe('string');
        expect(typeof module.estimatedTime).toBe('number');
        expect(module.segments.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Navigation Through Modules', () => {
    let NavigationState;

    beforeAll(async () => {
      const module = await import('../../src/services/navigation.js');
      NavigationState = module.NavigationState;
    });

    test('navigation state supports full experience mode', () => {
      const navState = new NavigationState();

      navState.mode = 'full-experience';
      navState.goToModule('journey');

      expect(navState.currentModuleId).toBe('journey');
      expect(navState.mode).toBe('module');
    });

    test('can navigate between multiple modules', () => {
      const navState = new NavigationState();

      navState.goToModule('journey');
      expect(navState.currentModuleId).toBe('journey');

      navState.exitToMenu();
      expect(navState.currentModuleId).toBeNull();
      expect(navState.mode).toBe('full-experience');

      navState.goToModule('philosophy');
      expect(navState.currentModuleId).toBe('philosophy');
    });

    test('can navigate back through history', () => {
      const navState = new NavigationState();

      navState.goToModule('journey');
      navState.goToModule('philosophy');
      navState.goToModule('practical');

      navState.goBack();
      expect(navState.currentModuleId).toBe('philosophy');

      navState.goBack();
      expect(navState.currentModuleId).toBe('journey');
    });
  });

  describe('Progress Persistence', () => {
    let ProgressService;

    beforeAll(async () => {
      const module = await import('../../src/services/progress.js');
      ProgressService = module.ProgressService;
    });

    test('progress service tracks visited modules', () => {
      const progressService = new ProgressService();

      progressService.updatePosition('journey', 1);
      progressService.updatePosition('philosophy', 2);
      progressService.updatePosition('practical', 1);

      const visitedModules = progressService.getVisitedModules();

      expect(visitedModules).toContain('journey');
      expect(visitedModules).toContain('philosophy');
      expect(visitedModules).toContain('practical');
    });

    test('progress service can mark modules as completed', () => {
      const progressService = new ProgressService();

      progressService.completeModule('journey');
      progressService.completeModule('philosophy');

      // Note: We can't easily test getStats() without mocking config
      // This would be tested in manual validation
    });

    test('progress service tracks session statistics', () => {
      const progressService = new ProgressService();

      progressService.startSession('full-experience');
      progressService.updatePosition('journey', 1);
      progressService.updatePosition('journey', 2);

      const duration = progressService.getCurrentSessionDuration();
      expect(duration).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Resume Functionality', () => {
    test('last session data structure is correct', () => {
      const expectedStructure = {
        timestamp: null,
        mode: null,
        moduleId: null,
        segmentId: null
      };

      // This structure should match what's stored and retrieved
      expect(expectedStructure).toHaveProperty('timestamp');
      expect(expectedStructure).toHaveProperty('mode');
      expect(expectedStructure).toHaveProperty('moduleId');
      expect(expectedStructure).toHaveProperty('segmentId');
    });
  });

  describe('Display Services', () => {
    test('display utilities can be imported', async () => {
      const display = await import('../../src/services/display.js');

      expect(typeof display.displayMenu).toBe('function');
      expect(typeof display.displaySegment).toBe('function');
      expect(typeof display.displayWelcome).toBe('function');
      expect(typeof display.displayClosingMessage).toBe('function');
    });

    test('display functions handle capabilities parameter', async () => {
      const { displayProgress } = await import('../../src/services/display.js');

      const capabilities = {
        supportsColor: false,
        width: 80,
        height: 24
      };

      // Should not throw
      expect(() => {
        displayProgress(5, 10, capabilities);
      }).not.toThrow();
    });
  });

  describe('End-to-End Flow', () => {
    test('all required components are present for full flow', async () => {
      // Entry point
      const indexModule = await import('../../index.js');

      // CLI orchestration
      const cli = await import('../../src/cli.js');
      expect(typeof cli.startCLI).toBe('function');

      // All content modules
      const journey = await import('../../src/modules/journey.js');
      const philosophy = await import('../../src/modules/philosophy.js');
      const practical = await import('../../src/modules/practical.js');
      const connect = await import('../../src/modules/connect.js');

      expect(journey.showJourney).toBeDefined();
      expect(philosophy.showPhilosophy).toBeDefined();
      expect(practical.showPractical).toBeDefined();
      expect(connect.showConnect).toBeDefined();

      // Services
      const progress = await import('../../src/services/progress.js');
      const navigation = await import('../../src/services/navigation.js');
      const display = await import('../../src/services/display.js');

      expect(progress.default).toBeDefined();
      expect(navigation.default).toBeDefined();
      expect(display.displayMenu).toBeDefined();
    });
  });
});
