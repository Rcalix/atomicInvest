require('dotenv').config()

const express = require('express')
const fetch = require('node-fetch')

const PORT = process.env.PORT || 8081
const ATOMIC_ID = process.env.ATOMIC_ID
const ATOMIC_API = process.env.ATOMIC_API

console.log('PORT =', PORT)
console.log('ATOMIC_ID =', ATOMIC_ID)
console.log('ATOMIC_API =', ATOMIC_API)

const app = express()

app.use(express.json())

app.get('/example/users', function (request, response) {
  fetch(ATOMIC_API + '/users', {
    headers: {
      'Atomic-ID': ATOMIC_ID,
    },
  })
    .then((rsp) => {
      if (rsp.ok) {
        return rsp.json()
      } else {
        return rsp.text().then((data) => {
          throw new Error('HTTP ' + rsp.status + ': ' + data)
        })
      }
    })
    .then((data) => {
      console.log(data)
      response.status(201).send(JSON.stringify(data, null, 2))
    })
    .catch((error) => response.status(500).send(error.message))
})

app.get('/example/users/:id', function (request, response) {
  fetch(ATOMIC_API + '/users/' + request.params.id, {
    headers: {
      'Atomic-ID': ATOMIC_ID,
    },
  })
    .then((rsp) => {
      if (rsp.ok) {
        return rsp.json()
      } else {
        return rsp.text().then((data) => {
          throw new Error('HTTP ' + rsp.status + ': ' + data)
        })
      }
    })
    .then((data) => {
      console.log(data)
      response.status(201).send(JSON.stringify(data, null, 2))
    })
    .catch((error) => response.status(500).send(error.message))
})

app.post('/example/users', function (request, response) {
  fetch(ATOMIC_API + '/users', {
    method: 'POST',
    headers: {
      'Atomic-ID': ATOMIC_ID,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request.body),
  })
    .then((rsp) => {
      if (rsp.ok) {
        return rsp.json()
      } else {
        return rsp.text().then((data) => {
          throw new Error('HTTP ' + rsp.status + ': ' + data)
        })
      }
    })
    .then((data) => {
      if (data.code) {
        throw new Error(data.developer_message)
      }
      console.log(data)
      response.status(201).send(JSON.stringify(data, null, 2))
    })
    .catch((error) => response.status(500).send(error.message))
})

app.post('/example/auth/onetime-tokens', function (request, response) {
  fetch(ATOMIC_API + '/auth/onetime-tokens', {
    method: 'POST',
    headers: {
      'Atomic-ID': ATOMIC_ID,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: 'b05eafb0-4ce2-4ed9-8c56-4c6ac18999f9',
    }),
  })
    .then((rsp) => {
      if (rsp.ok) {
        return rsp.json()
      } else {
        console.log(data)
        return rsp.text().then((data) => {
          throw new Error('HTTP ' + rsp.status + ': ' + data)
        })
      }
    })
    .then((data) => {
      console.log(data)
      response.status(201).send(JSON.stringify(data, null, 2))
    })
    .catch((error) => response.status(500).send(error.message))
})

app.listen(PORT, function () {
  console.log(`Listening on http://localhost:${PORT}`)
})
