# Conficurse Recursive Config Loader

The conficurse library will load your config YAML, JSON and JS files as a Javascript object. This is great for huge configuration file hierarchies.

### INSTALL
```npm i conficurse```

### USAGE
See the ```test/config``` directory for an example directory structure.

```javascript
const loader = require('conficurse')

// Path is the directory relative to where you run the command
const config = loader.load('config')
```
MIT licensed. Enjoy!
