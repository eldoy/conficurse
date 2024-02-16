var path = require('path')
var lodash = require('lodash')
var { addHook } = require('pirates')

var { tree, basext, env } = require('extras')

var NODE_EXTENSIONS = ['js', 'json', 'mjs', 'cjs', 'wasm', 'node']

function lazy(val, path, mode, fn, props) {
  if (typeof val != 'undefined') {
    return val
  }

  function hook(content, name) {
    if (fn) {
      content = fn({ ...props, content })
    }
    return content
  }

  var removeHook = addHook(hook, { exts: ['.js'] })
  var content = require(path)
  removeHook()

  return content
}

function lazyload(path, mode, fn, props) {
  var val
  var handler = {
    get: (target, key) => {
      val = lazy(val, path, mode, fn, props)
      return Reflect.get(val, key)
    },
    apply: (target, self, args) => {
      val = lazy(val, path, mode, fn, props)
      return Reflect.apply(val, self, args)
    },
    construct: (target, args) => {
      val = lazy(val, path, mode, fn, props)
      return Reflect.construct(val, args)
    }
  }
  return new Proxy(function () {}, handler)
}

// Sort by number in file name
function byFileName(a, b) {
  var [b1, x1] = basext(a)
  var [b2, x2] = basext(b)
  return (b1.match(/^\d+/g) || b1) - (b2.match(/^\d+/g) || b2)
}

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

    var trail = file
      .replace(path.join(root, dir), '')
      .split(path.sep)
      .slice(1, -1)
      .concat(base)
      .map((x) => (x.includes('.') ? `['${x}']` : x))
      .join('.')

    var props = { mode, dir, file, base, ext, trail }
    var content
    if (opt.lazy && NODE_EXTENSIONS.includes(ext)) {
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

module.exports = { load }
