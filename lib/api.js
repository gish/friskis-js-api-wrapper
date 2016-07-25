import request from 'request'

const FriskisSvettisApi = {
  getAuthToken (options) {
    const {
      apiKey,
      username,
      password
    } = options
    const url = 'https://bokning.uppsala.friskissvettis.se/grails/api/ver2/persons.json'

    return new Promise((resolve, reject) => {
      request.get({
        url: url,
        auth: {
          user: username,
          pass: password
        },
        qs: {
          apikey: apiKey,
          requestauthtoken: true
        }
      }, (error, response, body) => {
        if (error) {
          reject(error.body)
        } else {
          const bodyAsJson = JSON.parse(body)
          const authToken = bodyAsJson.persons[0]['authtoken']
          resolve(authToken)
        }
      })
    })
  },
  getActivities (options) {
    return new Promise((resolve, reject) => {
      reject('not implemented')
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
