import assert from 'assert'
import dotenv from 'dotenv'
import FriskisSvettisApi from './api.js'

dotenv.config()

describe('Friskis', () => {
  let credentials

  before(() => {
    credentials = {
      username: process.env.USERNAME,
      password: process.env.PASSWORD,
      apiKey: process.env.APIKEY
    }
  })

  describe('Credentials', () => {
    it('should have username', () => assert(credentials.username))
    it('should have password', () => assert(credentials.password))
    it('should have api key', () => assert(credentials.apiKey))
  })

  it('should return auth token', () => {
    // given
    const { username, password, apiKey } = credentials

    // when
    return FriskisSvettisApi.getAuthToken({
      apiKey: apiKey,
      username: username,
      password: password
    })
    .then((authToken) => {
      // then
      assert(authToken.length > 0)
    })
  })

  describe('Get activities', () => {
    const startDate = '2016-07-26'
    const endDate = '2016-07-26'
    const businessUnitIds = '1'
    let activities

    before(() => {
      const { username, password, apiKey } = credentials
      return FriskisSvettisApi.getActivities({
        apiKey,
        username,
        password,
        businessUnitIds,
        startDate,
        endDate
      })
      .then((response) => {
        activities = response
      })
    })

    it('should get list of activities', () => {
      const activity = activities.activity
      assert(activity.length > 0)
    })

    it('should get start date', () => {
      const actual = activities.startDate
      const expected = startDate
      assert.equal(actual, expected)
    })

    it('should get end date', () => {
      const actual = activities.endDate
      const expected = endDate
      assert.equal(actual, expected)
    })
  })
  it('should book activity', () => {})
  it('should delete booking', () => {})
  it('should get bookings', () => {})
})
