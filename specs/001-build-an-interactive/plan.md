# Implementation Plan: Interactive NPX CLI - Meet Chan Meng

**Branch**: `001-build-an-interactive` | **Date**: 2025-10-02 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-build-an-interactive/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → Loaded: 28 functional requirements, 8 acceptance scenarios
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → All clarifications resolved in Session 2025-10-02
   → Project Type: Single (NPX CLI package)
   → Structure Decision: Standard Node.js package with bin entry
3. Fill Constitution Check section
   → Principle I (Authenticity): Content must be factually accurate
   → Principle III (User Time): <5s startup, no forced animations
   → Principle IV (Technical Simplicity): Max 10 dependencies
   → Principle V (Accessibility): Terminal compatibility required
4. Evaluate Constitution Check section
   → No violations detected
   → Update Progress Tracking: Initial Constitution Check ✓
5. Execute Phase 0 → research.md
   → Research CLI frameworks, state persistence, ASCII art
6. Execute Phase 1 → data-model.md, quickstart.md, contracts/
   → Define content modules, user preferences, navigation state
7. Re-evaluate Constitution Check section
   → Verified: 7 core dependencies (within 10 limit)
   → Update Progress Tracking: Post-Design Constitution Check ✓
8. Plan Phase 2 → Task generation approach documented below
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary

Build an NPX-executable CLI application (`chan-meng`) that introduces Chan Meng through an interactive, story-driven terminal experience. The application will showcase Chan's extreme minimalist lifestyle journey with keyboard navigation, dual experience modes (Quick Tour ~2-3min / Full Experience), ASCII art enhancements, and session progress tracking. Technical approach uses Node.js with battle-tested CLI libraries (inquirer, chalk, boxen) to create an engaging yet minimalist interface that embodies Chan's philosophy of directness and authenticity.

## Technical Context

**Language/Version**: Node.js 18+ / JavaScript (ES2022)
**Primary Dependencies**:
- `inquirer` - Interactive prompts
- `chalk` - Terminal colors
- `boxen` - Styled boxes
- `figlet` - ASCII art text
- `conf` - Configuration/preferences storage
- `ora` - Loading spinners (minimal use)
- `gradient-string` - Text gradients (optional enhancement)

**Storage**: Local file system (`~/.chan-meng-cli/`) for user preferences and progress
**Testing**: Jest for unit tests, manual terminal testing for UX validation
**Target Platform**: Cross-platform (macOS, Linux, Windows/WSL) via Node.js
**Project Type**: Single NPX package with bin entry point
**Performance Goals**:
- Startup time < 5 seconds (first run with npx cache)
- Instant text display (no typewriter effects)
- Menu navigation < 100ms response time

**Constraints**:
- Max 10 npm dependencies (Constitution Principle IV)
- Package size < 5MB
- No external API calls (offline-first)
- Works without internet after first npx download

**Scale/Scope**:
- ~4-6 content modules
- ~15-20 story segments
- Single user (local CLI)
- Estimated ~2000-3000 lines of code

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Authenticity First
- ✅ **Compliance**: All content sourced from Chan's provided biography
- ✅ **Enforcement**: Content will be stored as data files, reviewed for accuracy before implementation
- ✅ **Validation**: Manual review checklist includes "factually accurate" verification

### Principle II: User Experience - Engaging & Memorable
- ✅ **Compliance**: Interactive menus, ASCII art, thoughtful content organization
- ✅ **Implementation**: Story-driven narrative flow, progressive disclosure
- ✅ **Success Metric**: User completes at least one module (tracked in acceptance testing)

### Principle III: Respect for User's Time (NON-NEGOTIABLE)
- ✅ **Compliance**:
  - Quick Tour mode (~2-3 min) for rapid overview
  - Can exit anytime (Ctrl+C, dedicated quit option)
  - No typewriter effects (instant text display)
  - Resume functionality saves progress
- ✅ **Performance**: < 5 second startup (FR-002)
- ✅ **Navigation**: Clear time estimates for each module

### Principle IV: Technical Simplicity
- ✅ **Dependencies**: 7 core packages (< 10 limit)
  1. inquirer (prompts)
  2. chalk (colors)
  3. boxen (boxes)
  4. figlet (ASCII art)
  5. conf (storage)
  6. ora (spinners)
  7. gradient-string (optional)
- ✅ **Startup**: Lazy-load heavy modules (figlet) to meet < 5s target
- ✅ **Offline**: No external APIs, all content bundled

### Principle V: Accessibility & Inclusivity
- ✅ **Terminal Compatibility**: Test on iTerm, Terminal.app, Windows Terminal, GNOME Terminal
- ✅ **Graceful Degradation**: Detect terminal capabilities, fallback to plain ASCII
- ✅ **Keyboard Only**: No mouse required, arrow keys + Enter navigation
- ✅ **Color Fallback**: Check `chalk.supportsColor`, use plain text if needed

### Post-Design Verification
- ✅ Dependency count: 7 (within limit)
- ✅ Estimated package size: ~3MB (within 5MB limit)
- ✅ No complexity deviations requiring justification

## Project Structure

### Documentation (this feature)
```
specs/001-build-an-interactive/
├── plan.md              # This file (/plan command output)
├── spec.md              # Feature specification (input)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
│   └── content-schema.json
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
chan-meng/
├── package.json         # NPM package definition, bin entry
├── index.js             # Main entry point for npx
├── src/
│   ├── cli.js           # CLI orchestration & main menu
│   ├── modules/
│   │   ├── welcome.js       # Welcome screen & mode selection
│   │   ├── journey.js       # "The Journey" module
│   │   ├── philosophy.js    # "Philosophy" module
│   │   ├── practical.js     # "Practical Minimalism" module
│   │   ├── connect.js       # "Connect" module
│   │   └── quickTour.js     # Quick Tour curated flow
│   ├── content/
│   │   ├── stories.js       # Chan's life story segments
│   │   ├── quotes.js        # Minimalist philosophy quotes
│   │   └── ascii-art.js     # ASCII art assets
│   ├── services/
│   │   ├── navigation.js    # Navigation state management
│   │   ├── progress.js      # Progress tracking & persistence
│   │   └── display.js       # Terminal output utilities
│   └── utils/
│       ├── terminal.js      # Terminal capability detection
│       └── config.js        # Configuration management
├── tests/
│   ├── unit/
│   │   ├── navigation.test.js
│   │   ├── progress.test.js
│   │   └── display.test.js
│   └── integration/
│       └── user-flows.test.js
├── README.md            # NPM package documentation
└── .gitignore
```

**Structure Decision**: Standard Node.js package optimized for NPX distribution. The `bin` entry in package.json points to `index.js` which initializes the CLI. Source code is modularized by feature (modules/) and responsibility (services/utils/). Content is separated into data files for easy updates without code changes. This structure supports rapid development while maintaining clear separation of concerns aligned with minimalist principles.

## Phase 0: Outline & Research

### Research Topics

1. **CLI Framework Selection**
   - **Decision**: Inquirer.js for interactive prompts
   - **Rationale**: Most mature, battle-tested, excellent keyboard navigation
   - **Alternatives**: Prompts (less features), enquirer (similar but less adoption)

2. **State Persistence Strategy**
   - **Decision**: `conf` package for JSON config storage
   - **Rationale**: Simple, cross-platform, handles `~/.chan-meng-cli/` automatically
   - **Alternatives**: Manual fs.writeFile (reinventing wheel), lowdb (overkill)

3. **ASCII Art Generation**
   - **Decision**: `figlet` for title text, hand-crafted art for icons
   - **Rationale**: figlet is standard, predictable; custom art for personality
   - **Alternatives**: asciify, text2ascii (less flexible)

4. **Terminal Capability Detection**
   - **Decision**: `chalk.supportsColor` + process.stdout checks
   - **Rationale**: chalk already used, provides reliable detection
   - **Implementation**: Fallback gracefully to plain ASCII if no color support

5. **NPX Best Practices**
   - **Decision**: Shebang `#!/usr/bin/env node`, bin entry in package.json
   - **Rationale**: Standard npx pattern, works cross-platform
   - **package.json config**:
     ```json
     {
       "name": "chan-meng",
       "bin": {
         "chan-meng": "./index.js"
       },
       "preferGlobal": false
     }
     ```

6. **Performance Optimization**
   - **Decision**: Lazy-load heavy modules (figlet, gradient-string)
   - **Rationale**: Meets < 5s startup requirement
   - **Implementation**: Dynamic imports only when needed

7. **Content Organization**
   - **Decision**: Structured JSON/JS objects for stories and segments
   - **Rationale**: Easy to update, validate, and version control
   - **Format**:
     ```javascript
     {
       moduleId: 'journey',
       segments: [
         { id: 1, title: '...', content: '...', estimatedTime: 60 }
       ]
     }
     ```

**Output**: [research.md](./research.md) with all decisions documented

## Phase 1: Design & Contracts

### Data Model

**Entities** (detailed in `data-model.md`):
1. **ContentModule**: Represents explorable sections (Journey, Philosophy, etc.)
2. **StorySegment**: Individual narrative pieces within modules
3. **UserPreferences**: Persisted user state and settings
4. **NavigationState**: Runtime tracking of current location

### Contracts

**Content Schema** (`contracts/content-schema.json`):
- Defines structure for all content modules
- Validates segment format, time estimates, navigation metadata
- Used to validate content files before bundling

**User Preferences Schema** (`contracts/preferences-schema.json`):
- Defines stored user data structure
- Tracks visited modules, last position, display settings

### Quickstart Experience

**Goal**: User runs `npx chan-meng` → sees welcome → chooses Quick Tour → completes 2-3 min experience → exits inspired

**Validation** (detailed in `quickstart.md`):
1. Install: `npx chan-meng@latest`
2. Verify: Starts in < 5 seconds
3. Navigate: Choose Quick Tour
4. Complete: See curated highlights
5. Exit: Graceful quit with closing message

### Agent-Specific Context

**Action**: Run `.specify/scripts/bash/update-agent-context.sh claude` to update CLAUDE.md with:
- Tech stack: Node.js 18+, Inquirer, Chalk, Boxen, Figlet
- Project structure: Single NPX package
- Recent changes: Initial planning phase

**Output**: `data-model.md`, `contracts/*.json`, `quickstart.md`, updated `CLAUDE.md`

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
1. Load `.specify/templates/tasks-template.md` as base
2. Generate tasks from Phase 1 design docs:
   - Content schema → content data files creation
   - Each module → module implementation task
   - User preferences → persistence service task
   - Navigation → state management task
3. Order by TDD principles:
   - Write tests first [T]
   - Implement to pass tests [I]
   - Mark parallel tasks [P]

**Task Categories**:
- **Foundation** [P]: Package setup, dependencies, project structure
- **Content** [P]: Story data, quotes, ASCII art files
- **Services**: Navigation, progress tracking, display utilities
- **Modules**: Welcome, Journey, Philosophy, Practical, Connect, Quick Tour
- **Integration**: Main CLI orchestration, end-to-end user flows
- **Polish**: Terminal compatibility testing, performance validation

**Ordering Strategy**:
1. Foundation tasks (can run in parallel)
2. Service layer (navigation depends on progress, etc.)
3. Content modules (mostly parallel after services)
4. Integration & testing
5. Polish & optimization

**Estimated Output**: ~25-30 tasks in dependency order with [P] markers

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)
**Phase 4**: Implementation (execute tasks.md following TDD and constitutional principles)
**Phase 5**: Validation (jest tests, manual terminal testing, quickstart validation, NPM publish dry-run)

## Complexity Tracking
*Fill ONLY if Constitution Check has violations that must be justified*

**No deviations**. All constitutional requirements met within constraints.

## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS (7 deps < 10 limit)
- [x] All NEEDS CLARIFICATION resolved (5 clarifications in spec)
- [x] Complexity deviations documented (none required)

---
*Based on Constitution v1.0.0 - See `.specify/memory/constitution.md`*
