import axios from 'axios'

const client = axios.create({
  baseURL: 'http://localhost:3000/',
  json: true
})

export default {
  async execute (method, resource, data) {
    // inject the accessToken for each request
    // let accessToken = await Vue.prototype.$auth.getAccessToken()
    let accessToken = 'foo'
    return client({
      method,
      url: resource,
      data,
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(req => {
      return req.data
    })
  },
  getTrips (criteria) {
    // alert(`/trips?${criteria}`)
    return this.execute('get', `/trips?${criteria}`)
  },
  getSensorCfg (criteria) {
    // alert(`/sensor_cfg?${criteria}`)
    return this.execute('get', `/sensor_cfgs?${criteria}`)
  },
  getDevInfo (criteria) {
    // alert(`/dev_info?${criteria}`)
    return this.execute('get', `/dev_infos?${criteria}`)
  },
  getSensors (criteria) {
    // alert(`/sensors?${criteria}`)
    return this.execute('get', `/sensors?${criteria}`)
  },
  getSensorData (senid, sTime, eTime) {
    return this.execute('get', `/mongodb/sensor_data/s_data/${senid}/${sTime}/${eTime}`)
  }
//   getPost (id) {
//     return this.execute('get', `/posts/${id}`)
//   },
//   createPost (data) {
//     return this.execute('post', '/posts', data)
//   },
//   updatePost (id, data) {
//     return this.execute('put', `/posts/${id}`, data)
//   },
//   deletePost (id) {
//     return this.execute('delete', `/posts/${id}`)
//   }
}
