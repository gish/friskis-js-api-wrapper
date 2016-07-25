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

  it('should get activities', () => {
    // given
    const authToken = ''
    const startDate = ''
    const endDate = ''

    // when
    return FriskisSvettisApi.getActivities({
      token: authToken,
      startDate: startDate,
      endDate: endDate
    })
    .then((data) => {
      // then
      expect(data.length > 0).toEqual(true)
    })
  })
  it('should book activity', () => {})
  it('should delete booking', () => {})
  it('should get bookings', () => {})
})
