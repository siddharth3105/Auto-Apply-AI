# Contributing to AutoApply AI

Thank you for your interest in contributing to AutoApply AI! This document provides guidelines and instructions for contributing.

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:
- Clear title and description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Browser and OS version

### Suggesting Enhancements

Feature requests are welcome! Please include:
- Clear description of the feature
- Use case and benefits
- Possible implementation approach
- Any relevant examples

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes
4. Test thoroughly
5. Commit with clear messages (`git commit -m 'Add AmazingFeature'`)
6. Push to your fork (`git push origin feature/AmazingFeature`)
7. Open a Pull Request

### Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/Auto-Apply-AI.git
cd Auto-Apply-AI

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Add your Gemini API key

# Start development server
npm run dev
```

### Code Style

- Use TypeScript for all new code
- Follow existing code style
- Run `npm run lint` before committing
- Run `npm run format` to auto-format
- Add comments for complex logic

### Testing

- Write tests for new features
- Ensure all tests pass: `npm run test`
- Test in multiple browsers
- Test both web app and extension

### Commit Messages

Use clear, descriptive commit messages:
- `feat: Add LinkedIn auto-apply support`
- `fix: Resolve form detection issue`
- `docs: Update setup instructions`
- `refactor: Simplify AI service code`
- `test: Add tests for job fetcher`

### What We're Looking For

**High Priority:**
- Additional job sources
- Better form detection algorithms
- UI/UX improvements
- Performance optimizations
- Bug fixes

**Medium Priority:**
- Documentation improvements
- Test coverage
- Accessibility enhancements
- Internationalization

**Low Priority:**
- Code refactoring
- Style improvements

## Project Structure

```
src/
├── shared/          # Shared utilities and types
│   ├── types/      # TypeScript type definitions
│   ├── api/        # Job fetching APIs
│   ├── ai/         # AI service integrations
│   └── automation/ # Form automation logic
├── web/            # Web application
│   ├── components/ # React components
│   ├── pages/     # Page components
│   └── services/  # Business logic
└── extension/      # Chrome extension
    ├── background/ # Service worker
    ├── content/   # Content scripts
    └── popup/     # Extension popup
```

## Key Technologies

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **Vite** - Build tool
- **Vitest** - Testing

## Questions?

- Open a Discussion on GitHub
- Contact: siddharth3105 on GitHub
- Read the documentation in `/docs`

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

Thank you for making AutoApply AI better! 🚀
