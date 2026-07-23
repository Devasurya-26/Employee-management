import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import Modal from '../components/Modal'
import Pagination from '../components/Pagination'
import { getDepartments, createDepartment, updateDepartment, deleteDepartment } from '../services/departmentService'

export default function Departments() {
  const [data, setData] = useState({ content: [], totalPages: 0 })
  const [page, setPage] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ name: '', description: '' })
  const [editingId, setEditingId] = useState(null)

  const load = () => getDepartments({ page, size: 8 }).then(setData).catch(() => {})
  useEffect(() => { load() }, [page])

  const openCreate = () => { setForm({ name: '', description: '' }); setEditingId(null); setModalOpen(true) }
  const openEdit = (d) => { setForm(d); setEditingId(d.id); setModalOpen(true) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) { await updateDepartment(editingId, form); toast.success('Updated') }
      else { await createDepartment(form); toast.success('Created') }
      setModalOpen(false); load()
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed') }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this department?')) return
    await deleteDepartment(id); toast.success('Deleted'); load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-xl font-semibold">Departments</h2><p className="text-gray-500 text-sm">Organize your teams</p></div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2"><Plus size={16}/> Add Department</button>
      </div>
      <div className="card p-0 overflow-hidden">
        <table className="table-base">
          <thead><tr><th>Name</th><th>Description</th><th></th></tr></thead>
          <tbody>
            {data.content?.map((d) => (
              <tr key={d.id}>
                <td className="font-medium">{d.name}</td>
                <td>{d.description || '-'}</td>
                <td><div className="flex gap-2">
                  <button onClick={() => openEdit(d)} className="text-gray-400 hover:text-primary-600"><Pencil size={16}/></button>
                  <button onClick={() => handleDelete(d.id)} className="text-gray-400 hover:text-red-600"><Trash2 size={16}/></button>
                </div></td>
              </tr>
            ))}
            {data.content?.length === 0 && <tr><td colSpan={3} className="text-center text-gray-400 py-8">No departments found</td></tr>}
          </tbody>
        </table>
      </div>
      <Pagination page={page} totalPages={data.totalPages} onChange={setPage} />
      {modalOpen && (
        <Modal title={editingId ? 'Edit Department' : 'Add Department'} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input className="input-field" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <textarea className="input-field" placeholder="Description" value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <button type="submit" className="btn-primary w-full">{editingId ? 'Update' : 'Create'}</button>
          </form>
        </Modal>
      )}
    </div>
  )
}
