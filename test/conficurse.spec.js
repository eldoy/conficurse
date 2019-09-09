const conficurse = require('../index.js')
const config = conficurse.load('test/config')

describe('conficurse', () => {
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

  it('should merge environment files', () => {
    expect(config.settings.pagination.results).toEqual(50)
  })

  it('should give you a blank config if not found', () => {
    const c = conficurse.load('scronfig')
    expect(c).toBeUndefined()
  })
  it('should export js files to functions', () => {
    const exp = conficurse.export(config)
    expect(typeof exp.validations.project).toEqual('function')
  })
})
