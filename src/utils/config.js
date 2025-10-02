/**
 * Configuration Manager
 *
 * Manages user preferences and session data using the `conf` package.
 * Persists data to ~/.config/chan-meng-cli/ (or platform equivalent).
 */

import Conf from 'conf';

// JSON Schema for validation (based on preferences-schema.json)
const schema = {
  version: {
    type: 'number',
    default: 1
  },
  firstRunCompleted: {
    type: 'boolean',
    default: false
  },
  completedQuickTour: {
    type: 'boolean',
    default: false
  },
  visitedModules: {
    type: 'array',
    items: {
      type: 'string'
    },
    default: []
  },
  lastSession: {
    type: 'object',
    properties: {
      timestamp: {
        type: ['string', 'null']
      },
      mode: {
        type: ['string', 'null']
      },
      moduleId: {
        type: ['string', 'null']
      },
      segmentId: {
        type: ['number', 'null']
      }
    },
    default: {
      timestamp: null,
      mode: null,
      moduleId: null,
      segmentId: null
    }
  },
  preferences: {
    type: 'object',
    properties: {
      colorEnabled: {
        default: 'auto'
      },
      showTimeEstimates: {
        type: 'boolean',
        default: true
      }
    },
    default: {
      colorEnabled: 'auto',
      showTimeEstimates: true
    }
  },
  stats: {
    type: 'object',
    properties: {
      totalSessions: {
        type: 'number',
        default: 0
      },
      totalTimeSpent: {
        type: 'number',
        default: 0
      },
      modulesCompleted: {
        type: 'array',
        items: {
          type: 'string'
        },
        default: []
      }
    },
    default: {
      totalSessions: 0,
      totalTimeSpent: 0,
      modulesCompleted: []
    }
  }
};

// Initialize Conf instance
const config = new Conf({
  projectName: 'chan-meng-cli',
  schema,
  clearInvalidConfig: false // Keep data even if schema changes
});

// Default preferences structure
export const DEFAULT_PREFERENCES = {
  version: 1,
  firstRunCompleted: false,
  completedQuickTour: false,
  visitedModules: [],
  lastSession: {
    timestamp: null,
    mode: null,
    moduleId: null,
    segmentId: null
  },
  preferences: {
    colorEnabled: 'auto',
    showTimeEstimates: true
  },
  stats: {
    totalSessions: 0,
    totalTimeSpent: 0,
    modulesCompleted: []
  }
};

/**
 * Get all preferences
 * @returns {Object} User preferences
 */
export function getPreferences() {
  // Ensure all default keys exist
  const prefs = { ...DEFAULT_PREFERENCES };

  // Merge with stored preferences
  for (const key of Object.keys(DEFAULT_PREFERENCES)) {
    if (config.has(key)) {
      prefs[key] = config.get(key);
    }
  }

  return prefs;
}

/**
 * Set preferences (partial update)
 * @param {Object} updates - Partial preferences object
 */
export function setPreferences(updates) {
  for (const [key, value] of Object.entries(updates)) {
    config.set(key, value);
  }
}

/**
 * Update last session info
 * @param {Object} session - Session data { mode, moduleId, segmentId }
 */
export function updateLastSession(session) {
  config.set('lastSession', {
    timestamp: new Date().toISOString(),
    mode: session.mode || null,
    moduleId: session.moduleId || null,
    segmentId: session.segmentId || null
  });
}

/**
 * Mark first run as completed
 */
export function markFirstRunCompleted() {
  config.set('firstRunCompleted', true);
}

/**
 * Mark Quick Tour as completed
 */
export function markQuickTourCompleted() {
  config.set('completedQuickTour', true);
}

/**
 * Add a module to visited list
 * @param {string} moduleId - Module ID
 */
export function markModuleVisited(moduleId) {
  const visited = config.get('visitedModules') || [];
  if (!visited.includes(moduleId)) {
    visited.push(moduleId);
    config.set('visitedModules', visited);
  }
}

/**
 * Mark a module as completed (fully viewed)
 * @param {string} moduleId - Module ID
 */
export function markModuleCompleted(moduleId) {
  const completed = config.get('stats.modulesCompleted') || [];
  if (!completed.includes(moduleId)) {
    completed.push(moduleId);
    config.set('stats.modulesCompleted', completed);
  }
}

/**
 * Increment session count
 */
export function incrementSessionCount() {
  const current = config.get('stats.totalSessions') || 0;
  config.set('stats.totalSessions', current + 1);
}

/**
 * Add time to total spent
 * @param {number} seconds - Seconds to add
 */
export function addTimeSpent(seconds) {
  const current = config.get('stats.totalTimeSpent') || 0;
  config.set('stats.totalTimeSpent', current + seconds);
}

/**
 * Check if this is first run
 * @returns {boolean} True if first run
 */
export function isFirstRun() {
  return !config.get('firstRunCompleted');
}

/**
 * Check if user completed Quick Tour
 * @returns {boolean} True if completed
 */
export function hasCompletedQuickTour() {
  return config.get('completedQuickTour') || false;
}

/**
 * Get visited modules
 * @returns {string[]} Array of module IDs
 */
export function getVisitedModules() {
  return config.get('visitedModules') || [];
}

/**
 * Get user stats
 * @returns {Object} Stats object
 */
export function getStats() {
  return config.get('stats') || DEFAULT_PREFERENCES.stats;
}

/**
 * Reset all preferences (for testing or user request)
 */
export function resetPreferences() {
  config.clear();
}

/**
 * Get config file path (for debugging)
 * @returns {string} Path to config file
 */
export function getConfigPath() {
  return config.path;
}

// Export config instance for advanced use
export { config };
