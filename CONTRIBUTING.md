# Contributing

Contributions are welcome through GitHub issues and pull requests.

## Local development

Requirements: Node.js 18 or newer and npm.

```bash
npm ci
npm run typecheck
npm test
npm run build
```

Please add or update tests for behavioral changes. Keep calendar conversion deterministic and avoid runtime dependencies unless there is a strong reason to introduce one.

## Pull requests

1. Describe the problem and the proposed behavior.
2. Include tests for new behavior or bug fixes.
3. Ensure type checking, tests, and the build pass.
4. Document public API changes in `README.md`.
