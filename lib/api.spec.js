import FriskisSvettisApi from './api.js'

describe('Friskis', () => {
  it('should return auth token', (done) => {
    // given
    const username = ''
    const password = ''

    // when
    FriskisSvettisApi.getAuthToken({
      username: username,
      password: password
    })
    .then((data) => {
      // then
      const authToken = data.authtoken
      expect(authToken.length > 0).toEqual(true)
      done()
    })
  })

  it('should get activities', (done) => {
    // given
    const authToken = ''
    const startDate = ''
    const endDate = ''

    // when
    FriskisSvettisApi.getActivities({
      token: authToken,
      startDate: startDate,
      endDate: endDate
    })
    .then((data) => {
      // then
      expect(data.length > 0).toEqual(true)
      done()
    })
  })
  it('should book activity', () => {})
  it('should delete booking', () => {})
  it('should get bookings', () => {})
})
