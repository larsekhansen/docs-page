# Contributing to Digdir Documentation Portal

## Getting Started

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Follow the quick-start checklist in README.md
4. Make your changes
5. Submit a pull request

## Development Workflow

### Branch Naming

- `feature/feature-name` - New features
- `fix/issue-description` - Bug fixes
- `docs/update-type` - Documentation updates
- `refactor/component-name` - Code refactoring
- `chore/maintenance-task` - Maintenance tasks

### Code Style

#### TypeScript/JavaScript
- Use TypeScript for all new code
- Follow existing code patterns
- Use explicit return types for functions
- Prefer `const` over `let` when possible
- Use meaningful variable names

#### Hugo Templates
- Use Hugo's built-in functions where possible
- Keep templates simple and readable
- Follow existing naming conventions
- Use partials for reusable components

#### React Islands
- Use functional components with hooks
- Follow Designsystemet component patterns
- Keep components focused and small
- Use TypeScript for all props

### Commit Messages

Follow the conventional commit format:
```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting (no code change)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance

Examples:
```
feat(search): add filtering by date range

fix(ui): resolve keyboard navigation in search modal

docs(sync): update examples for new sources
```

### Pull Request Process

1. Update documentation if needed
2. Add tests for new functionality
3. Ensure all tests pass: `npm test`
4. Run smoke test: `npm run smoke-test`
5. Update README.md if user-facing changes
6. Request review from team members

#### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Smoke test passes
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console errors in browser
```

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run specific test type
npm run test:unit
npm run test:integration
npm run test:e2e

# Run with coverage
npm run test:coverage
```

### Writing Tests

- Unit tests for individual functions/modules
- Integration tests for component interactions
- E2E tests for critical user flows

### Test Files

- Place tests in `__tests__/` directory next to source
- Name test files: `filename.test.ts` or `filename.spec.ts`
- Use descriptive test names

## Adding New Content Sources

1. Update `sources.json` (create from `sources.json.example`)
2. Implement adapter if new type needed
3. Add tests for the adapter
4. Update documentation
5. Test sync with `npm run sync:docs -- --source=your-source`

## Debugging

### Common Debug Commands

```bash
# Debug mode with verbose output
DEBUG=* npm run dev

# Check specific service
curl http://localhost:8000/api/health

# Rebuild everything
npm run clean && npm run build

# Check TypeScript
npm run type-check

# Lint code
npm run lint
```

### Debug Tips

- Use browser dev tools for React islands
- Check Hugo templates with `hugo --source hugo --templateMetrics`
- Monitor search API with `curl -X POST http://localhost:8000/api/search -d '{"q":"test"}'`

## Performance Considerations

- Optimize images before adding
- Keep search index size reasonable
- Use lazy loading for heavy content
- Monitor build times

## Security

- Never commit API keys or secrets
- Use environment variables for sensitive data
- Validate all external content
- Keep dependencies updated

## Getting Help

1. Check [TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)
2. Search existing issues
3. Ask in team channel
4. Create an issue with detailed description

## Release Process

1. Update version in package.json
2. Update CHANGELOG.md
3. Create release tag: `git tag v1.0.0`
4. Push tag: `git push origin v1.0.0`
5. Create GitHub release

## Code of Conduct

Be respectful, inclusive, and constructive. We're here to build something great together.

## License

By contributing, you agree to license your contributions under the project's license.
