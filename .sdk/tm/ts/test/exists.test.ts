
import { test, describe } from 'node:test'
import { equal } from 'node:assert'


import { MovioddsOddsSDK } from '..'


describe('exists', async () => {

  test('test-mode', () => {
    const testsdk = MovioddsOddsSDK.test()
    equal(testsdk instanceof MovioddsOddsSDK, true,
      'MovioddsOddsSDK.test() must return a client synchronously')
  })

})
