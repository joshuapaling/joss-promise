function Promise() {
  const pending   = 'pending'
  const rejected  = 'rejected'
  const fulfilled = 'fulfilled'
  let state = pending
  let value = undefined

  this.resolve = function(value) {
    console.log('RESOVLED with ', value)
  }

  this.reject = function(value) {
    console.log('REJECT with ', value)
  }

  this.then = function(onFulfilled, onRejected) {
    console.log('THEN called')
    onFulfilled()
    onRejected()
  }
}

module.exports = Promise