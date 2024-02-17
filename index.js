var path = require('node:path')
var fs = require('node:fs')
var lodash = require('lodash')
var requireFromString = require('require-from-string')

var { lazyload, byFileName } = require('./lib/util.js')

var { tree, basext, env, read } = require('extras')

var NODE_EXTENSIONS = ['js', 'json', 'mjs', 'cjs', 'wasm', 'node']

function load(dir, opt = {}) {
  if (typeof opt == 'function') {
    opt = { onload: opt }
  }
  var config = {}
  var root = dir.startsWith(path.sep) ? '' : process.cwd()
  var mode = process.env.NODE_ENV || 'development'
  var files = tree(dir).sort(byFileName)

  for (var file of files) {
    var [base, ext] = basext(file)
    if (!base) continue

    var trail = file
      .replace(path.join(root, dir), '')
      .split(path.sep)
      .slice(1, -1)
      .concat(base)
      .map((x) => (x.includes('.') ? `['${x}']` : x))
      .join('.')

    var props = { mode, dir, file, base, ext, trail }
    var content

    if (ext == 'js' && typeof opt.onrequire == 'function') {
      content = fs.readFileSync(file, 'utf8')
      content = opt.onrequire({ ...props, content })
      content = requireFromString(content, file)
    } else {
      content = env(file, mode)
    }

    if (typeof opt.onload == 'function') {
      content = opt.onload({ ...props, content })
    }

    if (trail) {
      lodash.set(config, trail, content)
    }
  }

  return config
}

function loadAsync(dir, opt, fn) {
  return new Promise(function (r) {
    r(load(dir, opt, fn))
  })
}

module.exports = { load, loadAsync }
