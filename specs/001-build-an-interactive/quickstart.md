# Quickstart Guide: chan-meng CLI

**Purpose**: Validate the complete user experience from installation to first interaction.
**Target Time**: < 5 minutes for complete Quick Tour experience
**Date**: 2025-10-02

---

## Prerequisites

- Node.js 18+ installed
- Terminal emulator (Terminal.app, iTerm2, GNOME Terminal, Windows Terminal, etc.)
- Internet connection (first run only)

### Verify Prerequisites

```bash
node --version
# Should output v18.0.0 or higher
```

---

## Installation & First Run

### Step 1: Run via NPX (Recommended)

```bash
npx chan-meng
```

**Expected Behavior** (First Run):
1. NPX downloads package from npm registry (~3MB)
2. Package extracts and caches in `~/.npm/_npx/`
3. CLI starts within **5 seconds** (FR-002 requirement)
4. Welcome screen appears

**Visual Check**:
- [ ] ASCII art title displays correctly
- [ ] Colors render (if terminal supports it)
- [ ] Box borders are clean (not broken characters)

### Step 2: Welcome Screen

**Expected Display**:
```
╔═══════════════════════════════════════════════════╗
║                                                   ║
║         Welcome to Chan Meng's World              ║
║                                                   ║
║   An interactive journey into minimalist living   ║
║                                                   ║
╚═══════════════════════════════════════════════════╝

How would you like to explore?

  › Quick Tour (~2-3 minutes)
    Full Experience (explore at your own pace)
    Exit
```

**Interaction**:
- [ ] Arrow keys move selection (↑ / ↓)
- [ ] Enter confirms selection
- [ ] Press `q` or Ctrl+C exits immediately

### Step 3: Choose Quick Tour

**Action**: Select "Quick Tour (~2-3 minutes)" and press Enter

**Expected Behavior**:
1. Brief transition message appears
2. First segment from "The Journey" module displays
3. Content appears **instantly** (no typewriter effect per FR-014)
4. Reading time estimate shown (e.g., "~1 min")

**Visual Check**:
- [ ] Text is readable and properly formatted
- [ ] No broken Unicode characters
- [ ] Clear navigation instructions at bottom

### Step 4: Navigate Quick Tour

**Expected Flow**:
```
The Journey (2 segments, ~90 seconds)
        ↓
Philosophy (2 segments, ~60 seconds)
        ↓
Practical Minimalism (2 segments, ~45 seconds)
        ↓
Connect (1 segment, ~30 seconds)
        ↓
Closing Message
```

**Actions to Test**:
- [ ] Press Enter to continue to next segment
- [ ] Press `m` to return to menu (at any point)
- [ ] Press `s` to skip to next module
- [ ] Press `q` to quit (graceful exit)

**Timing Validation**:
- Start timer when Quick Tour begins
- Complete entire Quick Tour
- Verify total time is **2-3 minutes** (FR-026 requirement)

### Step 5: Closing Message

**Expected Display** (after completing Quick Tour):
```
╔════════════════════════════════════════════════╗
║                                                ║
║  Thank you for exploring Chan's journey        ║
║                                                ║
║  "此时此刻没用，就应该扔掉"                        ║
║  "If not useful now, discard it."              ║
║                                                ║
║  Want to dive deeper?                          ║
║  Run 'npx chan-meng' again for Full Experience ║
║                                                ║
╚════════════════════════════════════════════════╝

What would you like to do?

  › Explore Full Experience
    Exit

(Your progress has been saved)
```

**Interaction**:
- [ ] Option to continue to Full Experience
- [ ] Option to exit
- [ ] Progress saved notification visible

---

## Returning User Experience

### Step 6: Second Run (Resume Functionality)

**Action**: Run `npx chan-meng` again

**Expected Behavior** (per FR-025):
1. CLI starts **faster** (~1-2 seconds, using NPX cache)
2. "Welcome back!" message displays
3. Resume option offered

**Expected Display**:
```
╔════════════════════════════════════════════════╗
║                                                ║
║           Welcome back! 👋                      ║
║                                                ║
║  Last session: 2 minutes ago                   ║
║  Progress: Completed Quick Tour ✓              ║
║                                                ║
╚════════════════════════════════════════════════╝

What would you like to do?

  › Continue exploring (Full Experience)
    Start fresh (reset progress)
    Exit
```

**Validation**:
- [ ] Recognizes returning user
- [ ] Shows last session info
- [ ] Offers resume OR restart
- [ ] Previously visited modules marked

---

## Full Experience Mode

### Step 7: Main Menu

**Action**: Select "Continue exploring (Full Experience)"

**Expected Display**:
```
╔═══════════════════════ MENU ═══════════════════════╗

  🗺️  The Journey (~7 min)
      Chan's path from family constraints to freedom

  💭  Philosophy (~5 min)
      Core beliefs and minimalist principles

  ✂️  Practical Minimalism (~6 min)
      Real-life practices: foam mats, social deletion

  📧  Connect (~1 min)
      How to reach Chan

  ❌  Exit

╚════════════════════════════════════════════════════╝

Select a module to explore (↑ ↓ Enter)
Previously visited: The Journey ✓
```

**Navigation Check**:
- [ ] All 4 modules visible
- [ ] Time estimates shown (per FR-015)
- [ ] Previously visited modules marked
- [ ] Exit option available
- [ ] Keyboard navigation works

### Step 8: Module Exploration

**Action**: Select "Philosophy" module

**Expected Behavior**:
1. Module title and description display
2. First segment loads
3. User can read at own pace
4. Progress through segments with Enter

**Module Navigation**:
- [ ] Segment counter shown (e.g., "2 / 4")
- [ ] "Next" option clear
- [ ] "Back to menu" option available (per FR-012)
- [ ] Can exit anytime

### Step 9: Contact Information (FR-009)

**Action**: Navigate to "Connect" module

**Expected Display**:
```
╔══════════════ CONNECT WITH CHAN ══════════════╗

  Want to learn more or reach out?

  📧  Email: [chan's email]

  💻  GitHub: github.com/[username]

  💼  LinkedIn: linkedin.com/in/[profile]

  [Any other professional links]

╚═══════════════════════════════════════════════╝
```

**Validation**:
- [ ] Email address displayed
- [ ] GitHub link present
- [ ] LinkedIn link present
- [ ] Links are readable and copyable

---

## Edge Cases & Error Handling

### Test 10: Terminal Compatibility

**Small Terminal Window**:
```bash
# Resize terminal to 60 columns x 20 rows
npx chan-meng
```

**Expected**:
- [ ] Detects small terminal
- [ ] Shows friendly message: "Please resize your terminal to at least 80x24"
- [ ] Gracefully waits or exits

**No Color Support**:
```bash
NO_COLOR=1 npx chan-meng
```

**Expected**:
- [ ] Falls back to plain ASCII
- [ ] Still readable and functional
- [ ] No broken escape codes

### Test 11: Offline Mode

**Action**: Disconnect internet, run `npx chan-meng` (using cached version)

**Expected**:
- [ ] Runs successfully from cache
- [ ] All content available (offline-first per FR-016)
- [ ] No error messages about network

### Test 12: Rapid Key Presses

**Action**: Rapidly press arrow keys and Enter during navigation

**Expected**:
- [ ] CLI remains stable
- [ ] Doesn't skip multiple segments
- [ ] Responds smoothly without lag

### Test 13: Ctrl+C Exit

**Action**: Press Ctrl+C at any point in the experience

**Expected**:
- [ ] Exits immediately
- [ ] Saves current session state
- [ ] No error stack traces
- [ ] Clean terminal state (cursor restored)

---

## Performance Validation

### Startup Time Benchmark

**Test**: Measure startup time for both first and subsequent runs

**Commands**:
```bash
# First run (cold start)
time npx chan-meng@latest --version

# Subsequent run (warm start)
time npx chan-meng --version
```

**Acceptance Criteria** (FR-002):
- [ ] First run: < 5 seconds (from npx command to welcome screen)
- [ ] Subsequent runs: < 2 seconds

**Note**: If no `--version` flag implemented, manually time from command to first screen.

### Navigation Response Time

**Test**: Measure time from key press to screen update

**Acceptance Criteria**:
- [ ] Menu navigation: < 100ms
- [ ] Segment loading: < 200ms
- [ ] No noticeable lag

---

## Data Persistence Validation

### Test 14: Config File Creation

**Action**: Run CLI once, then check config file exists

**Commands**:
```bash
npx chan-meng
# Select any option, navigate briefly, then exit

# Check config file
ls ~/.config/chan-meng-cli/config.json
# (macOS: ~/Library/Preferences/chan-meng-cli/config.json)
```

**Expected**:
- [ ] Config file exists
- [ ] Contains valid JSON
- [ ] `visitedModules` array populated
- [ ] `lastSession` timestamp set

**Validate Contents**:
```bash
cat ~/.config/chan-meng-cli/config.json | jq
```

**Expected Structure** (per preferences-schema.json):
```json
{
  "version": 1,
  "firstRunCompleted": true,
  "completedQuickTour": true,
  "visitedModules": ["journey", "philosophy"],
  "lastSession": {
    "timestamp": "2025-10-02T10:30:00.000Z",
    "mode": "full-experience",
    "moduleId": "philosophy",
    "segmentId": 2
  },
  "preferences": {
    "colorEnabled": "auto",
    "showTimeEstimates": true
  },
  "stats": {
    "totalSessions": 1,
    "totalTimeSpent": 180,
    "modulesCompleted": []
  }
}
```

---

## Acceptance Checklist

### Core Functionality
- [ ] **FR-001**: Runs via `npx chan-meng` with Node 18+
- [ ] **FR-002**: Starts within 5 seconds (first run)
- [ ] **FR-003**: Main menu displays all required modules
- [ ] **FR-004**: Keyboard-only navigation works
- [ ] **FR-005**: Can exit anytime (q, Ctrl+C)

### Content Modules
- [ ] **FR-006**: "The Journey" module loads with all segments
- [ ] **FR-007**: "Philosophy" module displays core beliefs
- [ ] **FR-008**: "Practical Minimalism" showcases real practices
- [ ] **FR-009**: "Connect" displays email, GitHub, LinkedIn

### User Experience
- [ ] **FR-011**: Progressive disclosure (can skip/explore)
- [ ] **FR-012**: "Back to menu" always available
- [ ] **FR-013**: Visual enhancements work (ASCII art, colors)
- [ ] **FR-014**: No typewriter effects (instant text)
- [ ] **FR-015**: Quick Tour mode exists (~2-3 min)

### Technical Quality
- [ ] **FR-016**: Works offline after first download
- [ ] **FR-017**: Compatible with multiple terminals
- [ ] **FR-018**: Handles terminal resize gracefully
- [ ] **FR-019**: All text in grammatically correct English
- [ ] **FR-020**: Shows helpful error if Node version too old

### Session Management
- [ ] **FR-024**: Persists user progress locally
- [ ] **FR-025**: Offers resume on subsequent runs
- [ ] **FR-026**: Quick Tour presents curated highlights
- [ ] **FR-027**: Full Experience allows unrestricted navigation
- [ ] **FR-028**: Can switch from Quick Tour to Full Experience

### Content Authenticity
- [ ] **FR-021**: Content factually accurate (manual review)
- [ ] **FR-022**: Tone matches Chan's communication style
- [ ] **FR-023**: No embellishment or fictionalization

---

## Troubleshooting

### Issue: CLI doesn't start

**Diagnosis**:
```bash
node --version
# Check Node 18+

which npx
# Verify npx available

npx chan-meng --verbose
# If verbose flag implemented
```

**Common Solutions**:
- Upgrade Node.js to 18+
- Clear npx cache: `rm -rf ~/.npm/_npx`
- Run with explicit version: `npx chan-meng@latest`

### Issue: Broken characters or boxes

**Diagnosis**: Terminal doesn't support Unicode

**Solution**:
- Use modern terminal (iTerm2, Windows Terminal, GNOME Terminal 3+)
- Or CLI should gracefully degrade (test with `NO_COLOR=1`)

### Issue: Slow startup (> 5 seconds)

**Diagnosis**:
```bash
# Time individual steps
time npx chan-meng
```

**Common Causes**:
- Slow internet (first download)
- Many npm packages installed globally (npx resolution)
- Heavy modules not lazy-loaded

---

## Success Criteria

**Quickstart passes if**:
1. ✅ User can install and run in < 1 minute
2. ✅ Quick Tour completes in 2-3 minutes as designed
3. ✅ All FR requirements testable via this guide pass
4. ✅ No critical errors or broken UX elements
5. ✅ Experience feels smooth, responsive, authentic

**Next Steps**: After quickstart validation passes, proceed to full implementation (/implement).

---

**Last Updated**: 2025-10-02
**Validation Status**: Ready for testing after implementation
