import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Plus, CheckCircle2, IndianRupee } from 'lucide-react'
import Modal from '../components/Modal'
import Pagination from '../components/Pagination'
import { useAuth } from '../context/AuthContext'
import { getAllSalaries, getMySalaries, generateSalary, markSalaryPaid } from '../services/salaryService'
import { getEmployees } from '../services/employeeService'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

const statusColor = {
  PENDING: 'bg-amber-50 text-amber-600',
  PAID: 'bg-emerald-50 text-emerald-600',
}

export default function Payroll() {
  const { isAdmin } = useAuth()
  const [data, setData] = useState({ content: [], totalPages: 0 })
  const [page, setPage] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const [employees, setEmployees] = useState([])
  const now = new Date()
  const [form, setForm] = useState({
    employeeId: '', month: now.getMonth() + 1, year: now.getFullYear(),
    basicSalary: '', allowances: '0', deductions: '0'
  })

  const load = () => {
    const fetcher = isAdmin ? getAllSalaries : getMySalaries
    fetcher({ page, size: 8 }).then(setData).catch(() => {})
  }
  useEffect(() => { load() }, [page, isAdmin])
  useEffect(() => { if (isAdmin) getEmployees({ size: 200 }).then((d) => setEmployees(d.content)) }, [isAdmin])

  const handleGenerate = async (e) => {
    e.preventDefault()
    try {
      await generateSalary(form)
      toast.success('Salary record generated')
      setModalOpen(false)
      load()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to generate') }
  }

  const handleMarkPaid = async (id) => {
    await markSalaryPaid(id)
    toast.success('Marked as paid')
    load()
  }

  const netPreview = (Number(form.basicSalary) || 0) + (Number(form.allowances) || 0) - (Number(form.deductions) || 0)

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">{isAdmin ? 'Payroll' : 'My Salary'}</h2>
          <p className="page-subtitle">{isAdmin ? 'Generate and manage monthly salaries' : 'Your salary history'}</p>
        </div>
        {isAdmin && (
          <button onClick={() => setModalOpen(true)} className="btn-primary flex items-center gap-2">
            <Plus size={16}/> Generate Salary
          </button>
        )}
      </div>

      <div className="card p-0 overflow-hidden">
        <table className="table-base">
          <thead><tr>
            {isAdmin && <th>Employee</th>}
            <th>Month</th><th>Basic</th><th>Allowances</th><th>Deductions</th><th>Net</th><th>Status</th>{isAdmin && <th></th>}
          </tr></thead>
          <tbody>
            {data.content?.map((s) => (
              <tr key={s.id}>
                {isAdmin && <td className="font-medium">{s.employeeName} <span className="text-gray-400 text-xs">({s.employeeCode})</span></td>}
                <td>{MONTHS[s.month - 1]} {s.year}</td>
                <td>₹{Number(s.basicSalary).toLocaleString('en-IN')}</td>
                <td className="text-emerald-600">+₹{Number(s.allowances).toLocaleString('en-IN')}</td>
                <td className="text-red-500">-₹{Number(s.deductions).toLocaleString('en-IN')}</td>
                <td className="font-semibold">₹{Number(s.netSalary).toLocaleString('en-IN')}</td>
                <td><span className={`badge ${statusColor[s.status]}`}>{s.status}</span></td>
                {isAdmin && (
                  <td>
                    {s.status === 'PENDING' && (
                      <button onClick={() => handleMarkPaid(s.id)} className="text-emerald-500 hover:text-emerald-700" title="Mark as paid">
                        <CheckCircle2 size={16}/>
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
            {data.content?.length === 0 && (
              <tr><td colSpan={isAdmin ? 8 : 6} className="text-center text-gray-400 py-8">No salary records found</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination page={page} totalPages={data.totalPages} onChange={setPage} />

      {modalOpen && (
        <Modal title="Generate Salary" onClose={() => setModalOpen(false)}>
          <form onSubmit={handleGenerate} className="space-y-3">
            <select className="input-field" value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} required>
              <option value="">Select employee</option>
              {employees.map((e) => <option key={e.id} value={e.id}>{e.firstName} {e.lastName} ({e.employeeCode})</option>)}
            </select>
            <div className="grid grid-cols-2 gap-3">
              <select className="input-field" value={form.month} onChange={(e) => setForm({ ...form, month: Number(e.target.value) })}>
                {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
              </select>
              <input type="number" className="input-field" placeholder="Year" value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} />
            </div>
            <div className="relative">
              <IndianRupee size={14} className="absolute left-3 top-3.5 text-gray-400" />
              <input type="number" className="input-field pl-8" placeholder="Basic salary" value={form.basicSalary}
                     onChange={(e) => setForm({ ...form, basicSalary: e.target.value })} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input type="number" className="input-field" placeholder="Allowances" value={form.allowances}
                     onChange={(e) => setForm({ ...form, allowances: e.target.value })} />
              <input type="number" className="input-field" placeholder="Deductions" value={form.deductions}
                     onChange={(e) => setForm({ ...form, deductions: e.target.value })} />
            </div>
            <div className="bg-primary-50 rounded-xl px-4 py-3 text-sm flex justify-between">
              <span className="text-gray-600">Net Salary</span>
              <span className="font-bold text-primary-700">₹{netPreview.toLocaleString('en-IN')}</span>
            </div>
            <button type="submit" className="btn-primary w-full">Generate</button>
          </form>
        </Modal>
      )}
    </div>
  )
}
