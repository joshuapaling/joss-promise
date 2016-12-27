function Promise() {
  const PENDING   = 'PENDING'
  const REJECTED  = 'REJECTED'
  const FULFILLED = 'FULFILLED'
  let state = PENDING
  let value = undefined
  let reason = undefined

  isFunction = function(val) {
    return (typeof val === 'function')
  }

  this.resolve = function(val) {
    if (state !== PENDING) {
      return // it's already FULFILLED or REJECTED
    } else {
      state = FULFILLED
      value = val
    }
  }

  this.reject = function(rsn) {
    if (state !== PENDING) {
      return // it's already FULFILLED or REJECTED
    } else {
      state = REJECTED
      reason = rsn
    }
  }

  // then must return a promise [3.3].
  // promise2 = promise1.then(onFulfilled, onRejected);
  // If either onFulfilled or onRejected returns a value x, run the Promise Resolution Procedure [[Resolve]](promise2, x).
  // If either onFulfilled or onRejected throws an exception e, promise2 must be REJECTED with e as the reason.
  // If onFulfilled is not a function and promise1 is FULFILLED, promise2 must be FULFILLED with the same value as promise1.
  // If onRejected is not a function and promise1 is REJECTED, promise2 must be REJECTED with the same reason as promise1.
  this.then = function(onFulfilled, onRejected) {
    let result
    // If onFulfilled is not a function and promise1 is FULFILLED, promise2 must be FULFILLED with the same value as promise1.
    if (state === FULFILLED && !isFunction(onFulfilled)) {
      const promise2 = new Promise()
      promise2.resolve(value)
      return promise2
    }

    // If onRejected is not a function and promise1 is REJECTED, promise2 must be REJECTED with the same reason as promise1.
    if (state === REJECTED && !isFunction(onRejected)) {
      const promise2 = new Promise()
      promise2.reject(reason)
      return promise2
    }

    if (state === FULFILLED && isFunction(onFulfilled)) {
      result = onFulfilled(value)
    } else if (state === REJECTED && isFunction(onRejected)) {
      result = onRejected(reason)
    }

    const promise2 = new Promise()
    promise2.resolve(result)
    return promise2
  }
}

module.exports = Promise