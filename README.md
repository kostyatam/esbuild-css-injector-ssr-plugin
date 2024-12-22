# esbuild-css-modules-plugin

An `esbuild` plugin that enhances CSS and SCSS module support with:
- Scoped class name mappings.
- A `CSSInjector` React component for server-side rendering (SSR).

---

## Features

- **CSS/SCSS Modules**: Scoped class name mappings.
- **SSR-Friendly**: Inject styles directly into HTML.
- **Fast and Lightweight**: Built with `postcss-modules` and `sass`.

---

## Installation

```bash
npm install esbuild-css-modules-plugin
```

---

## Usage

### esbuild Configuration

```javascript
import esbuild from 'esbuild';
import cssModulesPlugin from 'esbuild-css-modules-plugin';

esbuild.build({
  entryPoints: ['src/index.js'],
  bundle: true,
  plugins: [cssModulesPlugin()],
  outfile: 'dist/bundle.js',
}).catch(console.error);
```

### Importing CSS/SCSS

#### Example
```javascript
import styles, { CSSInjector } from './styles.css';

console.log(styles.button); // "button__hash"

const App = () => (
  <>
    <CSSInjector />
    <button className={styles.button}>Click Me</button>
  </>
);
```

---

## License

[MIT License](LICENSE)
