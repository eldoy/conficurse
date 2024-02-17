var path = require('path')
var lodash = require('lodash')

var { lazyload, byFileName } = require('./lib/util.js')

var { tree, basext, env } = require('extras')

var LAZYLOADABLE = ['js', 'json', 'mjs', 'cjs', 'wasm', 'node']

function load(dir, opt, fn) {
  if (typeof opt == 'function') {
    fn = opt
    opt = {}
  }
  if (!opt) {
    opt = {}
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
    if (opt.lazy && LAZYLOADABLE.includes(ext)) {
      content = lazyload(file, mode, fn, props)
    } else {
      content = env(file, mode)
      if (typeof fn == 'function') {
        content = fn({ ...props, content })
      }
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
