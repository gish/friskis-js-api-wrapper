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
      const parsedBody = JSON.parse(body || '{}')

      if (error) {
        reject(error)
      } else if (parsedBody.errors) {
        const errors = parsedBody.errors
        const message = errors[0].message
        reject(new Error(message))
      } else {
        resolve(parsedBody)
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
      const url = `${baseUrl}/activitybookings.json`
      const method = 'GET'

      return doApiRequest(method, url, apikey, username, password, options)
    }
  }
}

export default apiHandler
