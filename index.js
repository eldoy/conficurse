const _ = require('lodash')
const path = require('path')
const { basext, tree, read } = require('extras')
const loader = {}

// Sort by number in file name
function byFileName(a, b) {
  const [b1, x1] = basext(a)
  const [b2, x2] = basext(b)
  return (b1.match(/^\d+/g) || b1) - (b2.match(/^\d+/g) || b2)
}

loader.load = function(dir, fn) {
  const config = {}
  const root = dir.startsWith(path.sep) ? '' : process.cwd()
  const mode = process.env.NODE_ENV || 'development'
  const files = tree(dir).sort(byFileName)

  for (const file of files) {
    let content = read(file)
    const [base, ext] = basext(file)

    // Merge environment file content
    if (_.isPlainObject(content)) {
      const name = file.replace(`.${ext}`, `.${mode}.${ext}`)
      const item = files.find(f => f === name)
      if (item) {
        _.merge(content, read(item))
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
