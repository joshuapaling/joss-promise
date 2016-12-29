function Promise() {
  const PENDING   = 'PENDING'
  const REJECTED  = 'REJECTED'
  const FULFILLED = 'FULFILLED'
  let state = PENDING
  const onFulfilleds = [] // array of functions to call on fulfillment
  const onRejecteds  = [] // array of functions to call on rejection
  let value = undefined
  let reason = undefined

  const isFunction = function(val) {
    return (typeof val === 'function')
  }

  const callOnFulfilledsIfNeeded = function () {
    if (state !== FULFILLED) return
    onFulfilleds.forEach(o => {
      setTimeout(function() {
        if (o.called) return // call each function once only
        try {
          o.called = true
          result = o.func.call(undefined, value)
          o.promise.resolve(result)
        } catch (e) {
          o.promise.reject(e)
        }
      }, 0);
    })
  }

  const callOnRejectedsIfNeeded = function () {
    if (state !== REJECTED) return
    onRejecteds.forEach(o => {
      setTimeout(function() {
        if (o.called) return // call each function once only
        try {
          o.called = true
          result = o.func.call(undefined, reason)
          o.promise.resolve(result)
        } catch (e) {
          o.promise.reject(e)
        }
      }, 0);
    })
  }

  this.resolve = function(val) {
    if (state !== PENDING) {
      return // it's already FULFILLED or REJECTED
    }

    state = FULFILLED
    value = val
    callOnFulfilledsIfNeeded()
  }

  this.reject = function(rsn) {
    if (state !== PENDING) {
      return // it's already FULFILLED or REJECTED
    }
    state = REJECTED
    reason = rsn

    callOnRejectedsIfNeeded()
  }

  // then must return a promise [3.3].
  // promise2 = promise1.then(onFulfilled, onRejected);
  // If either onFulfilled or onRejected returns a value x, run the Promise Resolution Procedure [[Resolve]](promise2, x).
  // If either onFulfilled or onRejected throws an exception e, promise2 must be REJECTED with e as the reason.
  // If onFulfilled is not a function and promise1 is FULFILLED, promise2 must be FULFILLED with the same value as promise1.
  // If onRejected is not a function and promise1 is REJECTED, promise2 must be REJECTED with the same reason as promise1.
  this.then = function(onFulfilled, onRejected) {
    let result
    const promise2 = new Promise()
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

    if (isFunction(onFulfilled)) {
      onFulfilleds.push({
        promise: promise2,
        func: onFulfilled,
        called: false
      })
      callOnFulfilledsIfNeeded()
    }

    if (isFunction(onRejected)) {
      onRejecteds.push({
        promise: promise2,
        func: onRejected,
        called: false
      })
      callOnRejectedsIfNeeded()
    }

    return promise2
  }
}

module.exports = Promise