var path = require('node:path')
var fs = require('node:fs')
var lodash = require('lodash')
var requireFromString = require('require-from-string')

var { tree, basext, env, read } = require('extras')

function byFileName(a, b) {
  var [b1, x1] = basext(a)
  var [b2, x2] = basext(b)
  return (b1.match(/^\d+/g) || b1) - (b2.match(/^\d+/g) || b2)
}

function requireFile(file, props, opt) {
  if (typeof opt.onrequire == 'function') {
    var content = fs.readFileSync(file, 'utf8')
    content = opt.onrequire({ ...props, content })
    return requireFromString(content, file)
  }
  return require(file)
}

function getContent(file, props, opt) {
  function lazy(val) {
    if (typeof val != 'undefined') {
      return val
    }
    return requireFile(file, props, opt)
  }

  function lazyload(path) {
    var val
    return new Proxy(function () {}, {
      apply: function (target, self, args) {
        val = lazy(val)
        return Reflect.apply(val, self, args)
      }
    })
  }

  if (opt.lazy) {
    return lazyload(file)
  }
  return requireFile(file, props, opt)
}

function getConfig(dir, opt) {
  var config = {}
  var root = dir.startsWith(path.sep) ? '' : process.cwd()
  var mode = opt.mode || process.env.NODE_ENV || 'development'
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

    if (ext == 'js') {
      content = getContent(file, props, opt)
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

function load(dir, opt = {}) {
  if (typeof opt == 'function') {
    opt = { onload: opt }
  }
  if (opt.async) {
    return new Promise(function (r) {
      r(getConfig(dir, opt))
    })
  }
  return getConfig(dir, opt)
}

function loadAsync(dir, opt = {}) {
  opt.async = true
  return load(dir, opt)
}

module.exports = { load, loadAsync }
