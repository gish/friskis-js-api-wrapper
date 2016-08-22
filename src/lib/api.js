import request from 'request'

const baseUrl = 'https://bokning.uppsala.friskissvettis.se/grails/api/ver2'

const doApiRequest = (method, url, apikey, username, password, qs) => {
  const queryString = Object.assign({
    apikey: apikey
  }, qs)

  return new Promise((resolve, reject) => {
    request({
      method: method,
      url: url,
      auth: {
        user: username,
        pass: password
      },
      qs: queryString
    }, (error, response, body) => {
      if (error || body.errors) {
        reject(error.body || body.errors)
      } else {
        resolve(JSON.parse(body || '{}'))
      }
    })
  })
}

const apiHandler = (options) => {
  const {
      username,
      password,
      apikey
  } = options

  return {
    getAuthToken (options) {
      const url = `${baseUrl}/persons.json`
      const method = 'GET'

      return new Promise((resolve, reject) => {
        doApiRequest(method, url, apikey, username, password, {
          requestauthtoken: true
        })
        .then((body) => {
          const authToken = body.persons[0].authtoken
          resolve(authToken)
        })
      })
    },
    getActivities (options) {
      const url = `${baseUrl}/activities.json`
      const method = 'GET'

      return doApiRequest(method, url, apikey, username, password, options)
    },
    createBooking (options) {
      const url = `${baseUrl}/activitybookings.json`
      const method = 'POST'

      return doApiRequest(method, url, apikey, username, password, options)
    },
    deleteBooking (options) {
      const url = `${baseUrl}/activitybookings.json`
      const method = 'DELETE'

      return doApiRequest(method, url, apikey, username, password, options)
    },
    getBookings (options) {
      return new Promise((resolve, reject) => {
        reject('not implemented')
      })
    }
  }
}

export default apiHandler
