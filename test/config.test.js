const path = require('path')
const loader = require('../index.js')
const config = loader.load('test/config')

describe('config', () => {
  it('should be an object when created', () => {
    expect(typeof config).toEqual('object')
  })

  it('should have a config', () => {
    expect(typeof config.settings).toEqual('object')
    expect(config.settings.access.identifier).toEqual('email')
  })

  it('should have a schema for project', () => {
    expect(typeof config.project.schema).toEqual('object')
  })

  it('should have a controller for project', () => {
    expect(typeof config.project.controller).toEqual('object')
    expect(typeof config.project.controller.beforeSave).toEqual('function')
  })

  it('should load json files', () => {
    expect(config.data.hello).toEqual('world')
  })

  it('should sort middleware by number', async () => {
    const names = Object.keys(config.middleware)
    expect(names).toEqual(['10-hello', '11-hello', '100-hello', 'cya'])
  })

  it('should merge environment files', () => {
    expect(config.settings.pagination.results).toEqual(50)
  })

  it('should merge array environment files', () => {
    expect(config.products.length).toEqual(2)
    expect(config.products[0].price).toEqual(40)
    expect(config.products[1].price).toEqual(20)
  })

  it('should give you a blank config if not found', () => {
    const c = loader.load('scronfig')
    expect(c).toEqual({})
  })

  it('should work with absolute path', async () => {
    const dir = path.join(process.cwd(), 'test', 'config')
    const config = loader.load(dir)
    expect(typeof config.project.controller).toEqual('object')
  })
})
