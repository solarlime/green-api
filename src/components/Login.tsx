import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { authStore } from '../store/authStore'
import './Login.css'

const Login = observer(() => {
  const [idInstance, setIdInstance] = useState('')
  const [apiTokenInstance, setApiTokenInstance] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (idInstance && apiTokenInstance) {
      authStore.setCredentials(idInstance, apiTokenInstance)
      navigate('/')
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Green API Login</h1>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="idInstance">ID Instance</label>
            <input
              type="text"
              id="idInstance"
              value={idInstance}
              onChange={(e) => setIdInstance(e.target.value)}
              placeholder="Enter your ID Instance"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="apiTokenInstance">API Token Instance</label>
            <input
              type="password"
              id="apiTokenInstance"
              value={apiTokenInstance}
              onChange={(e) => setApiTokenInstance(e.target.value)}
              placeholder="Enter your API Token"
              required
            />
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  )
})

export default Login
