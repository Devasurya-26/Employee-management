import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', firstName: '', lastName: '' })
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await register(form)
      toast.success('Account created. Please sign in.')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-white px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary-700">Create Account</h1>
          <p className="text-gray-500 text-sm mt-1">Join the HRMS as an employee</p>
        </div>
        <form onSubmit={handleSubmit} className="card space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input name="firstName" placeholder="First name" className="input-field" onChange={handleChange} required />
            <input name="lastName" placeholder="Last name" className="input-field" onChange={handleChange} />
          </div>
          <input name="username" placeholder="Username" className="input-field" onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email" className="input-field" onChange={handleChange} required />
          <input name="password" type="password" placeholder="Password" className="input-field" onChange={handleChange} required />
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Creating...' : 'Create Account'}
          </button>
          <p className="text-center text-sm text-gray-500">
            Already have an account? <Link to="/login" className="text-primary-600 font-medium">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
