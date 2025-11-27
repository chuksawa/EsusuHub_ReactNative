# Contributing Guide

Thank you for considering contributing to EsusuHub React Native!

## Getting Started

1. Fork the repository
2. Clone your fork
3. Create a feature branch
4. Make your changes
5. Submit a pull request

## Development Workflow

### 1. Setup

```bash
git clone <your-fork-url>
cd EsusuHub_ReactNative
npm install
```

### 2. Create Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 3. Make Changes

- Write clean, readable code
- Follow existing code style
- Add tests for new features
- Update documentation

### 4. Test Your Changes

```bash
npm test
npm run lint
npm run type-check
```

### 5. Commit

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git commit -m "feat: add new feature"
git commit -m "fix: resolve bug"
git commit -m "docs: update documentation"
```

### 6. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## Code Style

### TypeScript

- Use TypeScript for all new code
- Define types for all props and state
- Avoid `any` type
- Use interfaces for object shapes

### React Components

- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic to custom hooks
- Use `React.memo` for expensive components

### Naming Conventions

- **Components**: PascalCase (`UserProfile.tsx`)
- **Hooks**: camelCase with `use` prefix (`useAuth.ts`)
- **Utilities**: camelCase (`errorHandler.ts`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)

### File Structure

```
src/
├── components/
│   └── ComponentName/
│       ├── ComponentName.tsx
│       ├── ComponentName.test.tsx
│       └── index.ts
├── screens/
├── services/
└── utils/
```

## Testing

### Writing Tests

- Test user interactions
- Test error cases
- Test edge cases
- Aim for >70% coverage

### Test Structure

```typescript
describe('ComponentName', () => {
  it('should render correctly', () => {
    // Test implementation
  });

  it('should handle user interaction', () => {
    // Test implementation
  });
});
```

## Documentation

### Code Comments

- Document complex logic
- Explain "why" not "what"
- Use JSDoc for functions

```typescript
/**
 * Calculates total savings from all groups
 * @param groups - Array of group objects
 * @returns Total savings amount
 */
function calculateTotalSavings(groups: Group[]): number {
  // Implementation
}
```

### README Updates

- Update README for new features
- Add examples for new APIs
- Update installation steps if needed

## Pull Request Guidelines

### Before Submitting

- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] No linting errors
- [ ] TypeScript compiles without errors
- [ ] Documentation updated
- [ ] Commit messages follow conventions

### PR Description

Include:
- What changes were made
- Why changes were needed
- How to test
- Screenshots (if UI changes)
- Breaking changes (if any)

## Code Review

- Be respectful and constructive
- Focus on code, not person
- Ask questions if unclear
- Suggest improvements
- Approve when satisfied

## Questions?

- Open an issue for bugs
- Start a discussion for features
- Contact maintainers for questions

Thank you for contributing! 🎉

