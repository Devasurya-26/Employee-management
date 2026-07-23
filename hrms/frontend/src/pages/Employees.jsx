import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, Search, Download } from 'lucide-react'
import Modal from '../components/Modal'
import Pagination from '../components/Pagination'
import { getEmployees, createEmployee, updateEmployee, deleteEmployee, exportEmployeesExcel } from '../services/employeeService'
import { getDepartments } from '../services/departmentService'
import { getDesignations } from '../services/designationService'

const emptyForm = { firstName: '', lastName: '', employeeCode: '', phone: '', address: '', gender: '', departmentId: '', designationId: '' }

export default function Employees() {
  const [data, setData] = useState({ content: [], totalPages: 0 })
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [departments, setDepartments] = useState([])
  const [designations, setDesignations] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)

  const load = () => getEmployees({ page, size: 8, search }).then(setData).catch(() => {})

  useEffect(() => { load() }, [page, search])
  useEffect(() => {
    getDepartments({ size: 100 }).then((d) => setDepartments(d.content))
    getDesignations({ size: 100 }).then((d) => setDesignations(d.content))
  }, [])

  const openCreate = () => { setForm(emptyForm); setEditingId(null); setModalOpen(true) }
  const openEdit = (emp) => {
    setForm({ ...emp, departmentId: emp.departmentId || '', designationId: emp.designationId || '' })
    setEditingId(emp.id); setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await updateEmployee(editingId, form)
        toast.success('Employee updated')
      } else {
        await createEmployee(form)
        toast.success('Employee created')
      }
      setModalOpen(false)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this employee?')) return
    await deleteEmployee(id)
    toast.success('Employee deleted')
    load()
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Employees</h2>
          <p className="page-subtitle">Manage your workforce</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => exportEmployeesExcel().catch(() => toast.error('Export failed'))} className="btn-secondary flex items-center gap-2">
            <Download size={16}/> Export Excel
          </button>
          <button onClick={openCreate} className="btn-primary flex items-center gap-2"><Plus size={16}/> Add Employee</button>
        </div>
      </div>

      <div className="card mb-4 flex items-center gap-2">
        <Search size={16} className="text-gray-400" />
        <input className="input-field border-0 focus:ring-0" placeholder="Search by name..."
               value={search} onChange={(e) => { setSearch(e.target.value); setPage(0) }} />
      </div>

      <div className="card p-0 overflow-hidden">
        <table className="table-base">
          <thead><tr>
            <th>Name</th><th>Code</th><th>Department</th><th>Designation</th><th>Phone</th><th></th>
          </tr></thead>
          <tbody>
            {data.content?.map((emp) => (
              <tr key={emp.id}>
                <td className="font-medium">{emp.firstName} {emp.lastName}</td>
                <td>{emp.employeeCode || '-'}</td>
                <td>{emp.departmentName || '-'}</td>
                <td>{emp.designationTitle || '-'}</td>
                <td>{emp.phone || '-'}</td>
                <td>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(emp)} className="text-gray-400 hover:text-primary-600"><Pencil size={16}/></button>
                    <button onClick={() => handleDelete(emp.id)} className="text-gray-400 hover:text-red-600"><Trash2 size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
            {data.content?.length === 0 && (
              <tr><td colSpan={6} className="text-center text-gray-400 py-8">No employees found</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination page={page} totalPages={data.totalPages} onChange={setPage} />

      {modalOpen && (
        <Modal title={editingId ? 'Edit Employee' : 'Add Employee'} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input className="input-field" placeholder="First name" value={form.firstName}
                     onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
              <input className="input-field" placeholder="Last name" value={form.lastName || ''}
                     onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
            </div>
            <input className="input-field" placeholder="Employee code" value={form.employeeCode || ''}
                   onChange={(e) => setForm({ ...form, employeeCode: e.target.value })} />
            <input className="input-field" placeholder="Phone" value={form.phone || ''}
                   onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <input className="input-field" placeholder="Address" value={form.address || ''}
                   onChange={(e) => setForm({ ...form, address: e.target.value })} />
            <div className="grid grid-cols-2 gap-3">
              <select className="input-field" value={form.departmentId}
                      onChange={(e) => setForm({ ...form, departmentId: e.target.value })}>
                <option value="">Department</option>
                {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
              <select className="input-field" value={form.designationId}
                      onChange={(e) => setForm({ ...form, designationId: e.target.value })}>
                <option value="">Designation</option>
                {designations.map((d) => <option key={d.id} value={d.id}>{d.title}</option>)}
              </select>
            </div>
            <button type="submit" className="btn-primary w-full">{editingId ? 'Update' : 'Create'}</button>
          </form>
        </Modal>
      )}
    </div>
  )
}
