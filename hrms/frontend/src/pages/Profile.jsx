import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { getMyProfile, updateEmployee, uploadProfileImage } from '../services/employeeService'

export default function Profile() {
  const { user } = useAuth()
  const [employee, setEmployee] = useState(null)
  const [form, setForm] = useState({})

  useEffect(() => {
    getMyProfile().then((emp) => {
      setEmployee(emp)
      setForm(emp || {})
    }).catch(() => {})
  }, [user])

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      await updateEmployee(employee.id, form)
      toast.success('Profile updated')
    } catch (err) { toast.error(err.response?.data?.message || 'Update failed') }
  }

  const handleImage = async (e) => {
    const file = e.target.files[0]
    if (!file || !employee) return
    try {
      const updated = await uploadProfileImage(employee.id, file)
      setEmployee(updated)
      toast.success('Profile image updated')
    } catch (err) { toast.error('Upload failed') }
  }

  if (!employee) return <p className="text-gray-400">Loading profile...</p>

  return (
    <div className="max-w-xl">
      <h2 className="text-xl font-semibold mb-6">My Profile</h2>
      <div className="card">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xl overflow-hidden">
            {employee.profileImageUrl
              ? <img src={employee.profileImageUrl} alt="" className="w-full h-full object-cover" />
              : employee.firstName?.[0]?.toUpperCase()}
          </div>
          <div>
            <label className="text-sm text-primary-600 cursor-pointer font-medium">
              Change photo
              <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
            </label>
          </div>
        </div>
        <form onSubmit={handleSave} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input className="input-field" value={form.firstName || ''} onChange={(e) => setForm({ ...form, firstName: e.target.value })} placeholder="First name" />
            <input className="input-field" value={form.lastName || ''} onChange={(e) => setForm({ ...form, lastName: e.target.value })} placeholder="Last name" />
          </div>
          <input className="input-field" value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" />
          <input className="input-field" value={form.address || ''} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Address" />
          <button type="submit" className="btn-primary w-full">Save Changes</button>
        </form>
      </div>
    </div>
  )
}
