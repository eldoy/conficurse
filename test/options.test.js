const loader = require('../index.js')

describe('options', () => {
  it('should merge routes', async () => {
    const routes = loader.load('test/app/routes', { merge: true })
    expect(typeof routes['message/insert@action']).toBe('function')
  })

  it('should not go deeper', async () => {
    const emails = loader.load('test/app/emails', { depth: 0 })
    expect(typeof emails['reset-email']).toBe('function')
    expect(emails.layouts).toBeUndefined()
  })

  it('should go 1 deep', async () => {
    const emails = loader.load('test/app/emails', { depth: 1 })
    expect(typeof emails['reset-email']).toBe('function')
    expect(emails.layouts.html).toBe('LAYOUT')
  })

  it('should go 2 deep', async () => {
    const app = loader.load('test/app', { depth: 2 })
    expect(typeof app.emails['reset-email']).toBe('function')
    expect(app.emails.layouts.html).toBe('LAYOUT')
  })
})
