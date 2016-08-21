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
      if (error || body.error) {
        reject(error.body || body.error)
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
        const {
          startdate,
          enddate,
          businessunitids,
          includeBooking
        } = options
        const url = `${baseUrl}/activities.json`
        const method = 'GET'

        return doApiRequest(method, url, apikey, username, password, {
          businessunitids: businessunitids,
          startdate: startdate,
          enddate: enddate,
          includebooking: includeBooking
        })
      },
      createBooking (options) {
        const {
          activityid
        } = options
        const url = `${baseUrl}/activitybookings.json`
        const method = 'POST'

        return doApiRequest(method, url, apikey, username, password, {
          activityid
        })
      },
      deleteBooking (options) {
        const {
          id,
          type
        } = options
        const url = `${baseUrl}/activitybookings.json`
        const method = 'DELETE'

        return doApiRequest(method, url, apikey, username, password, {
          id,
          type
        })
      },
      getBookings (options) {
        return new Promise((resolve, reject) => {
          reject('not implemented')
        })
      }
    }
}

export default apiHandler
