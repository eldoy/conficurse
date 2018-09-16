const fs = require('fs')
const p = require('path')
const _ = require('lodash')
const yaml = require('js-yaml')
const loader = {}

// Get absolute path
loader.abs = (name) => {
  return `${process.cwd()}/${name}`
}

// Get name and extension
loader.split = (path) => {
  return p.basename(path).split('.')
}

// Load file if it exists
loader.file = (path) => {
  if (fs.existsSync(path)) {
    return fs.readFileSync(path, 'utf8')
  }
  return null
}

loader.dir = (path) => {
  return fs.readdirSync(path)
}

loader.isdir = (path) => {
  return fs.lstatSync(path).isDirectory()
}

loader.env = (path, ext = 'yml') => {
  const mode = process.env.NODE_ENV
  if (mode) {
    return path.replace(`.${ext}`, `.${mode}.${ext}`)
  }
}

loader.exist = (path) => {
  return path ? fs.existsSync(path) : false
}

// Load yml
loader.yaml = (path) => {
  const obj = yaml.load(loader.file(path))
  const base = loader.env(path)
  if (loader.exist(base)) {
    _.merge(obj, yaml.load(loader.file(base)))
  }
  return obj
}

// Load yaml file
loader.load = (path) => {
  const config = {}

  // Base dir
  const base = loader.abs(path)

  if (loader.exist(base)) {
    for (const f of loader.dir(base)) {
      // Extract name and extension, set path
      const [name, ext] = f.split('.')
      const path = `${base}/${f}`

      // If it's a directory, it's a model
      if (loader.isdir(path)) {
        // Read directory

        const models = loader.dir(path)

        // Make room for model
        config[f] = {}

        // Read files
        for (const m of models) {
          // Extract name and extension, set path
          const [name, ext] = m.split('.')
          const path = `${base}/${f}/${m}`

          // Read schema file
          if (ext === 'yml') {
            config[f][name] = loader.yaml(path)

          // Read before filter
          } else if(ext === 'js') {
            config[f][name] = loader.file(path)
          }
        }
      } else if (ext === 'yml') {
        config[name] = loader.yaml(path)
      }
    }
  }
  return config
}

module.exports = loader
