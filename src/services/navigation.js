/**
 * Navigation State Manager
 *
 * Manages the current state of the CLI navigation,
 * including current module, segment, mode, and history.
 */

class NavigationState {
  constructor() {
    this.mode = 'welcome'; // 'welcome', 'quick-tour', 'full-experience', 'module'
    this.currentModuleId = null;
    this.currentSegmentId = null;
    this.history = []; // Stack of previous states
    this.sessionStart = new Date();
    this.quickTourIndex = null; // For tracking position in Quick Tour
    this.shouldExit = false;
  }

  /**
   * Navigate to a specific module
   * @param {string} moduleId - Module ID to navigate to
   */
  goToModule(moduleId) {
    this.addToHistory(this.currentModuleId, this.currentSegmentId);
    this.currentModuleId = moduleId;
    this.currentSegmentId = null;
    this.mode = 'module';
  }

  /**
   * Navigate to a specific segment within a module
   * @param {string} moduleId - Module ID
   * @param {number} segmentId - Segment ID
   */
  goToSegment(moduleId, segmentId) {
    this.addToHistory(this.currentModuleId, this.currentSegmentId);
    this.currentModuleId = moduleId;
    this.currentSegmentId = segmentId;
  }

  /**
   * Go back to previous state
   * @returns {boolean} True if successfully went back, false if at start
   */
  goBack() {
    if (this.history.length === 0) {
      return false;
    }

    const previous = this.history.pop();
    this.currentModuleId = previous.moduleId;
    this.currentSegmentId = previous.segmentId;
    this.mode = previous.mode;

    return true;
  }

  /**
   * Exit current module and return to main menu
   */
  exitToMenu() {
    this.currentModuleId = null;
    this.currentSegmentId = null;
    this.mode = 'full-experience';
  }

  /**
   * Set mode to Quick Tour
   * @param {number} index - Starting index in quick tour flow
   */
  startQuickTour(index = 0) {
    this.mode = 'quick-tour';
    this.quickTourIndex = index;
  }

  /**
   * Advance to next segment in Quick Tour
   * @returns {boolean} True if advanced, false if at end
   */
  advanceQuickTour() {
    if (this.quickTourIndex === null) {
      return false;
    }

    this.quickTourIndex++;
    return true;
  }

  /**
   * Signal that the CLI should exit
   */
  quit() {
    this.shouldExit = true;
  }

  /**
   * Check if should exit
   * @returns {boolean} True if should exit
   */
  shouldQuit() {
    return this.shouldExit;
  }

  /**
   * Add current state to history
   * @param {string} moduleId - Module ID
   * @param {number} segmentId - Segment ID
   */
  addToHistory(moduleId, segmentId) {
    // Don't add null states to history
    if (moduleId === null && segmentId === null) {
      return;
    }

    this.history.push({
      moduleId,
      segmentId,
      mode: this.mode,
      timestamp: new Date()
    });

    // Limit history to last 100 items
    if (this.history.length > 100) {
      this.history.shift();
    }
  }

  /**
   * Get current state as object
   * @returns {Object} Current state
   */
  getState() {
    return {
      mode: this.mode,
      currentModuleId: this.currentModuleId,
      currentSegmentId: this.currentSegmentId,
      quickTourIndex: this.quickTourIndex,
      historyLength: this.history.length
    };
  }

  /**
   * Get session duration in seconds
   * @returns {number} Duration in seconds
   */
  getSessionDuration() {
    return Math.floor((new Date() - this.sessionStart) / 1000);
  }

  /**
   * Reset navigation state (for testing)
   */
  reset() {
    this.mode = 'welcome';
    this.currentModuleId = null;
    this.currentSegmentId = null;
    this.history = [];
    this.sessionStart = new Date();
    this.quickTourIndex = null;
    this.shouldExit = false;
  }
}

// Export class for instantiation
export default NavigationState;

// Also export for testing
export { NavigationState };
