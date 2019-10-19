# Conficurse Recursive Config Loader

The conficurse library will load your config YAML, JSON and JS files as a Javascript object. This is great for huge configuration file hierarchies.

### INSTALL
```npm i conficurse``` or ```yarn add conficurse```

### USAGE
See the ```test/config``` directory for an example directory structure.

```javascript
const loader = require('conficurse')

// Path is the directory relative to where you run the command
const config = loader.load('config')

// Using the merge option merges the files
const routes = loader.load('app/routes', { merge: true })

// Set depth of recursion
const routes = loader.load('app/routes', { depth: 1 })

// Set depth to 0 to not do recursion
const routes = loader.load('app/routes', { depth: 0 })

// Export strings that contain 'module.exports'
const exported = loader.export(config)
```
MIT licensed. Enjoy!
