import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { LogIn, LogOut } from 'lucide-react'
import Pagination from '../components/Pagination'
import { checkIn, checkOut, getEmployeeAttendance } from '../services/attendanceService'
import { useAuth } from '../context/AuthContext'
import { getMyProfile } from '../services/employeeService'

export default function Attendance() {
  const { user } = useAuth()
  const [records, setRecords] = useState({ content: [], totalPages: 0 })
  const [page, setPage] = useState(0)
  const [employeeId, setEmployeeId] = useState(null)

  useEffect(() => {
    getMyProfile().then((emp) => setEmployeeId(emp.id)).catch(() => {})
  }, [user])

  useEffect(() => {
    if (employeeId) getEmployeeAttendance(employeeId, { page, size: 8 }).then(setRecords).catch(() => {})
  }, [employeeId, page])

  const handleCheckIn = async () => {
    try { await checkIn(); toast.success('Checked in'); if (employeeId) getEmployeeAttendance(employeeId, { page, size: 8 }).then(setRecords) }
    catch (err) { toast.error(err.response?.data?.message || 'Check-in failed') }
  }
  const handleCheckOut = async () => {
    try { await checkOut(); toast.success('Checked out'); if (employeeId) getEmployeeAttendance(employeeId, { page, size: 8 }).then(setRecords) }
    catch (err) { toast.error(err.response?.data?.message || 'Check-out failed') }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-xl font-semibold">My Attendance</h2><p className="text-gray-500 text-sm">Track your daily check-in/check-out</p></div>
        <div className="flex gap-2">
          <button onClick={handleCheckIn} className="btn-primary flex items-center gap-2"><LogIn size={16}/> Check In</button>
          <button onClick={handleCheckOut} className="btn-secondary flex items-center gap-2"><LogOut size={16}/> Check Out</button>
        </div>
      </div>
      <div className="card p-0 overflow-hidden">
        <table className="table-base">
          <thead><tr><th>Date</th><th>Check In</th><th>Check Out</th><th>Status</th></tr></thead>
          <tbody>
            {records.content?.map((r) => (
              <tr key={r.id}>
                <td>{r.date}</td><td>{r.checkIn || '-'}</td><td>{r.checkOut || '-'}</td><td>{r.status}</td>
              </tr>
            ))}
            {records.content?.length === 0 && <tr><td colSpan={4} className="text-center text-gray-400 py-8">No attendance records yet</td></tr>}
          </tbody>
        </table>
      </div>
      <Pagination page={page} totalPages={records.totalPages} onChange={setPage} />
    </div>
  )
}
