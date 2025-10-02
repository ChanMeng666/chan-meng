<!--
Sync Impact Report:
- Version change: [none] → 1.0.0 (initial constitution)
- Modified principles: Initial creation
- Added sections: Core Principles, Technical Constraints, User Experience Guidelines, Governance
- Templates requiring updates: ✅ All templates will reference this initial version
- Follow-up TODOs: None
-->

# Chan Meng CLI Constitution

## Core Principles

### I. Authenticity First

Every interaction, story, and piece of content must authentically represent Chan Meng's minimalist philosophy and life journey. No embellishment or fictional elements allowed. The CLI should feel like a genuine conversation with Chan, not a marketing brochure.

**Rationale**: Chan's story is powerful because it's real. Her extreme minimalism, from sleeping on foam mats to deleting social connections, resonates precisely because she actually lives this way. Authenticity builds trust and creates meaningful connections with visitors.

### II. User Experience - Engaging & Memorable

The interaction must be emotionally resonant and memorable. Users should leave feeling inspired, challenged, or curious about minimalism. The experience should balance entertainment with substance.

**Rationale**: A dry FAQ won't do justice to Chan's compelling story. The CLI must engage users through narrative, interactive elements, and thoughtful pacing. People should remember this interaction days later.

### III. Respect for User's Time (NON-NEGOTIABLE)

Users must be able to:
- Get a meaningful impression within 2 minutes
- Exit at any point without losing context
- Choose their own depth of exploration (quick overview vs. deep dive)
- Skip sections that don't interest them

**Rationale**: Chan practices minimalism in part by valuing "now" over unnecessary future concerns. Similarly, we must respect that user attention is precious. No forced lengthy animations or unskippable content.

### IV. Technical Simplicity

- Minimal dependencies (max 10 npm packages)
- Fast startup (< 2 seconds on average hardware)
- Works across platforms (macOS, Linux, WSL)
- No external API calls or data collection
- Offline-first design

**Rationale**: Chan fits her life into a backpack and a suitcase. This CLI should embody the same minimalist philosophy in its technical implementation. Bloated dependencies contradict the message.

### V. Accessibility & Inclusivity

- Works in various terminal environments (iTerm, Terminal.app, Windows Terminal, etc.)
- Readable color schemes that work on light/dark backgrounds
- Keyboard-only navigation
- Clear text fallbacks if Unicode/emoji don't render
- English language primary, but written for global audience

**Rationale**: Chan's minimalism isn't about privilege or gatekeeping - it's about intentional living. The CLI should be accessible to anyone with a terminal, regardless of their setup.

## Technical Constraints

### Technology Stack

- **Runtime**: Node.js 18+ (for npx compatibility)
- **Language**: JavaScript/TypeScript
- **CLI Framework**: Use battle-tested libraries (inquirer, chalk, boxen, etc.)
- **Package Manager**: npm (for maximum compatibility)
- **Testing**: Jest for unit tests
- **Distribution**: Published to npm registry as `chan-meng`

### Code Quality Standards

- All user-facing text must be grammatically correct English
- Code must be readable without comments (self-documenting)
- No hardcoded delays > 500ms without user consent
- Error messages must be helpful, not cryptic
- Maximum package size: 5MB

## User Experience Guidelines

### Content Organization

Content must be organized into discoverable modules:
1. **Introduction/Welcome** - First impression, sets tone
2. **The Journey** - Chan's minimalism evolution story
3. **Philosophy** - Core beliefs and principles
4. **Practical Minimalism** - Specific practices (foam mat, social deletion, etc.)
5. **Contact/Connect** - How to reach or follow Chan
6. **Easter Eggs** - Hidden surprises for curious explorers

### Interaction Patterns

- Use progressive disclosure (reveal complexity gradually)
- Provide clear navigation at all times
- Confirm before any destructive actions
- Save user preferences in local config (~/.chanmeng-cli)
- Allow "back" navigation in menus

### Tone & Voice

- Conversational but not overly casual
- Direct and honest (like Chan's communication style)
- Thought-provoking without being preachy
- Warm but not saccharine
- Reflects Chan's rationality and independence

## Governance

This constitution guides all development decisions. When in doubt, refer back to these principles.

### Amendment Process

1. Proposed changes must be documented with rationale
2. Changes must not contradict core minimalist philosophy
3. Version bump follows semantic versioning:
   - MAJOR: Backward-incompatible principle changes
   - MINOR: New principles or substantial expansions
   - PATCH: Clarifications, wording fixes

### Compliance Verification

All pull requests and implementations must verify:
- [ ] Authenticity: Content reflects real Chan, not invention
- [ ] User Respect: No forced waits or unskippable content
- [ ] Technical Simplicity: Dependencies justified, startup time measured
- [ ] Accessibility: Tested in multiple terminal environments
- [ ] Quality: No typos, clear error messages, intuitive navigation

### Conflict Resolution

When principles conflict (e.g., "engaging UX" vs. "technical simplicity"), prioritize in this order:
1. Authenticity First
2. Respect for User's Time
3. Technical Simplicity
4. User Experience
5. Accessibility

**Version**: 1.0.0 | **Ratified**: 2025-10-02 | **Last Amended**: 2025-10-02
