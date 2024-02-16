var path = require('path')
var lodash = require('lodash')
var { addHook } = require('pirates')

var { tree, basext, env } = require('extras')

var exts = ['.js']

function primitive(val) {
  return typeof val != 'object' && typeof val != 'function'
}

function lazy(val, path, mode) {
  if (typeof val != 'undefined') {
    return val
  }

  // var removeHook = addHook(
  //   function (content, name) {
  //     console.log('HOOKING', name)
  //     console.log(content)

  //     // Callback here

  //     if (fn) {
  //       content = fn({ ...props, content })
  //     }

  //     return content
  //   },
  //   { exts }
  // )

  var content = env(path, mode)
  // console.log(content)

  // if (typeof fn == 'function') {
  //   props.content = content
  //   content = fn(props)
  // }

  // if (fn && !exts.includes(`.${props.ext}`)) {
  //   content = fn({ ...props, content })
  // }

  // removeHook()

  // Callback here if not js

  return content
}

function lazyload(path, mode) {
  var val
  var handler = {
    get: (target, key) => {
      val = lazy(val, path, mode)
      return Reflect.get(val, key)
    },
    apply: (target, self, args) => {
      val = lazy(val, path, mode)
      return Reflect.apply(val, self, args)
    },
    construct: (target, args) => {
      val = lazy(val, path, mode)
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

    var content = lazyload(file, mode)
    var props = { mode, dir, file, base, ext, trail, content }

    if (typeof fn == 'function') {
      content = fn(props)
    }

    if (trail) {
      lodash.set(config, trail, content)
    }
  }
  return config
}

module.exports = { load }
