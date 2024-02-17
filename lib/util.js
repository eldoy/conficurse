var { addHook } = require('pirates')
var { basext } = require('extras')

// Sort by number in file name
function byFileName(a, b) {
  var [b1, x1] = basext(a)
  var [b2, x2] = basext(b)
  return (b1.match(/^\d+/g) || b1) - (b2.match(/^\d+/g) || b2)
}

function lazy(val, path, mode, fn, props) {
  if (typeof val != 'undefined') {
    return val
  }

  function hook(content, name) {
    if (typeof fn == 'function') {
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

module.exports = { byFileName, lazy, lazyload }
