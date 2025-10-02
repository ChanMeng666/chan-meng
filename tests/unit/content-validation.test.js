/**
 * Content Validation Tests
 *
 * Validates all content modules against the content schema.
 */

import { jest } from '@jest/globals';

// Import all content modules
import { journeyModule } from '../../src/content/journey.js';
import { philosophyModule } from '../../src/content/philosophy.js';
import { practicalModule } from '../../src/content/practical.js';
import { connectModule } from '../../src/content/connect.js';
import { quickTourFlow } from '../../src/content/quick-tour.js';
import { allModules } from '../../src/content/stories.js';

describe('Content Validation', () => {
  describe('Module Structure', () => {
    const modules = [journeyModule, philosophyModule, practicalModule, connectModule];

    test('all modules have required fields', () => {
      modules.forEach(module => {
        expect(module).toHaveProperty('id');
        expect(module).toHaveProperty('title');
        expect(module).toHaveProperty('description');
        expect(module).toHaveProperty('estimatedTime');
        expect(module).toHaveProperty('segments');

        expect(typeof module.id).toBe('string');
        expect(typeof module.title).toBe('string');
        expect(typeof module.description).toBe('string');
        expect(typeof module.estimatedTime).toBe('number');
        expect(Array.isArray(module.segments)).toBe(true);
      });
    });

    test('all module IDs are unique', () => {
      const ids = modules.map(m => m.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    test('all modules have at least one segment', () => {
      modules.forEach(module => {
        expect(module.segments.length).toBeGreaterThan(0);
      });
    });

    test('estimated times are positive', () => {
      modules.forEach(module => {
        expect(module.estimatedTime).toBeGreaterThan(0);
      });
    });
  });

  describe('Segment Structure', () => {
    test('all segments have required fields', () => {
      const modules = [journeyModule, philosophyModule, practicalModule, connectModule];

      modules.forEach(module => {
        module.segments.forEach(segment => {
          expect(segment).toHaveProperty('id');
          expect(segment).toHaveProperty('title');
          expect(segment).toHaveProperty('content');

          expect(typeof segment.id).toBe('number');
          expect(typeof segment.title).toBe('string');
          expect(typeof segment.content).toBe('string');

          // Content should not be empty
          expect(segment.content.trim().length).toBeGreaterThan(0);
        });
      });
    });

    test('segment IDs are sequential within each module', () => {
      const modules = [journeyModule, philosophyModule, practicalModule, connectModule];

      modules.forEach(module => {
        module.segments.forEach((segment, index) => {
          expect(segment.id).toBe(index + 1);
        });
      });
    });
  });

  describe('Time Estimates', () => {
    test('module estimated time roughly matches segment count', () => {
      const modules = [journeyModule, philosophyModule, practicalModule];

      modules.forEach(module => {
        const segmentCount = module.segments.length;
        // Assume ~60-180 seconds per segment
        const minExpected = segmentCount * 60;
        const maxExpected = segmentCount * 180;

        expect(module.estimatedTime).toBeGreaterThanOrEqual(minExpected);
        expect(module.estimatedTime).toBeLessThanOrEqual(maxExpected);
      });
    });
  });

  describe('Quick Tour Flow', () => {
    test('quick tour flow is an array', () => {
      expect(Array.isArray(quickTourFlow)).toBe(true);
    });

    test('quick tour has items', () => {
      expect(quickTourFlow.length).toBeGreaterThan(0);
    });

    test('all quick tour items have moduleId and segmentId', () => {
      quickTourFlow.forEach(item => {
        expect(item).toHaveProperty('moduleId');
        expect(item).toHaveProperty('segmentId');
        expect(typeof item.moduleId).toBe('string');
        expect(typeof item.segmentId).toBe('number');
      });
    });

    test('quick tour references valid modules and segments', () => {
      const modules = [journeyModule, philosophyModule, practicalModule, connectModule];

      quickTourFlow.forEach(item => {
        const module = modules.find(m => m.id === item.moduleId);
        expect(module).toBeDefined();

        if (module) {
          const segment = module.segments.find(s => s.id === item.segmentId);
          expect(segment).toBeDefined();
        }
      });
    });

    test('quick tour estimated time is around 180 seconds', () => {
      // Rough estimate: count items * average time per segment
      const itemCount = quickTourFlow.length;
      // Should be around 3-5 items for ~180 seconds (36-60 seconds each)
      expect(itemCount).toBeGreaterThanOrEqual(3);
      expect(itemCount).toBeLessThanOrEqual(7);
    });
  });

  describe('All Modules Export', () => {
    test('allModules includes all content modules', () => {
      expect(Array.isArray(allModules)).toBe(true);
      expect(allModules.length).toBeGreaterThan(0);

      const moduleIds = allModules.map(m => m.id);
      expect(moduleIds).toContain('journey');
      expect(moduleIds).toContain('philosophy');
      expect(moduleIds).toContain('practical');
      expect(moduleIds).toContain('connect');
    });

    test('allModules are in correct display order', () => {
      const expectedOrder = ['journey', 'philosophy', 'practical', 'connect'];
      const actualOrder = allModules.map(m => m.id);

      expect(actualOrder).toEqual(expectedOrder);
    });
  });

  describe('Content Authenticity', () => {
    test('journey module contains key biographical elements', () => {
      const content = journeyModule.segments.map(s => s.content).join(' ');

      // Key elements from Chan's biography
      expect(content).toMatch(/2018|twenty-eight|28/); // Age of breakaway
      expect(content).toMatch(/Guilin|Nanning/); // Cities
      expect(content).toMatch(/New Zealand/i); // Current location
    });

    test('philosophy module contains core principle', () => {
      const content = philosophyModule.segments.map(s => s.content).join(' ');

      // Core minimalist principle
      expect(content).toMatch(/此时此刻没用/);
    });

    test('practical module contains concrete examples', () => {
      const content = practicalModule.segments.map(s => s.content).join(' ');

      // Specific minimalist practices
      expect(content).toMatch(/backpack|foam mat|fishing vest/i);
    });

    test('connect module contains contact information', () => {
      const content = connectModule.segments[0].content;

      // Should have contact details
      expect(content).toMatch(/@|github|linkedin/i);
    });
  });
});
