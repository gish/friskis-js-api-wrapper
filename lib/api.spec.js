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
    it('should get list of activities', () => {
      // given
      const { username, password, apiKey } = credentials
      const startDate = '2016-07-26'
      const endDate = '2016-07-26'
      const businessUnitIds = '1'

      // when
      return FriskisSvettisApi.getActivities({
        apiKey,
        username,
        password,
        businessUnitIds,
        startDate,
        endDate
      })
      .then((activities) => {
        // then
        const activity = activities.activity
        assert(activity.length > 0)
      })
    })
  })
  it('should book activity', () => {})
  it('should delete booking', () => {})
  it('should get bookings', () => {})
})
