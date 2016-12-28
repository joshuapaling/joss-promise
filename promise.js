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
    if (state !== FULFILLED) {
      return // it's already FULFILLED or REJECTED
    }
    onFulfilleds.forEach(f => {
      setTimeout(function () {
        f(value)
      }, 0);
    })
  }

  this.resolve = function(val) {
    if (state !== PENDING) {
      console.log('inside resolve - BAILING OUT', state)
      return // it's already FULFILLED or REJECTED
    }
    console.log('inside resolve, about to change state from ', state)

    state = FULFILLED
    value = val
    console.log('about to call onFulfilleds')
    callOnFulfilledsIfNeeded()
  }

  this.reject = function(rsn) {
    if (state !== PENDING) {
      return // it's already FULFILLED or REJECTED
    }
    state = REJECTED
    reason = rsn

    onRejecteds.forEach(f => f(value))
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

    if (isFunction(onFulfilled)) {
      onFulfilleds.push(onFulfilled)
      if (state === FULFILLED ) {
        console.log('Calling single onFulfilled because state is ', state)
        result = onFulfilled(value)
      }
    }

    if (isFunction(onRejected)) {
      onRejecteds.push(onRejected)
      if (state === REJECTED) {
        result = onRejected(reason)
      }
    }

    const promise2 = new Promise()
    promise2.resolve(result)
    return promise2
  }
}

module.exports = Promise