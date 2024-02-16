var path = require('path')
var loader = require('../../index.js')
var config = loader.load('spec/config')

it('should be an object when created', ({ t }) => {
  t.ok(typeof config == 'object')
})

it('should have a config', ({ t }) => {
  t.ok(typeof config.settings == 'function')
  t.ok(config.settings.access.identifier == 'email')
})

it('should have a schema for project', ({ t }) => {
  t.ok(typeof config.project.schema == 'function')
})

it('should have a controller for project', ({ t }) => {
  t.ok(typeof config.project.controller == 'function')
  t.ok(typeof config.project.controller.beforeSave == 'function')
})

it('should load json files', ({ t }) => {
  t.ok(config.data.hello == 'world')
})

it('should sort middleware by number', async ({ t }) => {
  var names = Object.keys(config.middleware)
  t.deepEqual(names, ['10-hello', '11-hello', '100-hello', 'cya'])
})

it('should merge environment files', ({ t }) => {
  t.ok(config.settings.pagination.results == 50)
})

it('should keep environments', ({ t }) => {
  t.ok(config['settings.test'].pagination.results == 50)
  t.ok(config['settings.production'].pagination.results == 99)
})

it('should merge array environment files', ({ t }) => {
  t.ok(config.products.length == 2)
  t.ok(config.products[0].price == 40)
  t.ok(config.products[1].price == 20)
})

it('should give you a blank config if not found', ({ t }) => {
  var c = loader.load('scronfig')
  t.deepEqual(c, {})
})

it('should load files starting with dot', ({ t }) => {
  t.ok(typeof config[''] == 'undefined')
})

it('should work with absolute path', async ({ t }) => {
  var dir = path.join(process.cwd(), 'spec', 'config')
  var config = loader.load(dir)
  t.ok(typeof config.project.controller == 'function')
})
