const fs = require('fs')
const p = require('path')
const _ = require('lodash')
const yaml = require('js-yaml')
const srequire = require('require-from-string')

const NODE_EXTENSIONS = ['js', 'json', 'mjs', 'cjs', 'wasm', 'node']

const loader = {}

// Get absolute path
loader.abs = (name) => {
  return `${process.cwd()}/${name}`
}

// Get name and extension
loader.split = (path) => {
  return p.basename(path).split('.')
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
  return fs.readdirSync(path)
    .sort((a, b) => (a.match(/^\d+/g) || a) - (b.match(/^\d+/g) || b))
    .map(x => `${path}/${x}`)
}

// Is directory?
loader.isdir = (path) => {
  return fs.lstatSync(path).isDirectory()
}

// Load file
loader.file = (path, ext) => {
  let data
  if (ext === 'yml') {
    data = loader.yaml(path)
  } else if (NODE_EXTENSIONS.includes(ext)) {
    data = require(path)
  } else {
    data = loader.read(path)
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
    if (loader.exist(envpath)) {
      _.merge(data, loader.file(envpath, ext))
    }
  }
}

// Load config files
loader.load = (path, options = {}) => {
  if (!loader.exist(path)) return
  const config = {}
  let depth = 0
  const build = (file, c) => {
    const [name, ext] = loader.split(file)
    if (loader.isdir(file)) {
      if (depth++ > options.depth) return
      c[name] = {}
      const files = loader.dir(file)
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
  build(loader.abs(path), config)

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

// Directory tree as flat array
loader.tree = (root) => {
  const glob = (path, files) => {
    fs.readdirSync(path).forEach((file) => {
      const subpath = p.join(path, file)
      if(fs.lstatSync(subpath).isDirectory()){
        glob(subpath, files)
      } else {
        files.push(subpath)
      }
    })
  }
  const files = []
  glob(loader.abs(root), files)
  return files
}

module.exports = loader
