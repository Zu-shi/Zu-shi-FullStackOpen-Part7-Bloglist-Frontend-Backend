import { QueryClient, QueryClientProvider } from 'react-query'
import App from './App'
import { BrowserRouter as Router, Routes } from 'react-router-dom'
export const qc = new QueryClient()
export const Qcp = () => {

  return (
    <Router>
      <QueryClientProvider client={qc}>
        <App />
      </QueryClientProvider>
    </Router>
  )
}