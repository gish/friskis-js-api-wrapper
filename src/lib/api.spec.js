import assert from 'assert'
import dotenv from 'dotenv'
import moment from 'moment'
import FriskisSvettisApi from './api.js'

dotenv.config()

let apiHandler

const getActivities = (credentials) => {
  const startdate = moment().add(2, 'days').format('YYYY-MM-DD')
  const enddate = moment().add(5, 'days').format('YYYY-MM-DD')
  const businessunitids = '1'
  const { username, password, apikey } = credentials

  return apiHandler.getActivities({
    businessunitids,
    startdate,
    enddate
  })
}

const bookActivity = (credentials) => {
  return getActivities(credentials)
  .then((response) => {
    const bookableActivity = response.activities.activity.find((activity) => {
      return activity.bookableslots > 0
    })
    return bookableActivity.id
  })
  .then((activityid) => {
    return apiHandler.createBooking({
      activityid
    })
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
    apiHandler = FriskisSvettisApi({
      username: credentials.username,
      password: credentials.password,
      apikey: credentials.apikey
    })
 })

  describe('Credentials', () => {
    it('should have username', () => assert(credentials.username))
    it('should have password', () => assert(credentials.password))
    it('should have api key', () => assert(credentials.apikey))
  })

  describe('Auth token', () => {
    it('should return auth token', () => {
      // when
      return apiHandler.getAuthToken()
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
        activities = response.activities
      })
    })

    it('should get list of activities', () => {
      const activity = activities.activity
      assert(activity.length > 0)
    })

    it('should get start date', () => {
      assert(activities.startdate)
    })

    it('should get end date', () => {
      assert(activities.enddate)
    })
  })

  describe('Create booking', () => {
    let createdBooking

    before(() => {
      return bookActivity(credentials)
      .then((booking) => {
        createdBooking = booking
      })
    })

    after(() => {
      if (!createdBooking) {
        return // Failed created booking, possibly timeout. Let's bail
      }

      const id = createdBooking.activitybooking.id
      const type = 'ordinary'

      return apiHandler.deleteBooking({
        id,
        type
      })
    })

    it('should get activity id when booked', () => {
      const expected = createdBooking.activitybooking.activityid
      assert(expected)
    })

    it('should get booking id when booked', () => {
      assert(createdBooking.activitybooking.id)
    })
  })

  describe('Delete booking', () => {
    let createdBooking

    before(() => {
      return bookActivity(credentials)
      .then((booking) => {
        createdBooking = booking
      })
    })

    it('should have empty response deleting given booking', () => {
      const id = createdBooking.activitybooking.id
      const type = 'ordinary'

      return apiHandler.deleteBooking({
        id,
        type
      })
      .then((response) => {
        const actual = response
        const expected = {}
        assert.deepEqual(actual, expected)
      })
    })
  })
  it('should get bookings', () => {})
})
