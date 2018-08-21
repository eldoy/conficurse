const fs = require('fs')
const yaml = require('js-yaml')
const loader = {}

// Load yml
loader.loadYaml = (path) => {
  const file = fs.readFileSync(path, 'utf8')
  return yaml.load(file)
}

// Load yaml file
loader.load = (path) => {
  const config = {}

  // Base dir
  const base = `${process.cwd()}/${path}`

  if (fs.existsSync(base)) {
    const files = fs.readdirSync(`${base}`)
    for (const f of files) {
      // Extract name and extension, set path
      const [name, ext] = f.split('.')
      const path = `${base}/${f}`

      // If it's a directory, it's a model
      if (fs.lstatSync(path).isDirectory()) {
        // Read directory
        const models = fs.readdirSync(path)

        // Make room for model
        config[f] = {}

        // Read files
        for (const m of models) {
          // Extract name and extension, set path
          const [name, ext] = m.split('.')
          const path = `${base}/${f}/${m}`

          // Read schema file
          if (ext === 'yml') {
            config[f][name] = loader.loadYaml(path)

          // Read before filter
          } else if(ext === 'js') {
            config[f][name] = fs.readFileSync(`${path}`, 'utf8')
          }
        }
      } else if (ext === 'yml') {
        config[name] = loader.loadYaml(path)
      }
    }
  }
  return config
}

module.exports = loader
