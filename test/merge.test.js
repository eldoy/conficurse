const loader = require('../index.js')
const routes = loader.load('test/app/routes', true)

describe('merge', () => {
  it('should be an object when created', () => {
    expect(typeof routes).toEqual('object')
  })

  it('should merge routes', async () => {
    expect(typeof routes['message/insert@action']).toBe('function')
  })
})
