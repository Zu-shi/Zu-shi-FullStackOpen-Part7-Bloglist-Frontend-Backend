import { QueryClient, QueryClientProvider } from 'react-query'
import App from './App'

export const Qcp = () => {
  const qc = new QueryClient()

  return (
    <QueryClientProvider client={qc}>
      <App />
    </QueryClientProvider>
  )
}