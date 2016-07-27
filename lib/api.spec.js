import assert from 'assert'
import dotenv from 'dotenv'
import moment from 'moment'
import FriskisSvettisApi from './api.js'

dotenv.config()

const getActivities = (credentials) => {
  const startDate = moment().add(2, 'days').format('YYYY-MM-DD')
  const endDate = moment().add(2, 'days').format('YYYY-MM-DD')
  const businessunitids = '1'
  const { username, password, apikey } = credentials

  return FriskisSvettisApi.getActivities({
    apikey,
    username,
    password,
    businessunitids,
    startDate,
    endDate
  })
}

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
    let activities

    before(() => {
      return getActivities(credentials)
      .then((response) => {
        activities = response
      })
    })

    it('should get list of activities', () => {
      const activity = activities.activity
      assert(activity.length > 0)
    })

    it('should get start date', () => {
      assert(activities.startDate)
    })

    it('should get end date', () => {
      assert(activities.endDate)
    })
  })

  describe.only('Create booking', () => {
    let createdBooking
    let bookedActivityId

    before(() => {
      const { username, password, apikey } = credentials

      return getActivities(credentials)
      .then((activities) => {
        const bookableActivity = activities.activity.find((activity) => {
          return activity.bookableslots > 0
        })
        return bookableActivity.id
      })
      .then((activityid) => {
        bookedActivityId = activityid
        return FriskisSvettisApi.createBooking({
          apikey,
          username,
          password,
          activityid
        })
      })
      .then((booking) => {
        createdBooking = booking
      })
    })

    it('should get given activity id when booked', () => {
      const actual = createdBooking.activitybooking.activityid
      const expected = bookedActivityId
      assert.equal(actual, expected)
    })

    it('should get booking id when booked', () => {
      assert(createdBooking.activitybooking.id)
    })
  })
  it('should delete booking', () => {})
  it('should get bookings', () => {})
})
