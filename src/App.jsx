import { useAuth } from './context/AuthContext'
import LoginScreen from './components/LoginScreen'
import MainApp from './components/MainApp'
import SplashScreen from './components/SplashScreen'

export default function App() {
  var auth = useAuth()

  if (!auth) {
    return null
  }

  if (auth.loading) {
    return <SplashScreen />
  }

  if (auth.isAuthenticated) {
    return <MainApp />
  }

  return <LoginScreen />
}