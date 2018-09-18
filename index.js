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

// Load file
loader.file = (path, ext = 'yml') => {
  let data = loader.read(path)
  switch (ext) {
    case 'yml': data = loader.yaml(path); break
    case 'json': data = JSON.parse(data)
  }
  loader.merge(path, ext, data)
  return data
}

// Check if file exists
loader.exist = (path) => {
  return path ? fs.existsSync(path) : false
}

// Read file
loader.read = (path) => {
  return fs.readFileSync(path, 'utf8')
}

// Load yml
loader.yaml = (path) => {
  return yaml.load(loader.read(path))
}

// Read directory
loader.dir = (path) => {
  return fs.readdirSync(path).map(x => `${path}/${x}`)
}

// Is directory?
loader.isdir = (path) => {
  return fs.lstatSync(path).isDirectory()
}

// Get the environment version of a file
loader.env = (path, ext = 'yml') => {
  const mode = process.env.NODE_ENV || 'development'
  return path.replace(`.${ext}`, `.${mode}.${ext}`)
}

// Merge environment file into data
loader.merge = (path, ext, data) => {
  // Merge environment file
  if (typeof data === 'object') {
    const e = loader.env(path, ext)
    if (loader.exist(e)) {
      _.merge(data, loader.file(e))
    }
  }
}

// Load config files
loader.load = (path) => {
  if (!loader.exist(path)) {
    return undefined
  }
  const config = {}
  const build = (file, c) => {
    const [ name, ext ] = loader.split(file)
    if (loader.isdir(file)) {
      c[name] = {}
      const files = loader.dir(file)
      for (const f of files) {
        build(f, c[name])
      }
    } else {
      c[name] = loader.file(file, ext)
    }
  }  
  build(loader.abs(path), config)  

  // Remove the root before return
  return config[Object.keys(config)[0]]
}

module.exports = loader
