import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Plus, Check, X } from 'lucide-react'
import Modal from '../components/Modal'
import Pagination from '../components/Pagination'
import { useAuth } from '../context/AuthContext'
import { getAllLeaves, getMyLeaves, applyLeave, updateLeaveStatus, cancelLeave } from '../services/leaveService'

const statusColor = {
  PENDING: 'bg-amber-50 text-amber-600',
  APPROVED: 'bg-emerald-50 text-emerald-600',
  REJECTED: 'bg-red-50 text-red-600',
  CANCELLED: 'bg-gray-100 text-gray-500',
}

export default function Leaves() {
  const { isAdmin } = useAuth()
  const [data, setData] = useState({ content: [], totalPages: 0 })
  const [page, setPage] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ startDate: '', endDate: '', leaveType: 'CASUAL', reason: '' })

  const load = () => {
    const fetcher = isAdmin ? getAllLeaves : getMyLeaves
    fetcher({ page, size: 8 }).then(setData).catch(() => {})
  }
  useEffect(() => { load() }, [page, isAdmin])

  const handleApply = async (e) => {
    e.preventDefault()
    try {
      await applyLeave(form)
      toast.success('Leave request submitted')
      setModalOpen(false)
      setForm({ startDate: '', endDate: '', leaveType: 'CASUAL', reason: '' })
      load()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to apply') }
  }

  const handleDecision = async (id, status) => {
    await updateLeaveStatus(id, status)
    toast.success(`Leave ${status.toLowerCase()}`)
    load()
  }

  const handleCancel = async (id) => {
    if (!confirm('Cancel this leave request?')) return
    await cancelLeave(id); toast.success('Leave cancelled'); load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">{isAdmin ? 'Leave Approvals' : 'My Leaves'}</h2>
          <p className="text-gray-500 text-sm">{isAdmin ? 'Review and approve employee leave requests' : 'Apply for and track your leave'}</p>
        </div>
        {!isAdmin && <button onClick={() => setModalOpen(true)} className="btn-primary flex items-center gap-2"><Plus size={16}/> Apply Leave</button>}
      </div>

      <div className="card p-0 overflow-hidden">
        <table className="table-base">
          <thead><tr>
            {isAdmin && <th>Employee</th>}
            <th>Type</th><th>From</th><th>To</th><th>Reason</th><th>Status</th><th></th>
          </tr></thead>
          <tbody>
            {data.content?.map((l) => (
              <tr key={l.id}>
                {isAdmin && <td>{l.employee?.firstName} {l.employee?.lastName}</td>}
                <td>{l.leaveType}</td>
                <td>{l.startDate}</td>
                <td>{l.endDate}</td>
                <td className="max-w-xs truncate">{l.reason || '-'}</td>
                <td><span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[l.status]}`}>{l.status}</span></td>
                <td>
                  {isAdmin && l.status === 'PENDING' && (
                    <div className="flex gap-2">
                      <button onClick={() => handleDecision(l.id, 'APPROVED')} className="text-emerald-500 hover:text-emerald-700"><Check size={16}/></button>
                      <button onClick={() => handleDecision(l.id, 'REJECTED')} className="text-red-500 hover:text-red-700"><X size={16}/></button>
                    </div>
                  )}
                  {!isAdmin && l.status === 'PENDING' && (
                    <button onClick={() => handleCancel(l.id)} className="text-gray-400 hover:text-red-600 text-xs">Cancel</button>
                  )}
                </td>
              </tr>
            ))}
            {data.content?.length === 0 && <tr><td colSpan={isAdmin ? 7 : 6} className="text-center text-gray-400 py-8">No leave requests found</td></tr>}
          </tbody>
        </table>
      </div>
      <Pagination page={page} totalPages={data.totalPages} onChange={setPage} />

      {modalOpen && (
        <Modal title="Apply for Leave" onClose={() => setModalOpen(false)}>
          <form onSubmit={handleApply} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs text-gray-500">Start date</label>
                <input type="date" className="input-field" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required /></div>
              <div><label className="text-xs text-gray-500">End date</label>
                <input type="date" className="input-field" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} required /></div>
            </div>
            <select className="input-field" value={form.leaveType} onChange={(e) => setForm({ ...form, leaveType: e.target.value })}>
              <option value="CASUAL">Casual Leave</option>
              <option value="SICK">Sick Leave</option>
              <option value="EARNED">Earned Leave</option>
              <option value="UNPAID">Unpaid Leave</option>
            </select>
            <textarea className="input-field" placeholder="Reason" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
            <button type="submit" className="btn-primary w-full">Submit Request</button>
          </form>
        </Modal>
      )}
    </div>
  )
}
