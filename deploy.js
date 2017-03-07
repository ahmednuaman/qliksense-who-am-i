require('colors')

const BUILD_DIR = './build'
const CWD = process.cwd()
const HOST = process.env.HOST
const XRF_KEY = require('randomstring').generate({
  length: 16,
  charset: 'alphanumeric'
})

const async = require('async')
const fs = require('fs')
const path = require('path')
const request = require('request')

const QEXT = JSON.parse(fs.readFileSync('./qlik/template.qext'))
const ZIP_FILE = `${QEXT.name}.zip`

let requests = []

const headers = {
  'X-Qlik-Xrfkey': XRF_KEY,
  userid: process.env.USER_ID
}
const qs = {
  xrfkey: XRF_KEY
}

const extension = request.defaults({
  baseUrl: `${HOST}extension/`,
  headers,
  qs
})

requests.push((done) => {
  extension.delete(`name/${QEXT.name}`, (error) => {
    console.log(`Successfully deleted old extension ${QEXT.name}`)
    done(error)
  })
})

requests.push((done) => {
  const stream = fs.createReadStream(path.join(CWD, BUILD_DIR, ZIP_FILE))

  stream.on('error', done)
  stream.pipe(
    extension
      .post('upload', {
        headers: Object.assign(headers, {
          'content-type': 'application/x-www-form-urlencoded'
        })
      })
      .on('error', (error) => done(error.toString()))
      .on('data', (data) => console.log(QEXT.name, data.toString()))
      .on('response', (response) => {
        console.log(`Successfully deployed extension ${QEXT.name}`, response.statusCode)
        done()
      })
  )
})

async.series(requests, (error) => {
  if (error) {
    console.log(error.red)
  } else {
    console.log('All files successfully deployed'.bold.green)
  }
})
