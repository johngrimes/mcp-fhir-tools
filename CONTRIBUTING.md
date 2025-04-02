# Contributing

Here are some guidelines for working with this code base.

- Use bun for running the program and for managing packages.
- Use Prettier for code formatting.
- All code should include appropriate license headers (Apache-2.0).

## Tests

This project uses Jest for testing. To run tests:

```bash
# Run tests for all packages
bun test

# Run tests for a specific package
cd fhir-tools
bun test

# Run tests with coverage
bun test --coverage
```

When adding new features, please include appropriate tests in the respective package's `tests` directory. Test files should follow the naming convention `*.test.ts`.

## Linting

This project uses ESLint for linting TypeScript code. To run ESLint:

```bash
# Run ESLint for a specific package
cd fhir-tools
bun run lint

# Fix automatically fixable issues
bun run lint:fix
```

The ESLint configuration is defined in `.eslintrc.json` at the root of the project and extends the recommended TypeScript rules.
