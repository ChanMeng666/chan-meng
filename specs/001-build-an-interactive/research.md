# Research: Interactive NPX CLI - Meet Chan Meng

**Date**: 2025-10-02
**Phase**: 0 - Outline & Research
**Status**: Complete

## Overview

This document captures research decisions made during the planning phase for the chan-meng NPX CLI application. All technical choices are evaluated against constitutional principles (particularly Principle IV: Technical Simplicity - max 10 dependencies).

---

## 1. CLI Framework Selection

### Decision

**Primary Framework**: [Inquirer.js](https://github.com/SBoudrias/Inquirer.js) v9+

### Rationale

- **Maturity**: 10+ years of development, 19k+ GitHub stars
- **Features**: List selection, keyboard navigation, validation, themes
- **Cross-platform**: Works reliably on macOS, Linux, Windows
- **TypeScript Support**: Type definitions available
- **Bundle Size**: ~500KB (acceptable for our 5MB limit)
- **Active Maintenance**: Regular updates, good documentation

### Alternatives Considered

| Library | Pros | Cons | Verdict |
|---------|------|------|---------|
| **prompts** | Smaller (~100KB), modern | Less battle-tested, fewer features | ❌ Insufficient features for complex menus |
| **enquirer** | Similar to Inquirer | Smaller community, less adoption | ❌ Higher risk, similar size |
| **blessed** | Full TUI framework | 2MB+, overkill for our needs | ❌ Violates simplicity principle |

### Implementation Notes

```javascript
import inquirer from 'inquirer';

const answer = await inquirer.prompt([
  {
    type: 'list',
    name: 'mode',
    message: 'How would you like to explore?',
    choices: ['Quick Tour (~2-3 min)', 'Full Experience', 'Exit']
  }
]);
```

---

## 2. Terminal Styling & Output

### Decisions

**Color**: [Chalk](https://github.com/chalk/chalk) v5+
**Boxes**: [Boxen](https://github.com/sindresorhus/boxen) v7+
**ASCII Art**: [Figlet](https://github.com/patorjk/figlet.js) v1.7+
**Gradients** (Optional): [gradient-string](https://github.com/bokub/gradient-string) v2+

### Rationale

- **Chalk**: Industry standard (100M+ weekly downloads), lightweight (~50KB), auto-detects terminal capabilities
- **Boxen**: Creates beautiful bordered boxes, integrates with chalk, small footprint (~30KB)
- **Figlet**: Classic ASCII art generation, predictable output, ~200KB with font
- **gradient-string**: Optional enhancement for special moments, ~20KB

**Total Styling Dependency Size**: ~300KB

### Terminal Capability Detection

```javascript
import chalk from 'chalk';

const supportsColor = chalk.supportsColor;
const useColor = supportsColor && process.stdout.isTTY;

// Graceful degradation
const title = useColor
  ? chalk.bold.cyan('Chan Meng')
  : 'CHAN MENG';
```

### Alternatives Considered

| Library | Pros | Cons | Verdict |
|---------|------|------|---------|
| **ansi-colors** | Lightweight | Less features than chalk | ❌ chalk is standard |
| **cli-color** | Feature-rich | Larger, less maintained | ❌ chalk preferred |
| **asciify** | ASCII art | Less flexible than figlet | ❌ figlet more predictable |

---

## 3. State Persistence Strategy

### Decision

**Configuration Storage**: [Conf](https://github.com/sindresorhus/conf) v11+

### Rationale

- **Cross-platform**: Automatically finds correct config directory
  - macOS: `~/Library/Preferences/chan-meng-cli`
  - Linux: `~/.config/chan-meng-cli` or `$XDG_CONFIG_HOME`
  - Windows: `%APPDATA%\chan-meng-cli`
- **Simple API**: `get()`, `set()`, `has()`, `clear()`
- **Atomic writes**: Safe concurrent access
- **JSON Schema**: Validates data structure
- **Size**: ~100KB
- **No native dependencies**: Pure JavaScript

### Implementation

```javascript
import Conf from 'conf';

const config = new Conf({
  projectName: 'chan-meng-cli',
  schema: {
    visitedModules: {
      type: 'array',
      items: { type: 'string' }
    },
    lastPosition: {
      type: 'object',
      properties: {
        moduleId: { type: 'string' },
        segmentId: { type: 'number' }
      }
    },
    preferences: {
      type: 'object',
      properties: {
        colorEnabled: { type: 'boolean' },
        completedQuickTour: { type: 'boolean' }
      }
    }
  }
});

// Usage
config.set('visitedModules', ['journey', 'philosophy']);
const visited = config.get('visitedModules');
```

### Alternatives Considered

| Approach | Pros | Cons | Verdict |
|----------|------|------|---------|
| **Manual fs.writeFile** | No dependency | Reinvent wheel, cross-platform issues | ❌ Violates "don't repeat yourself" |
| **lowdb** | JSON database | Overkill for simple config | ❌ Unnecessary complexity |
| **configstore** | Similar to conf | Deprecated | ❌ Not maintained |

---

## 4. Loading & Progress Indicators

### Decision

**Spinner**: [Ora](https://github.com/sindresorhus/ora) v7+ (minimal use)

### Rationale

- **Use Case**: Only for initial startup if > 2 seconds
- **Size**: ~50KB
- **Features**: Spinners, colors, text updates
- **Respect User Time**: Show progress, don't hide delays

### Usage Policy

```javascript
import ora from 'ora';

const spinner = ora('Loading Chan\'s story...').start();
// Only if startup exceeds 2 seconds
await loadHeavyAssets();
spinner.succeed('Ready!');
```

**Constitutional Alignment**: Principle III (Respect User Time) - inform user of delays, don't hide them.

### Alternatives Considered

| Library | Pros | Cons | Verdict |
|---------|------|------|---------|
| **cli-spinners** | Data only | Need to build spinner myself | ❌ Reinventing wheel |
| **progress** | Progress bars | Less elegant for spinner | ❌ Ora better for our use case |

---

## 5. NPX Distribution & Installation

### Decision

**Package Configuration**:
```json
{
  "name": "chan-meng",
  "version": "1.0.0",
  "type": "module",
  "bin": {
    "chan-meng": "./index.js"
  },
  "engines": {
    "node": ">=18.0.0"
  },
  "preferGlobal": false,
  "files": [
    "index.js",
    "src/",
    "README.md"
  ]
}
```

**Entry Point** (`index.js`):
```javascript
#!/usr/bin/env node
import { startCLI } from './src/cli.js';
startCLI().catch(console.error);
```

### Rationale

- **Shebang**: `#!/usr/bin/env node` makes file executable
- **ES Modules**: `"type": "module"` enables modern import/export
- **Node 18+**: Ensures top-level await, fetch API, good performance
- **preferGlobal: false**: Encourages npx usage over global install
- **files**: Whitelist what gets published (exclude tests, .specify/)

### NPX Behavior

1. **First run**: `npx chan-meng`
   - Downloads package from npm
   - Caches in `~/.npm/_npx/`
   - Runs `index.js`
   - ~3-5 second first launch (acceptable per FR-002)

2. **Subsequent runs**: `npx chan-meng`
   - Uses cached version
   - ~1-2 second startup
   - User preferences persisted via `conf`

### Testing Distribution

```bash
# Local testing before publish
npm pack
npx ./chan-meng-1.0.0.tgz

# Dry run publish
npm publish --dry-run
```

---

## 6. Performance Optimization Strategies

### Decision

**Lazy Loading**: Defer heavy imports until needed

### Rationale

Meets < 5 second startup requirement (FR-002) by loading only essentials upfront.

### Implementation

```javascript
// ❌ BAD: Load everything upfront
import figlet from 'figlet';
import gradientString from 'gradient-string';

// ✅ GOOD: Lazy load heavy modules
async function showWelcome() {
  const figlet = (await import('figlet')).default;
  const gradientString = (await import('gradient-string')).default;

  const title = figlet.textSync('Chan Meng');
  console.log(gradientString.pastel(title));
}
```

### Module Load Times (Estimated)

| Module | Size | Load Time | Strategy |
|--------|------|-----------|----------|
| inquirer | 500KB | ~100ms | ✅ Load upfront (needed for menu) |
| chalk | 50KB | ~20ms | ✅ Load upfront (used everywhere) |
| conf | 100KB | ~30ms | ✅ Load upfront (need preferences early) |
| figlet | 200KB | ~80ms | ⏰ Lazy load (only for welcome screen) |
| gradient-string | 20KB | ~10ms | ⏰ Lazy load (optional enhancement) |
| ora | 50KB | ~15ms | ⏰ Lazy load (only if startup slow) |
| boxen | 30KB | ~10ms | ✅ Load upfront (used in menus) |

**Total Upfront**: ~680KB, ~160ms load time
**Lazy Loaded**: ~270KB, ~105ms (only when needed)

### Startup Timeline

```
0ms:    npx command issued
0-500ms: NPX cache check / download (first run only)
500ms:   index.js execution starts
520ms:   Load inquirer, chalk, conf, boxen
680ms:   Check user preferences (returning user?)
700ms:   Display welcome screen (lazy load figlet if needed)
800ms:   Show mode selection menu
```

**Result**: ~1.3s startup for returning users, ~4s for first-time (within 5s limit)

---

## 7. Content Data Structure

### Decision

**Format**: JavaScript modules exporting structured objects

```javascript
// src/content/stories.js
export const journeyModule = {
  id: 'journey',
  title: 'The Journey',
  estimatedTime: 420, // 7 minutes
  segments: [
    {
      id: 1,
      title: 'Early Life: Constrained Family',
      content: `Chan's parents divorced when she was in high school...`,
      estimatedTime: 60,
      type: 'narrative'
    },
    {
      id: 2,
      title: 'Breaking Free (2018)',
      content: `At 26, after a painful breakup and her mother's harsh words...`,
      estimatedTime: 90,
      type: 'narrative',
      quote: '"You卖都卖不出去" - These words changed everything.'
    }
    // ... more segments
  ]
};
```

### Rationale

- **Version Control**: Easy to diff and track changes
- **Validation**: Can import and validate against schema during build
- **Performance**: Bundled with code, no runtime parsing
- **Maintainability**: Clear structure, easy to update content
- **Authenticity Check**: Content review happens in PR process

### Content Validation Script

```javascript
// scripts/validate-content.js
import { contentSchema } from '../specs/001-build-an-interactive/contracts/content-schema.json' assert { type: 'json' };
import Ajv from 'ajv';

const ajv = new Ajv();
const validate = ajv.compile(contentSchema);

import { journeyModule, philosophyModule, practicalModule } from '../src/content/stories.js';

const modules = [journeyModule, philosophyModule, practicalModule];
modules.forEach(module => {
  if (!validate(module)) {
    console.error(`Invalid content in ${module.id}:`, validate.errors);
    process.exit(1);
  }
});

console.log('✅ All content valid');
```

---

## 8. Testing Strategy

### Decision

**Unit Tests**: Jest
**Integration Tests**: Manual terminal testing
**Contract Tests**: JSON Schema validation (ajv)

### Jest Configuration

```json
{
  "scripts": {
    "test": "NODE_OPTIONS=--experimental-vm-modules jest",
    "test:watch": "npm test -- --watch",
    "test:coverage": "npm test -- --coverage"
  },
  "jest": {
    "testEnvironment": "node",
    "transform": {},
    "extensionsToTreatAsEsm": [".js"],
    "coverageThreshold": {
      "global": {
        "branches": 70,
        "functions": 80,
        "lines": 80
      }
    }
  }
}
```

### Test Coverage Goals

| Area | Target Coverage | Rationale |
|------|----------------|-----------|
| **Services** (navigation, progress, display) | 90%+ | Core logic, must be reliable |
| **Utils** (terminal, config) | 85%+ | Cross-platform concerns |
| **Modules** (journey, philosophy, etc.) | 60%+ | Mostly content display, less logic |
| **CLI orchestration** | Manual testing | Hard to automate interactive flows |

### Manual Testing Checklist

- [ ] macOS Terminal.app
- [ ] iTerm2
- [ ] Linux GNOME Terminal
- [ ] Windows Terminal (WSL)
- [ ] Test with colors disabled (`NO_COLOR=1 npx chan-meng`)
- [ ] Test with narrow terminal (80 cols)
- [ ] Test first-run experience
- [ ] Test returning user resume functionality

---

## 9. Dependency Audit

### Final Dependency List

| Package | Version | Size | Purpose | Constitutional Check |
|---------|---------|------|---------|---------------------|
| inquirer | ^9.0.0 | 500KB | Interactive prompts | ✅ Core requirement |
| chalk | ^5.0.0 | 50KB | Terminal colors | ✅ UX enhancement |
| boxen | ^7.0.0 | 30KB | Bordered boxes | ✅ UX enhancement |
| figlet | ^1.7.0 | 200KB | ASCII art | ✅ Engaging welcome |
| conf | ^11.0.0 | 100KB | State persistence | ✅ FR-024 requirement |
| ora | ^7.0.0 | 50KB | Loading indicators | ✅ Respect user time |
| gradient-string | ^2.0.0 | 20KB | Text gradients | ✅ Optional polish |

**Total Dependencies**: 7 (within 10 limit ✅)
**Total Size**: ~950KB
**Estimated Package Size**: ~3MB (with code and content) ✅

### Dev Dependencies (Not counted in limit)

- jest: Testing framework
- ajv: JSON schema validation
- eslint: Code linting
- prettier: Code formatting

---

## 10. Risk Mitigation

### Identified Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Startup > 5s** | Violates FR-002 | Lazy loading, performance monitoring, startup profiling |
| **Terminal incompatibility** | Poor UX on some platforms | Graceful degradation, capability detection, manual testing |
| **Content inaccuracy** | Violates Principle I | Content review checklist, PR approval required |
| **Dependency bloat** | Violates Principle IV | Strict 10-package limit, size monitoring |
| **NPM publish issues** | Can't distribute | Dry-run testing, version management |

### Performance Monitoring

```javascript
// src/utils/performance.js
export function measureStartup() {
  const start = performance.now();

  process.on('exit', () => {
    const duration = performance.now() - start;
    if (process.env.PERF_DEBUG) {
      console.error(`[PERF] Startup time: ${duration.toFixed(0)}ms`);
      if (duration > 5000) {
        console.warn('[PERF] Startup exceeded 5s target!');
      }
    }
  });
}
```

---

## Summary

All research decisions support the constitutional principles:

- ✅ **Principle I (Authenticity)**: Content structured for easy review
- ✅ **Principle II (Engaging UX)**: Rich terminal styling with figlet, chalk, boxen
- ✅ **Principle III (User Time)**: < 5s startup via lazy loading, no typewriter effects
- ✅ **Principle IV (Simplicity)**: 7 dependencies (< 10 limit), ~3MB package
- ✅ **Principle V (Accessibility)**: Terminal detection, graceful degradation

**Research Phase**: Complete ✅
**Next Phase**: Design & Contracts (data-model.md, contracts/, quickstart.md)
