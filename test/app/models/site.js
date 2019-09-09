/**
 * Site model
 */
module.exports = {
  access: {
    groups: {
      allow: ['member'],
      member: {
        actions: ['insert', 'update', 'remove', 'find', 'get'],
        insert: {
          values: ['_id', 'user_id', 'name']
        },
        update: {
          query: ['_id'],
          values: ['name']
        },
        remove: {
          query: ['_id']
        }
      }
    }
  },
  fields: {
    name: {
      type: 'string',
      validate: {
        required: true,
        minlength: 3
      }
    },
    key: {
      type: 'string'
    }
  }
}
