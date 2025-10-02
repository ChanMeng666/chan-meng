/**
 * Stories - Main Content Export
 *
 * Aggregates all content modules and provides
 * a single point of import for the application.
 */

import { journeyModule } from './journey.js';
import { philosophyModule } from './philosophy.js';
import { practicalModule } from './practical.js';
import { connectModule } from './connect.js';
import { quickTourFlow } from './quick-tour.js';

// All modules in display order
export const allModules = [
  journeyModule,
  philosophyModule,
  practicalModule,
  connectModule
];

// Named exports for direct access
export {
  journeyModule,
  philosophyModule,
  practicalModule,
  connectModule,
  quickTourFlow
};

/**
 * Get a module by ID
 * @param {string} id - Module ID
 * @returns {Object|null} Module object or null if not found
 */
export function getModuleById(id) {
  return allModules.find(module => module.id === id) || null;
}

/**
 * Get a specific segment from a module
 * @param {string} moduleId - Module ID
 * @param {number} segmentId - Segment ID
 * @returns {Object|null} Segment object or null if not found
 */
export function getSegment(moduleId, segmentId) {
  const module = getModuleById(moduleId);
  if (!module) return null;

  return module.segments.find(seg => seg.id === segmentId) || null;
}

/**
 * Calculate total estimated time for all modules
 * @returns {number} Total time in seconds
 */
export function getTotalEstimatedTime() {
  return allModules.reduce((sum, module) => sum + module.estimatedTime, 0);
}

/**
 * Validate content structure (basic check)
 * @returns {Object} Validation result { valid: boolean, errors: string[] }
 */
export function validateContent() {
  const errors = [];

  allModules.forEach(module => {
    if (!module.id || !module.title || !module.segments) {
      errors.push(`Invalid module structure: ${module.id || 'unknown'}`);
    }

    if (module.segments && module.segments.length === 0) {
      errors.push(`Module ${module.id} has no segments`);
    }

    const calculatedTime = module.segments
      ? module.segments.reduce((sum, seg) => sum + seg.estimatedTime, 0)
      : 0;

    if (Math.abs(calculatedTime - module.estimatedTime) > 10) {
      errors.push(
        `Module ${module.id} time mismatch: declared ${module.estimatedTime}s, ` +
        `calculated ${calculatedTime}s`
      );
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
}
