# mongo-schema-convertor

To init project:

```bash
bun init
```

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.1.17. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

# Setup
### 1. Run Typescript Code

- Add a script to `package.json`:

```json
{
  "scripts": {
    "dev": "bun run index.ts",
    "build": "bun run tsc",
    "start": "bun run dist/index.ts"
  }
}
```

- Run script:

```bash
bun run dev
```

### 2. Integrating ESLint

- Install ESLint:

```bash
bun add -d eslint
```

- Initialize ESLint:

```bash
bun run eslint --init
```

- Install Stylistic ESLint:

```bash
bun add -d @stylistic/eslint-plugin
```

- Add ESLint configuration to `eslint.config.js`:

```javascript
import stylistic from '@stylistic/eslint-plugin'

export default [
  // ...your other config items
  stylistic.configs.customize({}),
]
```

- Set VSCode ESLint:

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll": "explicit"
  },
}
```
