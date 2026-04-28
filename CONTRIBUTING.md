# Contributing to Outclaw

Thank you for your interest in contributing to Outclaw. This guide explains how to get involved, what we expect from contributions, and how the review process works.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). We are committed to providing a welcoming and inclusive experience for everyone.

## How to Contribute

### Reporting Bugs

If you find a bug, please [open an issue](https://github.com/outmarkhq/outclaw/issues/new) with the following information:

- A clear, descriptive title
- Steps to reproduce the issue
- Expected behavior vs. actual behavior
- Your environment (OS, Node.js version, browser)
- Screenshots or logs, if applicable

### Suggesting Features

Feature requests are welcome. Please [open an issue](https://github.com/outmarkhq/outclaw/issues/new) and describe:

- The problem you are trying to solve
- Your proposed solution
- Any alternatives you have considered

### Submitting Pull Requests

1. **Fork** the repository and clone your fork locally.
2. **Create a branch** from `main` for your work:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Install dependencies**:
   ```bash
   pnpm install
   ```
4. **Make your changes**. Follow the coding standards below.
5. **Write or update tests** for your changes:
   ```bash
   pnpm test
   ```
6. **Run the type checker**:
   ```bash
   pnpm check
   ```
7. **Commit** with a clear message following [Conventional Commits](https://www.conventionalcommits.org/):
   ```
   feat: add audience segmentation to growth agents
   fix: resolve chat message ordering issue
   docs: update deployment guide for Docker
   ```
8. **Push** your branch and open a pull request against `main`.

## Development Setup

Refer to the [Getting Started](README.md#getting-started) section in the README for environment setup instructions.

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode during development
pnpm test -- --watch
```

### Code Formatting

We use Prettier for code formatting. Run the formatter before committing:

```bash
pnpm format
```

## Coding Standards

### TypeScript

- Use TypeScript for all new code. Avoid `any` types.
- Define interfaces and types in `shared/types.ts` for shared contracts.
- Use Zod schemas for runtime validation in tRPC procedures.

### Frontend

- Use shadcn/ui components from `client/src/components/ui/` for consistency.
- Follow the existing page structure in `client/src/pages/`.
- Use tRPC hooks (`trpc.*.useQuery`, `trpc.*.useMutation`) for all data fetching.
- Handle loading, error, and empty states in every component.

### Backend

- Add database helpers in `server/db.ts`.
- Add tRPC procedures in `server/routers.ts`.
- Use `protectedProcedure` for authenticated endpoints and `publicProcedure` for public ones.
- Write tests for new procedures in `server/*.test.ts`.

### Commits

- Keep commits focused on a single change.
- Write descriptive commit messages.
- Reference issue numbers when applicable (`fixes #123`).

## Review Process

All pull requests are reviewed by a maintainer. We aim to provide feedback within a few business days. To speed up the review:

- Keep PRs small and focused.
- Include a clear description of what changed and why.
- Add screenshots for UI changes.
- Ensure all tests pass and there are no TypeScript errors.

## License

By contributing to Outclaw, you agree that your contributions will be licensed under the [MIT License](LICENSE).

---

Questions? Open an issue or reach out on [LinkedIn](https://linkedin.com/company/outmarkhq).
