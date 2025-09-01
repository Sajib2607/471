import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const LoginModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('admin') // 'admin' or 'user'
  const [isLoading, setIsLoading] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  
  // Admin login state
  const [adminEmail, setAdminEmail] = useState('')
  const [adminPassword, setAdminPassword] = useState('')
  
  // User login/register state
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [userPassword, setUserPassword] = useState('')
  
  const { axios, setToken, navigate } = useAppContext()

  const handleAdminLogin = async (e) => {
    e.preventDefault()
    if (!adminEmail || !adminPassword) {
      return toast.error('Please fill all fields')
    }

    try {
      setIsLoading(true)
      const { data } = await axios.post('/api/admin/login', {
        email: adminEmail,
        password: adminPassword
      })

      if (data.success) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('userType', 'admin')
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
        setToken(data.token)
        toast.success('Admin login successful')
        navigate('/admin')
        onClose()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUserLogin = async (e) => {
    e.preventDefault()
    if (!userEmail || !userPassword) {
      return toast.error('Please fill all fields')
    }

    try {
      setIsLoading(true)
      const { data } = await axios.post('/api/user/login', {
        email: userEmail,
        password: userPassword
      })

      if (data.success) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('userType', 'user')
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
        setToken(data.token)
        toast.success('User login successful')
        navigate('/user')
        onClose()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUserRegister = async (e) => {
    e.preventDefault()
    if (!userName || !userEmail || !userPassword) {
      return toast.error('Please fill all fields')
    }

    try {
      setIsLoading(true)
      const { data } = await axios.post('/api/user/register', {
        name: userName,
        email: userEmail,
        password: userPassword
      })

      if (data.success) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('userType', 'user')
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
        setToken(data.token)
        toast.success('Registration successful')
        navigate('/user')
        onClose()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Login</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex mb-4 border-b">
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex-1 py-2 px-4 text-center ${
              activeTab === 'admin'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500'
            }`}
          >
            Admin Login
          </button>
          <button
            onClick={() => setActiveTab('user')}
            className={`flex-1 py-2 px-4 text-center ${
              activeTab === 'user'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500'
            }`}
          >
            User Login
          </button>
        </div>

        {/* Admin Login Form */}
        {activeTab === 'admin' && (
          <form onSubmit={handleAdminLogin}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter admin email"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter password"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 disabled:opacity-50"
            >
              {isLoading ? 'Logging in...' : 'Admin Login'}
            </button>
          </form>
        )}

        {/* User Login/Register Form */}
        {activeTab === 'user' && (
          <div>
            <div className="flex mb-4">
              <button
                onClick={() => setIsRegistering(false)}
                className={`flex-1 py-2 px-4 text-center ${
                  !isRegistering
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-700'
                } rounded-l-md`}
              >
                Login
              </button>
              <button
                onClick={() => setIsRegistering(true)}
                className={`flex-1 py-2 px-4 text-center ${
                  isRegistering
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-700'
                } rounded-r-md`}
              >
                Register
              </button>
            </div>

            {!isRegistering ? (
              <form onSubmit={handleUserLogin}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={userPassword}
                    onChange={(e) => setUserPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 disabled:opacity-50"
                >
                  {isLoading ? 'Logging in...' : 'User Login'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleUserRegister}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={userPassword}
                    onChange={(e) => setUserPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 disabled:opacity-50"
                >
                  {isLoading ? 'Registering...' : 'Register'}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default LoginModal 