# Contributing to Outclaw

Thank you for your interest in contributing to Outclaw. This document provides guidelines and information for contributors.

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally
3. Create a new branch for your feature or fix
4. Make your changes
5. Run the test suite to ensure nothing is broken
6. Submit a pull request

## Development Setup

```bash
git clone https://github.com/your-username/outclaw.git
cd outclaw
pnpm install
cp .env.example .env
# Edit .env with your local configuration
pnpm dev
```

## Code Style

- We use Prettier for code formatting. Run `pnpm format` before committing.
- TypeScript is required for all new code.
- Follow the existing patterns in the codebase.

## Testing

```bash
pnpm test
```

All pull requests must pass the existing test suite. New features should include tests.

## Pull Request Process

1. Update the README.md if your changes affect the user-facing documentation.
2. Update the CHANGELOG.md with a description of your changes.
3. Ensure all tests pass.
4. Request review from a maintainer.

## Reporting Issues

Use the GitHub issue tracker. Include:
- A clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Your environment (OS, Node.js version, Docker version)

## Code of Conduct

Be respectful. We are building something together.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
