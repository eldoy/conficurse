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
