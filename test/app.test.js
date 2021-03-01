const loader = require('../index.js')
const app = loader.load('test/app')

describe('app', () => {
  it('should be an object when created', () => {
    expect(typeof app).toEqual('object')
  })

  it('should load routes', async () => {
    expect(typeof app.routes['message-routes']['message/insert@action']).toBe('function')
  })

  it('should load models', async () => {
    expect(app.models.message.fields.subject.type).toBe('string')
  })

  it('should load emails', async () => {
    expect(typeof app.emails['reset-email']).toBe('function')
  })

  it('should support a transform callback', async () => {
    const app2 = loader.load('test/app', function({ file, content }) {
      if (file.endsWith('txt')) {
        return 'Bye'
      }
      return content
    })

    expect(app2.pages.hello).toBe('Bye')
  })
})
