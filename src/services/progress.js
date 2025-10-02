/**
 * Progress Tracking Service
 *
 * Manages user progress through the CLI experience,
 * tracking visited modules, session data, and statistics.
 */

import {
  getPreferences,
  updateLastSession,
  markModuleVisited as configMarkModuleVisited,
  markModuleCompleted as configMarkModuleCompleted,
  markQuickTourCompleted as configMarkQuickTourCompleted,
  markFirstRunCompleted as configMarkFirstRunCompleted,
  incrementSessionCount,
  addTimeSpent,
  isFirstRun,
  hasCompletedQuickTour,
  getVisitedModules,
  getStats
} from '../utils/config.js';

/**
 * Progress Tracking Service
 */
class ProgressService {
  constructor() {
    this.sessionStartTime = null;
    this.currentSessionData = {
      mode: null,
      moduleId: null,
      segmentId: null
    };
  }

  /**
   * Initialize a new session
   * @param {string} mode - Session mode ('quick-tour' or 'full-experience')
   */
  startSession(mode = null) {
    this.sessionStartTime = Date.now();
    this.currentSessionData.mode = mode;
    incrementSessionCount();
  }

  /**
   * End the current session and save progress
   */
  endSession() {
    if (this.sessionStartTime) {
      const duration = Math.floor((Date.now() - this.sessionStartTime) / 1000);
      addTimeSpent(duration);
    }

    // Save last position
    updateLastSession(this.currentSessionData);

    this.sessionStartTime = null;
  }

  /**
   * Update current position
   * @param {string} moduleId - Current module ID
   * @param {number} segmentId - Current segment ID
   */
  updatePosition(moduleId, segmentId) {
    this.currentSessionData.moduleId = moduleId;
    this.currentSessionData.segmentId = segmentId;

    // Mark module as visited
    configMarkModuleVisited(moduleId);
  }

  /**
   * Mark a module as completed (all segments viewed)
   * @param {string} moduleId - Module ID
   */
  completeModule(moduleId) {
    configMarkModuleCompleted(moduleId);
  }

  /**
   * Mark Quick Tour as completed
   */
  completeQuickTour() {
    configMarkQuickTourCompleted();
  }

  /**
   * Mark first run as completed
   */
  completeFirstRun() {
    configMarkFirstRunCompleted();
  }

  /**
   * Check if this is the user's first run
   * @returns {boolean} True if first run
   */
  isFirstRun() {
    return isFirstRun();
  }

  /**
   * Check if user has completed Quick Tour
   * @returns {boolean} True if completed
   */
  hasCompletedQuickTour() {
    return hasCompletedQuickTour();
  }

  /**
   * Get list of visited modules
   * @returns {string[]} Array of module IDs
   */
  getVisitedModules() {
    return getVisitedModules();
  }

  /**
   * Check if a module has been visited
   * @param {string} moduleId - Module ID
   * @returns {boolean} True if visited
   */
  hasVisitedModule(moduleId) {
    return this.getVisitedModules().includes(moduleId);
  }

  /**
   * Get user statistics
   * @returns {Object} Stats object
   */
  getStats() {
    return getStats();
  }

  /**
   * Get last session data
   * @returns {Object} Last session info
   */
  getLastSession() {
    const prefs = getPreferences();
    return prefs.lastSession;
  }

  /**
   * Get session duration so far (in seconds)
   * @returns {number} Duration in seconds
   */
  getCurrentSessionDuration() {
    if (!this.sessionStartTime) return 0;
    return Math.floor((Date.now() - this.sessionStartTime) / 1000);
  }

  /**
   * Format session duration as human-readable string
   * @param {number} seconds - Duration in seconds
   * @returns {string} Formatted duration
   */
  static formatDuration(seconds) {
    if (seconds < 60) {
      return `${seconds} second${seconds !== 1 ? 's' : ''}`;
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (remainingSeconds === 0) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }

    return `${minutes}m ${remainingSeconds}s`;
  }

  /**
   * Get completion percentage (rough estimate)
   * @param {Array} allModules - All available modules
   * @returns {number} Percentage (0-100)
   */
  getCompletionPercentage(allModules) {
    const totalModules = allModules.length;
    const visitedCount = this.getVisitedModules().length;

    if (totalModules === 0) return 0;

    return Math.round((visitedCount / totalModules) * 100);
  }
}

// Export singleton instance
const progressService = new ProgressService();
export default progressService;

// Also export class for testing
export { ProgressService };
