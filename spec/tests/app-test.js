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
