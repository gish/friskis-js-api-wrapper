import assert from 'assert'
import dotenv from 'dotenv'
import moment from 'moment'
import FriskisSvettisApi from './api.js'

dotenv.config()

describe('Friskis', () => {
  let credentials

  before(() => {
    credentials = {
      username: process.env.USERNAME,
      password: process.env.PASSWORD,
      apikey: process.env.APIKEY
    }
  })

  describe('Credentials', () => {
    it('should have username', () => assert(credentials.username))
    it('should have password', () => assert(credentials.password))
    it('should have api key', () => assert(credentials.apikey))
  })

  describe('Auth token', () => {
    it('should return auth token', () => {
      // given
      const { username, password, apikey } = credentials

      // when
      return FriskisSvettisApi.getAuthToken({
        apikey: apikey,
        username: username,
        password: password
      })
      .then((authToken) => {
        // then
        assert(authToken.length > 0)
      })
    })
  })

  describe('Get activities', () => {
    const startDate = moment().add(2, 'days').format('YYYY-MM-DD')
    const endDate = moment().add(2, 'days').format('YYYY-MM-DD')
    const businessUnitIds = '1'
    let activities

    before(() => {
      const { username, password, apikey } = credentials
      return FriskisSvettisApi.getActivities({
        apikey,
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

  describe('Create booking', () => {
    const activityid = 3034863
    const findActivityById = (activitybookings, id) => {
      return activitybookings.find((booking) => {
        return booking.activityid === id
      })
    }
    let createdBooking

    before(() => {
      const { username, password, apikey } = credentials
      return FriskisSvettisApi.createBooking({
        apikey,
        username,
        password,
        activityid
      })
      .then((booking) => {
        createdBooking = booking
      })
    })

    it('should get given activity id when booked', () => {
      const actual = createdBooking.activitybooking.activityid
      const expected = activityid
      assert.equal(actual, expected)
    })
    it('should get booking id when booked', () => {
      assert(createdBooking.activitybooking.id)
    })
  })
  it('should delete booking', () => {})
  it('should get bookings', () => {})
})
