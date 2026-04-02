import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import './index.css'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('[App Crash]', error, info)
  }

  render() {
    if (this.state.hasError) {
      return React.createElement('div', {
        style: {
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0a0b',
          color: '#fafafa',
          fontFamily: 'Inter, -apple-system, sans-serif',
          padding: '24px',
          textAlign: 'center',
        }
      },
        React.createElement('h1', { style: { fontSize: '24px', fontWeight: 700, marginBottom: '12px' } }, 'Something went wrong'),
        React.createElement('p', { style: { fontSize: '14px', color: '#71717a', maxWidth: '400px', lineHeight: 1.6 } },
          this.state.error ? this.state.error.toString() : 'An unexpected error occurred.'
        ),
        React.createElement('button', {
          onClick: function() { window.location.reload() },
          style: {
            marginTop: '24px',
            padding: '12px 32px',
            borderRadius: '12px',
            background: '#6d28d9',
            color: 'white',
            border: 'none',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
          }
        }, 'Reload App')
      )
    }

    return this.props.children
  }
}

var root = document.getElementById('root')

if (root) {
  ReactDOM.createRoot(root).render(
    React.createElement(ErrorBoundary, null,
      React.createElement(ThemeProvider, null,
        React.createElement(AuthProvider, null,
          React.createElement(App, null)
        )
      )
    )
  )
} else {
  console.error('Root element not found')
}