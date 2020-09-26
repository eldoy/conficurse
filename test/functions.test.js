const loader = require('../index.js')

describe('functions', () => {
  it('should show a directory tree', () => {
    const tree = loader.tree('test')
    expect(tree.length > 0).toBe(true)
    expect(Array.isArray(tree)).toBe(true)
  })

  it('should give empty result if not exist', () => {
    const tree = loader.tree('doesnotexist')
    expect(tree.length === 0).toBe(true)
    expect(Array.isArray(tree)).toBe(true)
  })
})
