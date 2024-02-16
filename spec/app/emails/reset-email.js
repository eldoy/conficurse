/**
 * Reset email
 */

const options = { subject: 'Password reset' }

module.exports = function({ key }) {
  const link = `http://localhost:3000/reset/${key}`
  return {
    options,
    html:
`<h1>Forgot password</h1>
<a href="${link}">${link}</a>
`
,
    text:
`Forgot password

${link}
`
  }
}
