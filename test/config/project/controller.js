module.exports = {
  beforeSave: async () => {
    if (set.invalid === 1) {
      errors.add('invalid', 'Can not be 1')
    }
  }
}
