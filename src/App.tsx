import { BrowserRouter } from 'react-router-dom'
import { AppRouter } from './app/AppRouter'
import { ErrorBoundary } from './app/ErrorBoundary'

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
