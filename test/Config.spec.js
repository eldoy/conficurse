const conficurse = require('../conficurse')
const config = conficurse.load('config')

describe('Config', () => {

  /**
  * CONFIG
  **/

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

  it('should have a before_all for project', () => {
    expect(typeof config.project.before_all).toEqual('string')
  })

  it('should have a validate for project', () => {
    expect(typeof config.project.validate).toEqual('string')
  })

  it('should have a after_all for project', () => {
    expect(typeof config.project.after_all).toEqual('string')
  })
})
