import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { StartupErrorScreen } from './components/StartupErrorScreen'

const root = createRoot(document.getElementById('root')!)

// App and AuthProvider are imported dynamically so that a configuration
// failure inside src/lib/firebase.ts is caught here. A static import would
// throw while the module graph loads, leaving the page completely blank.
try {
  const [{ default: App }, { AuthProvider }, { ErrorBoundary }] = await Promise.all([
    import('./App.tsx'),
    import('./contexts/AuthProvider'),
    import('./components/ErrorBoundary'),
  ])

  root.render(
    <StrictMode>
      <ErrorBoundary>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ErrorBoundary>
    </StrictMode>,
  )
} catch (error) {
  console.error('Aivio failed to start:', error)
  root.render(
    <StrictMode>
      <StartupErrorScreen
        message={error instanceof Error ? error.message : 'Unknown startup error.'}
      />
    </StrictMode>,
  )
}
