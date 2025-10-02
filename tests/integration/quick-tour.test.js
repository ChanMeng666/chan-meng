/**
 * Quick Tour Integration Test
 *
 * Tests the complete Quick Tour flow from start to finish.
 */

import { jest } from '@jest/globals';

describe('Quick Tour Integration', () => {
  test('quick tour module can be imported', async () => {
    const { showQuickTour } = await import('../../src/modules/quickTour.js');
    expect(typeof showQuickTour).toBe('function');
  });

  test('quick tour flow has correct structure', async () => {
    const { quickTourFlow } = await import('../../src/content/quick-tour.js');

    expect(Array.isArray(quickTourFlow)).toBe(true);
    expect(quickTourFlow.length).toBeGreaterThan(0);

    quickTourFlow.forEach(item => {
      expect(item).toHaveProperty('moduleId');
      expect(item).toHaveProperty('segmentId');
    });
  });

  test('all quick tour segments exist', async () => {
    const { quickTourFlow } = await import('../../src/content/quick-tour.js');
    const { allModules } = await import('../../src/content/stories.js');

    quickTourFlow.forEach(item => {
      const module = allModules.find(m => m.id === item.moduleId);
      expect(module).toBeDefined();

      if (module) {
        const segment = module.segments.find(s => s.id === item.segmentId);
        expect(segment).toBeDefined();
      }
    });
  });

  test('quick tour covers multiple modules', async () => {
    const { quickTourFlow } = await import('../../src/content/quick-tour.js');

    const uniqueModules = new Set(quickTourFlow.map(item => item.moduleId));
    expect(uniqueModules.size).toBeGreaterThan(1);
  });

  test('quick tour estimated time is reasonable', async () => {
    const { quickTourFlow } = await import('../../src/content/quick-tour.js');

    // Assuming 30-60 seconds per segment
    const itemCount = quickTourFlow.length;
    const minTime = itemCount * 30;
    const maxTime = itemCount * 60;

    // Should be around 180 seconds (3 minutes)
    expect(180).toBeGreaterThanOrEqual(minTime * 0.8); // Allow 20% variance
    expect(180).toBeLessThanOrEqual(maxTime * 1.2);
  });

  describe('NavigationState during Quick Tour', () => {
    let NavigationState;

    beforeAll(async () => {
      const module = await import('../../src/services/navigation.js');
      NavigationState = module.NavigationState;
    });

    test('navigation state supports Quick Tour mode', () => {
      const navState = new NavigationState();

      navState.startQuickTour(0);

      expect(navState.mode).toBe('quick-tour');
      expect(navState.quickTourIndex).toBe(0);
    });

    test('navigation state can advance through Quick Tour', () => {
      const navState = new NavigationState();

      navState.startQuickTour(0);
      navState.advanceQuickTour();
      navState.advanceQuickTour();

      expect(navState.quickTourIndex).toBe(2);
    });
  });

  describe('Progress Tracking during Quick Tour', () => {
    let ProgressService;

    beforeAll(async () => {
      const module = await import('../../src/services/progress.js');
      ProgressService = module.ProgressService;
    });

    test('progress service can mark Quick Tour as completed', () => {
      const progressService = new ProgressService();

      progressService.completeQuickTour();

      expect(progressService.hasCompletedQuickTour()).toBe(true);
    });

    test('progress service tracks visited modules during Quick Tour', () => {
      const progressService = new ProgressService();

      progressService.updatePosition('journey', 1);
      progressService.updatePosition('philosophy', 1);

      const visitedModules = progressService.getVisitedModules();
      expect(visitedModules).toContain('journey');
      expect(visitedModules).toContain('philosophy');
    });
  });
});
