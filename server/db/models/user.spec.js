/* global describe beforeEach it */

const {expect} = require('chai')
const db = require('../index')
const User = db.model('user')

describe('User model', () => {
  beforeEach(() => {
    return db.sync({force: true})
  })

  describe('instanceMethods', () => {
    describe('correctPassword', () => {
      let cody

      beforeEach(async () => {
        cody = await User.create({
          email: 'cody@puppybook.com',
          password: 'bones',
          address1: '789 Web Dr',
          isAdmin: true
        })
      })

      it('returns true if the password is correct', () => {
        expect(cody.correctPassword('bones')).to.be.equal(true)
      })

      it('returns false if the password is incorrect', () => {
        expect(cody.correctPassword('bonez')).to.be.equal(false)
      })

      it('returns false if the email is incorrect', () => {
        expect(cody.correctPassword('c@puppybook.com')).to.be.equal(false)
      })

      it('returns true if the email is correct', () => {
        expect(cody.correctPassword('cody@puppybook.com')).to.be.equal(false)
      })
      it('returns true if the admin status is correct', () => {
        expect(cody.isAdmin).to.be.equal('true')
      })
    }) // end describe('correctPassword')
  }) // end describe('instanceMethods')
}) // end describe('User model')
