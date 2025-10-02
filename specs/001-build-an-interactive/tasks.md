# Tasks: Interactive NPX CLI - Meet Chan Meng

**Input**: Design documents from `/specs/001-build-an-interactive/`
**Prerequisites**: plan.md ✓, research.md ✓, data-model.md ✓, contracts/ ✓, quickstart.md ✓

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → Found: Node.js 18+, 7 dependencies, NPX package structure
   → Tech stack: inquirer, chalk, boxen, figlet, conf, ora, gradient-string
2. Load optional design documents:
   → data-model.md: 4 entities (ContentModule, StorySegment, UserPreferences, NavigationState)
   → contracts/: content-schema.json, preferences-schema.json
   → research.md: 9 technical decisions documented
   → quickstart.md: User flow validation scenarios
3. Generate tasks by category:
   → Setup: npm project, dependencies, structure
   → Content: Story data files for all modules
   → Tests: Schema validation, unit tests, integration tests
   → Core: Services (navigation, progress, display), Utils (terminal, config)
   → Modules: welcome, journey, philosophy, practical, connect, quickTour
   → Integration: CLI orchestration, main entry point
   → Polish: Performance validation, manual testing, documentation
4. Apply task rules:
   → Content files = [P] (different files)
   → Module files = [P] (independent modules)
   → Service files = sequential (may share dependencies)
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001-T029)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   → All schemas have validation? ✓
   → All entities have models? ✓
   → All modules implemented? ✓
9. Return: SUCCESS (29 tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
Based on plan.md structure (single project):
- Source code: `src/` at repository root
- Tests: `tests/` at repository root
- Content: `src/content/`
- Modules: `src/modules/`
- Services: `src/services/`
- Utils: `src/utils/`

---

## Phase 3.1: Setup & Foundation

- [x] **T001** [P] Create Node.js project structure
  - Create `package.json` with NPX bin configuration
  - Set `"type": "module"` for ES modules
  - Configure `"engines": { "node": ">=18.0.0" }`
  - Add `"bin": { "chan-meng": "./index.js" }`
  - Create directory structure: `src/`, `tests/`, `src/modules/`, `src/services/`, `src/utils/`, `src/content/`

- [x] **T002** [P] Install and configure dependencies
  - Install production dependencies: `inquirer@^9.0.0`, `chalk@^5.0.0`, `boxen@^7.0.0`, `figlet@^1.7.0`, `conf@^11.0.0`, `ora@^7.0.0`, `gradient-string@^2.0.0`
  - Install dev dependencies: `jest`, `ajv` (for schema validation)
  - Configure package.json scripts: `"test"`, `"test:watch"`, `"validate-content"`

- [x] **T003** [P] Configure Jest for ES modules
  - Create `jest.config.js` with `testEnvironment: "node"`
  - Add `NODE_OPTIONS=--experimental-vm-modules` to test script
  - Configure coverage thresholds (80% lines, 70% branches)
  - Add `.gitignore` entries

- [x] **T004** [P] Create entry point with shebang
  - Create `index.js` with `#!/usr/bin/env node` shebang
  - Add basic error handling and CLI initialization
  - Import and call `startCLI()` from `src/cli.js`
  - Make file executable

---

## Phase 3.2: Content Data Files (Parallel Creation)

**Note**: These are static data files, can all be created in parallel

- [x] **T005** [P] Create journey module content in `src/content/journey.js`
  - Define `journeyModule` object with id, title, description, estimatedTime
  - Create 4-5 segments covering: early life, 2018 breakaway, evolution (Guilin → Nanning), New Zealand
  - Include metadata: years, locations, themes
  - Add authentic quotes from Chan's biography
  - Validate against `contracts/content-schema.json`

- [x] **T006** [P] Create philosophy module content in `src/content/philosophy.js`
  - Define `philosophyModule` with core minimalist beliefs
  - Create 3-4 segments: "此时此刻没用就应该扔掉", present-moment focus, relationships as disposable, self-reliance
  - Include pull quotes and thematic tags
  - Validate against schema

- [x] **T007** [P] Create practical minimalism content in `src/content/practical.js`
  - Define `practicalModule` with concrete examples
  - Create 4-5 segments: belongings in one backpack, foam mat sleeping, social contact deletion, shaved head, city walk lifestyle with fishing vest
  - Add vivid descriptions and before/after comparisons
  - Validate against schema

- [x] **T008** [P] Create connect module content in `src/content/connect.js`
  - Define `connectModule` with contact information
  - Single segment with email, GitHub, LinkedIn, other professional links
  - Format for terminal display readability
  - Validate against schema

- [x] **T009** [P] Create Quick Tour flow in `src/content/quick-tour.js`
  - Define `quickTourFlow` array with curated segments
  - Select 1-2 segments from each module (total ~3 minutes)
  - Add transition text between modules
  - Ensure total estimated time is 180 seconds

- [x] **T010** [P] Create main content export in `src/content/stories.js`
  - Import all module definitions
  - Export `allModules` array in display order
  - Export individual modules for direct access
  - Add content validation utility

- [x] **T011** [P] Create ASCII art assets in `src/content/ascii-art.js`
  - Create welcome screen ASCII art for "Chan Meng" title
  - Create module icons (if not using emoji)
  - Create decorative elements for boxes
  - Export as named constants

---

## Phase 3.3: Utilities Layer (Foundation for Services)

- [x] **T012** Create terminal capability detection in `src/utils/terminal.js`
  - Implement `detectTerminalCapabilities()` using `chalk.supportsColor` and `process.stdout`
  - Check terminal dimensions (min 80x24)
  - Detect Unicode/emoji support
  - Return capabilities object: `{ supportsColor, supportsUnicode, width, height }`
  - Export `getTerminalCapabilities()` for services

- [x] **T013** Create configuration manager in `src/utils/config.js`
  - Initialize `Conf` instance with project name and schema from `contracts/preferences-schema.json`
  - Implement `getPreferences()`, `setPreferences()`, `updateLastSession()`
  - Export default preferences object
  - Handle schema migrations (version 1)

---

## Phase 3.4: Services Layer (Core Logic)

- [x] **T014** Create progress tracking service in `src/services/progress.js`
  - Import config manager from `src/utils/config.js`
  - Implement `saveProgress(moduleId, segmentId, mode)`
  - Implement `loadProgress()` → returns UserPreferences
  - Implement `markModuleVisited(moduleId)`
  - Implement `markModuleCompleted(moduleId)`
  - Track session stats (totalSessions, totalTimeSpent)
  - Export progress service singleton

- [x] **T015** Create navigation state manager in `src/services/navigation.js`
  - Implement `NavigationState` class with mode, currentModuleId, currentSegmentId, history
  - Methods: `goToModule(id)`, `goToSegment(moduleId, segmentId)`, `goBack()`, `exitToMenu()`, `quit()`
  - Maintain history array (max 100 items)
  - Track quick tour index for Quick Tour mode
  - Export navigation service singleton

- [x] **T016** Create display utilities in `src/services/display.js`
  - Import chalk, boxen, figlet (lazy loaded)
  - Implement `displayWelcome()` with ASCII art and gradient
  - Implement `displayMenu(modules, visitedModules)` with boxen
  - Implement `displaySegment(segment, capabilities)` with proper formatting
  - Implement `displayClosingMessage(mode, stats)`
  - Handle graceful degradation for limited terminals

---

## Phase 3.5: Content Modules (Can Run in Parallel)

- [x] **T017** [P] Create welcome module in `src/modules/welcome.js`
  - Import inquirer, display service, config manager
  - Implement `showWelcome(isReturningUser, preferences)`
  - Display welcome screen with mode selection: Quick Tour, Full Experience, Exit
  - For returning users: show "Welcome back" with resume option
  - Return selected mode: 'quick-tour', 'full-experience', 'exit'
  - Export `welcome()` function

- [x] **T018** [P] Create Journey module in `src/modules/journey.js`
  - Import journey content, navigation service, display service
  - Implement `showJourney(navigationState)`
  - Display module intro, iterate through segments
  - Handle user input: continue, back to menu, quit
  - Update navigation state on each action
  - Export `journey()` function

- [x] **T019** [P] Create Philosophy module in `src/modules/philosophy.js`
  - Import philosophy content, navigation service, display service
  - Implement `showPhilosophy(navigationState)`
  - Display beliefs and quotes with proper formatting
  - Handle segment navigation
  - Export `philosophy()` function

- [x] **T020** [P] Create Practical Minimalism module in `src/modules/practical.js`
  - Import practical content, navigation service, display service
  - Implement `showPractical(navigationState)`
  - Display concrete examples with visual enhancements
  - Handle navigation and user choices
  - Export `practical()` function

- [x] **T021** [P] Create Connect module in `src/modules/connect.js`
  - Import connect content, display service
  - Implement `showConnect()`
  - Display contact info in boxen with proper formatting
  - Show email, GitHub, LinkedIn, other links
  - Export `connect()` function

- [x] **T022** Create Quick Tour flow in `src/modules/quickTour.js`
  - Import quick tour flow, all content modules, display service
  - Implement `showQuickTour(navigationState)`
  - Load curated segments from quickTourFlow
  - Display with transitions between modules
  - Track completion, mark completedQuickTour in preferences
  - Offer switch to Full Experience at end
  - Export `quickTour()` function

---

## Phase 3.6: CLI Orchestration & Integration

- [x] **T023** Create main menu logic in `src/cli.js`
  - Import all modules, services, config manager
  - Implement `showMainMenu(navigationState, preferences)`
  - Display all modules with icons, descriptions, time estimates
  - Mark visited modules with checkmark
  - Handle module selection and route to appropriate module function
  - Implement back navigation and exit handling

- [x] **T024** Create CLI startup flow in `src/cli.js`
  - Implement `startCLI()` as main entry point
  - Load user preferences, detect if first run
  - Initialize navigation state
  - Show welcome screen (first-time or returning user)
  - Route to Quick Tour or Full Experience based on selection
  - Handle session cleanup on exit (save progress)
  - Export `startCLI()` function

---

## Phase 3.7: Testing & Validation

- [x] **T025** [P] Create content validation tests in `tests/unit/content-validation.test.js`
  - Import all content modules, schemas, ajv
  - Test each module against `content-schema.json`
  - Validate time estimates match segment sums
  - Verify all moduleIds are unique
  - Check segment ID sequences are correct
  - Run as part of npm test

- [x] **T026** [P] Create service unit tests in `tests/unit/services.test.js`
  - Test `progress.js`: save/load progress, mark visited, session stats
  - Test `navigation.js`: state transitions, history management, back navigation
  - Test `display.js` (basic): graceful degradation logic
  - Mock conf and inquirer where needed
  - Aim for 80%+ coverage

- [x] **T027** [P] Create integration test for Quick Tour flow in `tests/integration/quick-tour.test.js`
  - Mock user input (select Quick Tour)
  - Simulate complete Quick Tour flow
  - Verify all curated segments display
  - Check progress saved correctly
  - Validate completion time ~180 seconds
  - Test transition to Full Experience

- [x] **T028** [P] Create integration test for Full Experience in `tests/integration/full-experience.test.js`
  - Mock user selecting Full Experience
  - Navigate through main menu
  - Test module navigation (enter, back, quit)
  - Verify progress persistence
  - Test resume functionality on second run
  - Validate visited modules tracking

---

## Phase 3.8: Polish & Documentation

- [x] **T029** Manual validation following quickstart.md
  - Run `npx ./chan-meng-*.tgz` (after npm pack)
  - Complete all quickstart test scenarios (14 tests)
  - Verify performance: startup < 5s, navigation < 100ms
  - Test on multiple terminals: iTerm2, Terminal.app, GNOME Terminal
  - Test with NO_COLOR=1 (graceful degradation)
  - Test narrow terminal (80 cols)
  - Document any issues found
  - Update README.md with installation and usage instructions

---

## Dependencies

### Critical Path
```
T001, T002, T003, T004 (Setup - can run parallel)
    ↓
T012, T013 (Utils - foundation for services)
    ↓
T014, T015, T016 (Services - foundation for modules)
    ↓
T017 (Welcome - needed first)
    ↓
T023, T024 (CLI orchestration)
    ↓
T029 (Manual testing)
```

### Content Creation (Independent)
```
T005-T011 (All content files - fully parallel, no dependencies)
    ↓ (needed by modules)
T018-T022 (Modules use content - parallel after content ready)
```

### Testing (After Implementation)
```
T025 (Content validation - after T005-T011)
T026 (Service tests - after T014-T016)
T027 (Quick Tour test - after T022, T024)
T028 (Full Experience test - after T023, T024)
```

## Parallel Execution Examples

### Stage 1: Setup (All Parallel)
```bash
# Run T001-T004 together in separate terminal tabs or using Task agent
Task: "Create Node.js project structure"
Task: "Install and configure dependencies"
Task: "Configure Jest for ES modules"
Task: "Create entry point with shebang"
```

### Stage 2: Content Creation (All Parallel)
```bash
# Run T005-T011 together
Task: "Create journey module content in src/content/journey.js"
Task: "Create philosophy module content in src/content/philosophy.js"
Task: "Create practical minimalism content in src/content/practical.js"
Task: "Create connect module content in src/content/connect.js"
Task: "Create Quick Tour flow in src/content/quick-tour.js"
Task: "Create main content export in src/content/stories.js"
Task: "Create ASCII art assets in src/content/ascii-art.js"
```

### Stage 3: Modules (Parallel After Services)
```bash
# Run T017-T022 together (after T014-T016 complete)
Task: "Create welcome module in src/modules/welcome.js"
Task: "Create Journey module in src/modules/journey.js"
Task: "Create Philosophy module in src/modules/philosophy.js"
Task: "Create Practical Minimalism module in src/modules/practical.js"
Task: "Create Connect module in src/modules/connect.js"
# T022 runs separately as it depends on other modules
```

### Stage 4: Testing (Parallel)
```bash
# Run T025-T028 together (after implementation complete)
Task: "Create content validation tests in tests/unit/content-validation.test.js"
Task: "Create service unit tests in tests/unit/services.test.js"
Task: "Create integration test for Quick Tour flow in tests/integration/quick-tour.test.js"
Task: "Create integration test for Full Experience in tests/integration/full-experience.test.js"
```

## Notes

- **[P] tasks** = Different files, no shared dependencies - safe to run in parallel
- **Sequential tasks** = Same file or shared state - must run in order
- **Content authenticity** = All content in T005-T008 must be reviewed for accuracy against Chan's biography (Principle I)
- **Performance** = T029 validates < 5s startup requirement
- **Simplicity** = Keep to 7 dependencies as per constitutional limit
- **Test-first** = Content validation (T025) should ideally run before content creation, but content can serve as "spec"

## Task Generation Rules Applied

1. **From Contracts**:
   - `content-schema.json` → T025 validation test
   - `preferences-schema.json` → Used in T013 config manager

2. **From Data Model**:
   - ContentModule → T005-T008 content creation
   - StorySegment → Embedded in module content
   - UserPreferences → T013 config manager, T014 progress service
   - NavigationState → T015 navigation service

3. **From User Stories** (quickstart.md):
   - Quick Tour scenario → T022 module, T027 test
   - Full Experience scenario → T023 main menu, T028 test
   - Resume functionality → T024 startup flow

4. **Ordering Applied**:
   - Setup (T001-T004) → Utils (T012-T013) → Services (T014-T016) → Modules (T017-T022) → Integration (T023-T024) → Tests (T025-T028) → Polish (T029)

## Validation Checklist

- [x] All schemas have validation tests (T025 validates both schemas)
- [x] All entities have corresponding tasks (4 entities → T013-T015)
- [x] All modules implemented (6 modules: T017-T022)
- [x] Parallel tasks are truly independent (verified file paths)
- [x] Each task specifies exact file path
- [x] No [P] task modifies same file as another [P] task
- [x] Tests before or alongside implementation (T025-T028)
- [x] Constitutional compliance maintained (7 deps, authenticity checks)

---

**Total Tasks**: 29
**Estimated Duration**: 2-3 days for experienced developer
**Parallel Opportunities**: 16 tasks can run in parallel across 4 stages
**Critical Path**: ~13 sequential tasks

**Ready for /implement command**: This task breakdown is immediately executable by LLM or human developers.
