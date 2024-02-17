# Conficurse Config Loader

The conficurse library will load your config YAML, JSON and JS files as a Javascript object. This is great for huge configuration file hierarchies or applications with deep structures.

Awesome features:

- Env support, merges files automatically based on your current environment
- Supports callback functions for modifying file content before and after load
- Can lazy load modules using Javascript proxy objects
- You can load your files async in parallel using promises

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

// Load files async using promises, can be used with Promise.all
var pages = await loader.loadAsync('app/pages')

// Change content on load
var config = loader.load('config', {
  onload: function({
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
  }
})

// Change content before require
var app = loader.load('app', {
  onrequire: function({
    mode,
    dir,
    file,
    base,
    ext,
    trail,
    content
  }) {
    return content.replace('@', process.cwd())
  }
})
```

### Caveats

These are some things to be aware of:

- You cannot use env with `.js` files
- Only `.js` files can be lazy loaded
- Only `.js` files supports `onrequire` callbacks

MIT licensed. Enjoy!
