const _ = require('lodash')
const path = require('path')
const extras = require('extras')
const loader = {}

// Sort by number in file name
function byFileName(a, b) {
  const [b1, x1] = extras.name(a)
  const [b2, x2] = extras.name(b)
  return (b1.match(/^\d+/g) || b1) - (b2.match(/^\d+/g) || b2)
}

loader.load = function(dir, fn) {
  const config = {}
  const root = process.cwd()
  const mode = process.env.NODE_ENV || 'development'
  const tree = extras.tree(dir).sort(byFileName)

  for (const file of tree) {
    let content = extras.read(file)
    const [base, ext] = extras.name(file)

    // Merge environment file content
    if (_.isPlainObject(content)) {
      const name = file.replace(`.${ext}`, `.${mode}.${ext}`)
      const item = tree.find(f => f === name)
      if (item) {
        _.merge(content, extras.read(item))
      }
    }

    const trail = file
      .replace(path.join(root, dir), '')
      .split(path.sep)
      .slice(1, -1)
      .concat(base)
      .join('.')

    if (typeof fn == 'function') {
      content = fn({ mode, dir, file, base, ext, trail, content })
    }

    _.set(config, trail, content)
  }
  return config
}

module.exports = loader
