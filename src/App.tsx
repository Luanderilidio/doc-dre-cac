import { GoogleOAuthProvider } from '@react-oauth/google'
import './App.css'
import AppRoutes from './routes/router'



function App() {
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;


  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>

      <AppRoutes />
    </GoogleOAuthProvider>
  )
}

export default App
