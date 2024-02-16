# Conficurse Recursive Config Loader

The conficurse library will load your config YAML, JSON and JS files as a Javascript object. This is great for huge configuration file hierarchies.

Extra features:

- Env support, merges files automatically based on your current environment
- Supports callback function for changing file content before require
- Can lazy load modules using Javascript Proxies
- You can load your files async using promises

### Install
```npm i conficurse```

### Usage

See the ```test/config``` directory for an example directory structure.

```js
var loader = require('conficurse')

// Path is the directory relative to where you run the command
var config = loader.load('config')

// Lazy load, functions won't be required until you use them
var pages = loader.load('app/pages', { lazy: true })

// Lazy load with callback, only works with .js files
var pages = loader.load('app/pages', { lazy: true }, function({ content }) {
  return html6(content)
})

// Load files async
var pages = loader.loadAsync('app/pages')

// Change content on load
var config = loader.load('config', function({
  mode,
  dir,
  file,
  base,
  ext,
  trail,
  content
}) {
  if (ext == 'yml') {
    return YAML.load(content)
  }
  return content
})
```

### Caveats

These are some things to be aware of:

- You cannot use env with .js files when lazy loading
- Only 'js', 'json', 'mjs', 'cjs', 'wasm' and 'node' files can be lazy loaded
- Only '.js' files supports callbacks when lazy loading

MIT licensed. Enjoy!
