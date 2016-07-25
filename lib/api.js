import request from 'request'

const baseUrl = 'https://bokning.uppsala.friskissvettis.se/grails/api/ver2'

const doApiRequest = (url, apiKey, username, password, qs) => {
  const queryString = Object.assign({
    apikey: apiKey
  }, qs)

  return new Promise((resolve, reject) => {
    request.get({
      url: url,
      auth: {
        user: username,
        pass: password
      },
      qs: queryString
    }, (error, response, body) => {
      if (error) {
        reject(error.body)
      } else {
        resolve(JSON.parse(body))
      }
    })
  })
}

const FriskisSvettisApi = {
  getAuthToken (options) {
    const {
      apiKey,
      username,
      password
    } = options
    const url = `${baseUrl}/persons.json`
    return new Promise((resolve, reject) => {
      doApiRequest(url, apiKey, username, password, {
        requestauthtoken: true
      })
      .then((body) => {
        const authToken = body.persons[0].authtoken
        resolve(authToken)
      })
    })
  },
  getActivities (options) {
    const {
      apiKey,
      username,
      password,
      startDate,
      endDate,
      businessUnitIds,
      includeBooking
    } = options
    const url = `${baseUrl}/activities.json`

    return new Promise((resolve, reject) => {
      doApiRequest(url, apiKey, username, password, {
        businessunitids: businessUnitIds,
        startdate: startDate,
        enddate: endDate,
        includebooking: includeBooking
      })
      .then((body) => {
        const {
          activity,
          startdate,
          enddate
        } = body.activities
        resolve({
          activity,
          startDate: startdate,
          endDate: enddate
        })
      })
    })
  },
  createBooking (options) {
    return new Promise((resolve, reject) => {
      reject('not implemented')
    })
  },
  deleteBooking (options) {
    return new Promise((resolve, reject) => {
      reject('not implemented')
    })
  },
  getBookings (options) {
    return new Promise((resolve, reject) => {
      reject('not implemented')
    })
  }
}

export default FriskisSvettisApi
