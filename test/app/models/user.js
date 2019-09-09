/**
 * User model
 */
module.exports = {
  access: {
    groups: {
      allow: ['guest', 'member'],
      guest: {
        actions: ['insert', 'find', 'remove', 'count'],
        insert: {
          values: ['_id', 'email', 'password']
        }
      },
      member: {
        actions: ['update'],
        update: {
          query: ['_id'],
          values: ['email', 'password', 'current']
        }
      }
    }
  },
  fields: {
    email: {
      type: 'string',
      validate: {
        required: {
          actions: ['insert']
        },
        is: '$email',
        unique: true
      }
    },
    password: {
      type: 'string',
      encrypt: true,
      validate: {
        required: {
          actions: ['insert']
        },
        minlength: 6
      }
    },
    current: {
      type: 'string',
      validate: {
        minlength: 6,
        matcher: async function(val, route) {}
      }
    }
  }
}
