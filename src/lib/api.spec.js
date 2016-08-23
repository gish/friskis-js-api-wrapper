import assert from 'assert'
import dotenv from 'dotenv'
import moment from 'moment'
import FriskisSvettisApi from './api.js'

dotenv.config()

const credentials = {
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  apikey: process.env.APIKEY
}
const apiHandler = FriskisSvettisApi({
  username: credentials.username,
  password: credentials.password,
  apikey: credentials.apikey
})

const timeout = 30 * 1E3

const getActivities = () => {
  const startdate = moment().add(2, 'days').format('YYYY-MM-DD')
  const enddate = moment().add(5, 'days').format('YYYY-MM-DD')
  const businessunitids = '1'

  return apiHandler.getActivities({
    businessunitids,
    startdate,
    enddate
  })
}

const bookActivity = () => {
  return getActivities()
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

const getBookings = () => {
  const startdate = moment().add(2, 'days').format('YYYY-MM-DD')
  const enddate = moment().add(5, 'days').format('YYYY-MM-DD')
  const type = 'ordinary'

  return apiHandler.getBookings({
    startdate,
    enddate,
    type
  })
}

const deleteBooking = (booking) => {
  if (!booking) {
    return // Failed created booking, possibly timeout. Let's bail
  }

  const id = booking.activitybooking.id
  const type = 'ordinary'

  return apiHandler.deleteBooking({
    id,
    type
  })
}

describe('Friskis', function () {
  this.timeout(timeout)

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
      return bookActivity()
      .then((booking) => {
        createdBooking = booking
      })
    })

    after(() => {
      deleteBooking(createdBooking)
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
      return bookActivity()
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

  describe('Get activity bookings', () => {
    let createdBooking
    let bookedActivities

    before(() => {
      return bookActivity()
      .then((booking) => {
        createdBooking = booking
        return getBookings()
      })
      .then((bookings) => {
        bookedActivities = bookings
      })
    })

    after(() => {
      deleteBooking(createdBooking)
    })

    it('should have at least one activitybooking', () => {
      const expected = 1
      const actual = bookedActivities.activitybookings.activitybooking.length

      assert(actual >= expected)
    })
  })
})
