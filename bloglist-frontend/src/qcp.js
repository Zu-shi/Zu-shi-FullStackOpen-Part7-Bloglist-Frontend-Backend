import { QueryClient, QueryClientProvider } from 'react-query'
import App from './App'

export const qc = new QueryClient()
export const Qcp = () => {

  return (
    <QueryClientProvider client={qc}>
      <App />
    </QueryClientProvider>
  )
}