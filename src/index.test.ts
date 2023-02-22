import { MCEvent } from '@managed-components/types'
import { eventHandler } from '.'

describe('Google Maps RWG event handler works correctly', async () => {
  const executedJS: any = []

  const fakeEvent = new Event('pageview', {}) as MCEvent
  fakeEvent.name = 'Google Maps RWG Mock MC'
  fakeEvent.payload = {
    baseDomain: 'test.com',
  }
  fakeEvent.client = {
    emitter: 'browser',
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
    language: 'en-US',
    referer: '',
    ip: '127.0.0.1',
    url: new URL('http://127.0.0.1:1337/?rwg_token=12345'),
    fetch: () => undefined,
    set: () => undefined,
    execute: jsString => {
      executedJS.push(jsString)
      return true
    },
    return: () => {},
    get: () => undefined,
    attachEvent: () => {},
    detachEvent: () => {},
  }

  await eventHandler('pageview', fakeEvent)

  it('sets the cookie correctly', async () => {
    const cookieJs = executedJS.find(
      (x: any) => x.includes('document.cookie') && x.includes('_rwg_token=')
    )

    expect(cookieJs).toBeTruthy()
    expect(cookieJs).toMatch(/'_rwg_token=12345(; ?|$)/)
    expect(cookieJs).toMatch(/; Max\-Age=2592000(; ?|$)/)
    expect(cookieJs).toMatch(/; Domain=test\.com(; ?|$)/)
  })
})
