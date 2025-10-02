# Data Model: Interactive NPX CLI - Meet Chan Meng

**Date**: 2025-10-02
**Phase**: 1 - Design & Contracts
**Status**: Complete

## Overview

This document defines the data structures used in the chan-meng CLI application. All entities are designed to support the functional requirements while adhering to constitutional principles of simplicity and clarity.

---

## Entity Definitions

### 1. ContentModule

Represents a discrete explorable section of Chan's story.

#### Structure

```javascript
{
  id: string,                    // Unique identifier (e.g., 'journey', 'philosophy')
  title: string,                  // Display name (e.g., 'The Journey')
  description: string,            // Brief overview for menu
  estimatedTime: number,          // Total time in seconds
  segments: StorySegment[],       // Array of narrative segments
  icon: string,                   // ASCII icon for menu display
  order: number                   // Display order in menu
}
```

#### Validation Rules

- `id`: Must be lowercase, alphanumeric + hyphens only, unique across all modules
- `title`: 1-50 characters
- `description`: 1-200 characters
- `estimatedTime`: Positive integer, sum of all segment times
- `segments`: Non-empty array
- `icon`: Single-line ASCII, max 10 characters wide
- `order`: Positive integer, determines menu position

#### Example

```javascript
{
  id: 'journey',
  title: 'The Journey',
  description: 'Chan\'s path from family constraints to minimalist freedom',
  estimatedTime: 420, // 7 minutes
  segments: [ /* ... */ ],
  icon: '🗺️',
  order: 1
}
```

#### Relationships

- **Has Many**: StorySegment
- **Referenced By**: NavigationState (currentModuleId)
- **Referenced By**: UserPreferences (visitedModules[])

---

### 2. StorySegment

Individual narrative piece within a module.

#### Structure

```javascript
{
  id: number,                     // Sequential ID within module (1, 2, 3...)
  moduleId: string,               // Parent module reference
  title: string,                  // Segment title
  content: string,                // Main narrative text
  estimatedTime: number,          // Reading time in seconds
  type: 'narrative' | 'quote' | 'list' | 'image-description',
  metadata: {
    year?: number,                // Timeline reference
    location?: string,            // Geographic context
    theme?: string[],             // Tags like ['minimalism', 'family']
    quote?: string,               // Pull quote if type === 'quote'
    asciiArt?: string            // Optional ASCII illustration
  }
}
```

#### Validation Rules

- `id`: Positive integer, unique within module
- `moduleId`: Must reference existing ContentModule.id
- `title`: 1-100 characters
- `content`: 1-5000 characters
- `estimatedTime`: Positive integer (calculated as `content.length / 15` words/sec)
- `type`: One of defined enum values
- `metadata.year`: 1990-2030 (Chan's lifetime)
- `metadata.location`: Valid city/country name
- `metadata.theme`: Array of predefined tags

#### Example

```javascript
{
  id: 1,
  moduleId: 'journey',
  title: 'Breaking Free (2018)',
  content: 'At 26, Chan finally moved out after her mother said...',
  estimatedTime: 90,
  type: 'narrative',
  metadata: {
    year: 2018,
    location: 'Guilin, China',
    theme: ['independence', 'family-separation'],
    quote: '"You卖都卖不出去" - These words changed everything.'
  }
}
```

#### Relationships

- **Belongs To**: ContentModule
- **Referenced By**: NavigationState (currentSegmentId)

---

### 3. UserPreferences

Persisted user state and settings (stored via `conf` package).

#### Structure

```javascript
{
  version: number,                // Schema version for migrations
  firstRunCompleted: boolean,     // Has user finished welcome flow?
  completedQuickTour: boolean,    // Completed quick tour mode?
  visitedModules: string[],       // Array of moduleIds
  lastSession: {
    timestamp: string,            // ISO 8601 datetime
    mode: 'quick-tour' | 'full-experience',
    moduleId: string | null,      // Last visited module
    segmentId: number | null      // Last viewed segment
  },
  preferences: {
    colorEnabled: boolean | 'auto', // User color preference
    showTimeEstimates: boolean      // Show reading times
  },
  stats: {
    totalSessions: number,
    totalTimeSpent: number,       // Seconds
    modulesCompleted: string[]     // Fully viewed modules
  }
}
```

#### Validation Rules

- `version`: Positive integer (current: 1)
- `visitedModules`: Array of valid moduleIds
- `lastSession.timestamp`: Valid ISO 8601 string
- `lastSession.mode`: One of enum values
- `lastSession.moduleId`: Must be valid moduleId or null
- `lastSession.segmentId`: Must exist in referenced module or null
- `preferences.colorEnabled`: boolean or 'auto'
- `stats.totalTimeSpent`: Non-negative integer

#### Default Values

```javascript
{
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
}
```

#### Storage Location

- **macOS**: `~/Library/Preferences/chan-meng-cli/config.json`
- **Linux**: `~/.config/chan-meng-cli/config.json`
- **Windows**: `%APPDATA%\chan-meng-cli\config.json`

#### Relationships

- **References**: ContentModule (via visitedModules, lastSession.moduleId)
- **Referenced By**: Navigation logic, Welcome screen

---

### 4. NavigationState

Runtime tracking of current user position (in-memory only, not persisted).

#### Structure

```javascript
{
  mode: 'welcome' | 'quick-tour' | 'full-experience' | 'exiting',
  currentModuleId: string | null,
  currentSegmentId: number | null,
  history: NavigationHistoryItem[],
  sessionStart: Date,
  quickTourIndex: number | null   // Current position in quick tour flow
}

// NavigationHistoryItem
{
  moduleId: string,
  segmentId: number,
  timestamp: Date
}
```

#### Validation Rules

- `mode`: One of enum values
- `currentModuleId`: Must be valid moduleId or null
- `currentSegmentId`: Must exist in current module or null
- `history`: Array, max 100 items (prevent memory leak)
- `sessionStart`: Date object
- `quickTourIndex`: 0-based index into quickTourFlow array

#### Lifecycle

1. **Initialization**: Created when CLI starts
2. **Updates**: Modified during navigation actions
3. **Persistence**: On exit, save `lastSession` to UserPreferences
4. **Cleanup**: Destroyed on exit

#### Navigation Actions

```javascript
// Navigation service methods that update this state
navigationState.goToModule(moduleId)
navigationState.goToSegment(moduleId, segmentId)
navigationState.goBack()
navigationState.exitToMenu()
navigationState.quit()
```

#### Relationships

- **References**: ContentModule (currentModuleId), StorySegment (currentSegmentId)
- **Used By**: CLI orchestration, Display service

---

## Quick Tour Flow

Special sequence for Quick Tour mode.

### QuickTourItem

```javascript
{
  moduleId: string,
  segmentIds: number[],          // Curated segments from this module
  transition: string             // Text between modules
}
```

### Quick Tour Sequence (2-3 minutes total)

```javascript
export const quickTourFlow = [
  {
    moduleId: 'journey',
    segmentIds: [1, 3],  // Early life, breaking free
    transition: 'From constraints to freedom, Chan discovered a philosophy...'
  },
  {
    moduleId: 'philosophy',
    segmentIds: [1, 2],  // Core beliefs, living in the present
    transition: 'Philosophy guides practice...'
  },
  {
    moduleId: 'practical',
    segmentIds: [1, 4],  // Foam mat living, social deletion
    transition: 'Chan\'s minimalism extends beyond objects...'
  },
  {
    moduleId: 'connect',
    segmentIds: [1],     // How to reach Chan
    transition: null     // End of tour
  }
];

// Estimated time: 45s + 60s + 45s + 30s = 180s (3 minutes)
```

---

## Data Flow Diagrams

### Application Startup

```
[User runs npx chan-meng]
        ↓
[Load UserPreferences from disk]
        ↓
[Initialize NavigationState]
        ↓
   firstRunCompleted?
        ↓
    No → [Show welcome, mode selection]
        ↓
   Yes → [Show "Welcome back" with resume option]
        ↓
[User chooses mode]
        ↓
    Quick Tour → [Load quickTourFlow, show first segment]
    Full Experience → [Show main menu with all modules]
        ↓
[User navigates, state updates in real-time]
        ↓
[On exit: Save lastSession to UserPreferences]
```

### Module Navigation

```
[User selects module from menu]
        ↓
[Load ContentModule by id]
        ↓
[Update NavigationState.currentModuleId]
        ↓
[Display module title + description]
        ↓
[Show first segment or resume from last position]
        ↓
[User reads, presses continue]
        ↓
[Load next StorySegment]
        ↓
[Update NavigationState.currentSegmentId]
        ↓
[Repeat until module complete]
        ↓
[Mark module as visited in UserPreferences]
        ↓
[Return to main menu or exit]
```

---

## Content Data Sources

All content modules are defined in `src/content/`:

```
src/content/
├── stories.js           # Main export: all modules
├── journey.js           # Journey module definition
├── philosophy.js        # Philosophy module
├── practical.js         # Practical minimalism
├── connect.js           # Contact info
├── quick-tour.js        # Quick tour flow
├── quotes.js            # Standalone quotes
└── ascii-art.js         # ASCII art assets
```

### Content Import Pattern

```javascript
// src/content/stories.js
import { journeyModule } from './journey.js';
import { philosophyModule } from './philosophy.js';
import { practicalModule } from './practical.js';
import { connectModule } from './connect.js';

export const allModules = [
  journeyModule,
  philosophyModule,
  practicalModule,
  connectModule
];

export { journeyModule, philosophyModule, practicalModule, connectModule };
```

---

## Schema Contracts

All data structures are validated against JSON Schema contracts in `contracts/`:

- `content-schema.json`: Validates ContentModule and StorySegment
- `preferences-schema.json`: Validates UserPreferences
- `navigation-schema.json`: Validates NavigationState (for testing)

See [contracts/](./contracts/) directory for full schema definitions.

---

## Data Integrity Guarantees

### Validation Checkpoints

1. **Build Time**: Validate all content modules against schema
2. **Runtime (Dev)**: Assert schema compliance when loading content
3. **User Data**: Conf package handles JSON validation automatically
4. **Migration**: Version field in UserPreferences enables future schema upgrades

### Error Handling

```javascript
// src/utils/validation.js
export function validateModule(module) {
  const errors = [];

  if (!module.id || !/^[a-z0-9-]+$/.test(module.id)) {
    errors.push('Invalid module ID');
  }

  const totalTime = module.segments.reduce((sum, s) => sum + s.estimatedTime, 0);
  if (totalTime !== module.estimatedTime) {
    errors.push('Module time != sum of segment times');
  }

  if (errors.length > 0) {
    throw new Error(`Module validation failed: ${errors.join(', ')}`);
  }

  return true;
}
```

---

## Performance Considerations

### Memory Footprint

- **ContentModules**: ~50KB total (all modules loaded)
- **UserPreferences**: ~2KB (JSON file)
- **NavigationState**: ~1KB (in-memory)
- **Total**: < 100KB data structures

### Lazy Loading

- ASCII art loaded on-demand via dynamic imports
- Figlet fonts loaded only when needed
- Full Experience modules loaded only when accessed

---

## Summary

This data model supports all functional requirements:

- ✅ **FR-003**: Main menu structure (ContentModule.order)
- ✅ **FR-006-008**: Module content (StorySegment)
- ✅ **FR-024-025**: Progress tracking (UserPreferences)
- ✅ **FR-026-028**: Quick Tour mode (QuickTourItem[])
- ✅ **FR-011**: Progressive disclosure (segment-based navigation)

**Constitutional Alignment**:
- ✅ Principle I: Content structure enforces review process
- ✅ Principle III: Time estimates built into data model
- ✅ Principle IV: Simple JSON structures, minimal abstraction

**Phase 1 Status**: Design complete, ready for contract generation ✅
