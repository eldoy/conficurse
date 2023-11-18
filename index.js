var lodash = require('lodash')
var path = require('path')
var { basext, tree, env } = require('extras')

// Sort by number in file name
function byFileName(a, b) {
  var [b1, x1] = basext(a)
  var [b2, x2] = basext(b)
  return (b1.match(/^\d+/g) || b1) - (b2.match(/^\d+/g) || b2)
}

function load(dir, fn) {
  var config = {}
  var root = dir.startsWith(path.sep) ? '' : process.cwd()
  var mode = process.env.NODE_ENV || 'development'
  var files = tree(dir).sort(byFileName)

  for (var file of files) {
    let content = env(file, mode)
    var [base, ext] = basext(file)

    var trail = file
      .replace(path.join(root, dir), '')
      .split(path.sep)
      .slice(1, -1)
      .concat(base)
      .map((x) => (x.includes('.') ? `['${x}']` : x))
      .join('.')

    if (typeof fn == 'function') {
      content = fn({ mode, dir, file, base, ext, trail, content })
    }

    if (trail) {
      lodash.set(config, trail, content)
    }
  }
  return config
}

module.exports = { load }
