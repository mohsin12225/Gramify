import { useAuth } from './context/AuthContext'
import LoginScreen from './components/LoginScreen'
import MainApp from './components/MainApp'
import SplashScreen from './components/SplashScreen'

export default function App() {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return <SplashScreen />
  return isAuthenticated ? <MainApp /> : <LoginScreen />
}