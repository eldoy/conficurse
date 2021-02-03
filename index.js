const _ = require('lodash')
const extras = require('extras')
const srequire = require('require-from-string')

const NODE_EXTENSIONS = ['js', 'json', 'mjs', 'cjs', 'wasm', 'node']

const loader = {}

// Load file
loader.file = (path, ext) => {
  let data
  if (ext === 'yml') {
    data = extras.yaml(path)
  } else if (NODE_EXTENSIONS.includes(ext)) {
    data = require(path)
  } else {
    data = extras.read(path)
  }
  loader.merge(path, ext, data)
  return data
}

// Get the environment version of a file
loader.env = (path, ext) => {
  const mode = process.env.NODE_ENV || 'development'
  return path.replace(`.${ext}`, `.${mode}.${ext}`)
}

// Merge environment file into data
loader.merge = (path, ext, data) => {
  if (typeof data === 'object') {
    const envpath = loader.env(path, ext)
    if (extras.exist(envpath)) {
      _.merge(data, loader.file(envpath, ext))
    }
  }
}

// Load config files
loader.load = (path, options = {}) => {
  if (!extras.exist(path)) return
  const config = {}
  let depth = 0
  const build = (file, c) => {
    const [name, ext] = extras.split(file)
    if (extras.isDir(file)) {
      if (depth++ > options.depth) return
      c[name] = {}
      const files = extras.dir(file)
      for (const f of files) {
        build(f, c[name])
      }
    } else {
      const content = loader.file(file, ext)
      if (options.merge) {
        _.merge(c, content)
      } else {
        c[name] = content
      }
    }
  }
  build(extras.abs(path), config)

  // Remove the root before return
  return config[Object.keys(config)[0]]
}

// Check if file has the 'module.exports' string
loader.isexportable = (str) => {
  return /module\.exports/.test(str)
}

// Export files from string
loader.export = (data) => {
  if (typeof data === 'string') {
    data = JSON.parse(data)
  }
  const traverse = (obj) => {
    for (const k in obj) {
      if (obj[k] && typeof obj[k] === 'object') {
        traverse(obj[k])
      } else {
        if (loader.isexportable(obj[k])) {
          obj[k] = srequire(obj[k])
        }
      }
    }
  }
  traverse(data)
  return data
}

module.exports = loader
