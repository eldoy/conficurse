/**
 * Session model
 */
module.exports = {
  access: {
    groups: {
      allow: ['guest', 'member'],
      guest: {
        actions: ['insert', 'forgot', 'reset']
      },
      member: {
        actions: ['remove', 'get']
      }
    }
  }
}
