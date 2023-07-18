import { ComponentSettings, Manager, MCEvent } from '@managed-components/types'

export const eventHandler = async (eventType: string, event: MCEvent) => {
  const { client } = event
  const rwg_token = client.url.searchParams.get('rwg_token')
  if (rwg_token) {
    // Generate Cookie with max-age of 2592000 seconds (30 days)
    const cookie = `_rwg_token=${encodeURIComponent(
      rwg_token
    )}; Max-Age=2592000; Path=/;`

    client.execute("document.cookie = '" + cookie.replaceAll("'", "\\'") + "';")
  }
}

export default async function (manager: Manager, _settings: ComponentSettings) {
  manager.addEventListener('pageview', event => {
    eventHandler('Pageview', event)
  })
}
