/**
 * Message model
 */
module.exports = {
  access: {
    groups: {
      allow: ['member'],
      member: {
        actions: ['insert'],
        insert: {
          values: ['_id', 'user_id', 'subject', 'content']
        }
      }
    }
  },
  fields: {
    subject: {
      type: 'string',
      validate: {
        required: true,
        minlength: 3
      }
    },
    content: {
      type: 'string',
      validate: {
        required: true,
        minlength: 3
      }
    }
  }
}
