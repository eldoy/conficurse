# Conficurse Recursive Config Loader

The conficurse library will load your YAML and JSON files as a Javascript object. This is great for huge configuration file hierarchies.

### INSTALL
```npm i conficurse``` or ```yarn add conficurse```

### USAGE
See the ```config``` directory for an example directory structure.

```javascript
const loader = require('conficurse')

const config = loader.load('config') // Path is relative to where you run the command
```

MIT licensed. Enjoy!
