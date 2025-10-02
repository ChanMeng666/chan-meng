# Chan Meng - Interactive CLI Experience

An NPX-executable CLI application that introduces Chan Meng through an interactive, story-driven terminal experience.

## Features

- 🚀 **Quick Tour**: A curated 3-minute introduction
- 📚 **Full Experience**: Explore all modules at your own pace
- 💾 **Progress Tracking**: Automatically saves your progress
- 🎨 **Beautiful Terminal UI**: ASCII art, colors, and boxed content
- ♿ **Accessible**: Graceful degradation for limited terminals

## Quick Start

### Run via NPX (Recommended)

```bash
npx chan-meng
```

### Run from Source

```bash
# Clone or download this repository
cd chan-meng

# Install dependencies
npm install

# Run the CLI
node index.js
```

## Requirements

- **Node.js**: 18.0.0 or higher
- **Terminal**: Minimum 80x24 characters
- **Recommended**: A terminal with color support and Unicode/emoji

## Modules

1. **🗺️  The Journey** - Chan's path from family constraints to minimalist freedom
2. **💭 Philosophy** - Core minimalist beliefs and principles
3. **✂️  Practical Minimalism** - Concrete examples of the lifestyle
4. **📧 Connect** - Get in touch with Chan

## Development

### Install Dependencies

```bash
npm install
```

### Run Tests

```bash
npm test
```

### Test Coverage

```bash
npm test -- --coverage
```

### Build for Distribution

```bash
npm pack
```

This creates a `.tgz` file that can be tested with:

```bash
npx ./chan-meng-1.0.0.tgz
```

## Project Structure

```
chan-meng/
├── index.js              # Entry point (with shebang)
├── src/
│   ├── cli.js           # Main CLI orchestration
│   ├── content/         # Story content modules
│   ├── modules/         # Interactive module handlers
│   ├── services/        # Core services (display, progress, navigation)
│   └── utils/           # Utilities (terminal detection, config)
├── tests/
│   ├── unit/            # Unit tests
│   └── integration/     # Integration tests
└── specs/               # Specification documents
```

## Configuration

User preferences and progress are stored in:
- **Linux/macOS**: `~/.config/chan-meng-cli/`
- **Windows**: `%APPDATA%\chan-meng-cli\`

To reset your progress, delete this directory.

## Technical Details

- **ES Modules**: Uses modern JavaScript with `"type": "module"`
- **Dependencies**: 7 carefully selected packages (within constitutional limit of 10)
- **Startup Time**: < 5 seconds (lazy loading for heavy modules)
- **Test Coverage**: 80%+ lines, 70%+ branches

## Dependencies

- `inquirer@^9.0.0` - Interactive prompts
- `chalk@^5.0.0` - Terminal colors
- `boxen@^7.0.0` - Styled boxes
- `figlet@^1.7.0` - ASCII art text (lazy loaded)
- `conf@^11.0.0` - Configuration management
- `ora@^7.0.0` - Loading spinners
- `gradient-string@^2.0.0` - Text gradients (lazy loaded)

## License

MIT

## Author

**Chan Meng** - Senior AI/ML Infrastructure Engineer

- 💼 **LinkedIn**: [chanmeng666](https://www.linkedin.com/in/chanmeng666/)
- 🐙 **GitHub**: [ChanMeng666](https://github.com/ChanMeng666)
- 📧 **Email**: chanmeng.dev@gmail.com

---

**Built with Spec-Driven Development using Spec Kit**

_"此时此刻没用，就应该扔掉" - If it's not useful right now, discard it._
