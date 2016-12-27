const Promise = require('../promise')

module.exports = {
  deferred: function() {
    const promise = new Promise()
    return {
      promise: promise,
      resolve: function(value) {
        promise.resolve(value)
      },
      reject: function(reason) {
        promise.reject(reason)
      }
    }
  }
}