import { createRestClient } from '../restClient'
import { useState } from 'react'
import type { StcRest } from '../restHooksTypes'

const clientConfig : StcRest.ClientConfig = { verbose: true, getAccessToken: () => 'token' }
const serverConfig : StcRest.ServerConfig = { defaultBaseUrl: 'http://localhost:3000/api', timeout: 5000 }

export const useRestClient = () => {
  const [restClient, setRestClient] = useState(createRestClient(clientConfig, serverConfig))

  return { restClient, setRestClient }
}