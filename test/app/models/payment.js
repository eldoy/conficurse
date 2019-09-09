/**
 * Payment model
 */
module.exports = {
  access: {
    groups: {
      allow: ['member'],
      member: {
        actions: ['insert'],
        insert: {
          values: ['_id', 'user_id', 'token', 'site_id', 'amount']
        }
      }
    }
  },
  fields: {
    token: {
      type: 'string',
      validate: {
        required: true,
        minlength: 28
      }
    }
  }
}
