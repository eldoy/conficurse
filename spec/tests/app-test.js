var path = require('node:path')
var loader = require('../../index.js')
var app = loader.load('spec/app')

it('should be an object when created', ({ t }) => {
  t.ok(typeof app == 'object')
})

it('should load routes', async ({ t }) => {
  t.ok(
    typeof app.routes['message-routes']['message/insert@action'] == 'function'
  )
})

it('should load models', async ({ t }) => {
  t.ok(app.models.message.fields.subject.type == 'string')
})

it('should load emails', async ({ t }) => {
  t.ok(typeof app.emails['reset-email'] == 'function')
})

it('should load pages', async ({ t }) => {
  t.ok(typeof app.pages.contact == 'function')
})

it('should load pages with dot in name', async ({ t }) => {
  t.ok(typeof app.pages['about.html'] == 'function')
  t.ok(typeof app.pages['sitemap.xml'] == 'function')
})

it('should support a transform callback', async ({ t }) => {
  var app2 = loader.load('spec/app', function ({ file, content }) {
    if (file.endsWith('txt')) {
      return 'Bye'
    }
    return content
  })
  t.ok(app2.pages.hello == 'Bye')
})

it('should support lazy loading', async ({ t }) => {
  var app2 = loader.load('spec/app', { lazy: true })
  t.ok(typeof app2.pages.hello == 'string')
  t.ok(app2.pages.hello == 'Hello')

  t.ok(typeof app2.pages.contact == 'function')
  t.ok((await app2.pages.contact()) == 'contact')
})

it('should support async loading', async ({ t }) => {
  var app2 = await loader.loadAsync('spec/app')
  t.ok(typeof app2.pages.hello == 'string')
  t.ok(app2.pages.hello == 'Hello')

  t.ok(typeof app2.pages.contact == 'function')
  t.ok((await app2.pages.contact()) == 'contact')
})

it('should be an object when created', ({ t }) => {
  t.ok(typeof app.config == 'object')
})

it('should have a config', ({ t }) => {
  t.ok(typeof app.config.settings == 'object')
  t.ok(app.config.settings.access.identifier == 'email')
})

it('should have a schema for project', ({ t }) => {
  t.ok(typeof app.config.project.schema == 'object')
})

it('should have a controller for project', ({ t }) => {
  t.ok(typeof app.config.project.controller == 'object')
  t.ok(typeof app.config.project.controller.beforeSave == 'function')
})

it('should load json files', ({ t }) => {
  t.ok(app.config.data.hello == 'world')
})

it('should sort middleware by number', async ({ t }) => {
  var names = Object.keys(app.config.middleware)
  t.deepEqual(names, ['10-hello', '11-hello', '100-hello', 'cya'])
})

it('should merge environment files', ({ t }) => {
  t.ok(app.config.settings.pagination.results == 50)
})

it('should keep environments', ({ t }) => {
  t.ok(app.config['settings.test'].pagination.results == 50)
  t.ok(app.config['settings.production'].pagination.results == 99)
})

it('should merge array environment files', ({ t }) => {
  t.ok(app.config.products.length == 2)
  t.ok(app.config.products[0].price == 40)
  t.ok(app.config.products[1].price == 20)
})

it('should give you a blank config if not found', ({ t }) => {
  var c = loader.load('scronfig')
  t.deepEqual(c, {})
})

it('should not files starting with dot', ({ t }) => {
  t.ok(typeof app.config[''] == 'undefined')
})

it('should work with absolute path', async ({ t }) => {
  var dir = path.join(process.cwd(), 'spec', 'config')
  var config = loader.load(dir)
  t.ok(typeof app.config.project.controller == 'object')
})
