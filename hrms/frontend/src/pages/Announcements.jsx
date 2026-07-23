import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Plus, Trash2, Megaphone } from 'lucide-react'
import Modal from '../components/Modal'
import { useAuth } from '../context/AuthContext'
import { getAnnouncements, createAnnouncement, deleteAnnouncement } from '../services/announcementService'

export default function Announcements() {
  const { isAdmin } = useAuth()
  const [items, setItems] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ title: '', content: '' })

  const load = () => getAnnouncements({ size: 20 }).then((d) => setItems(d.content)).catch(() => {})
  useEffect(() => { load() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await createAnnouncement(form)
      toast.success('Announcement posted')
      setModalOpen(false); setForm({ title: '', content: '' }); load()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to post') }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this announcement?')) return
    await deleteAnnouncement(id); toast.success('Deleted'); load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-xl font-semibold">Announcements</h2><p className="text-gray-500 text-sm">Company-wide updates</p></div>
        {isAdmin && <button onClick={() => setModalOpen(true)} className="btn-primary flex items-center gap-2"><Plus size={16}/> New Announcement</button>}
      </div>
      <div className="space-y-3">
        {items.map((a) => (
          <div key={a.id} className="card flex justify-between items-start">
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center shrink-0"><Megaphone size={16}/></div>
              <div>
                <h4 className="font-semibold text-sm">{a.title}</h4>
                <p className="text-sm text-gray-500 mt-1">{a.content}</p>
                <p className="text-xs text-gray-400 mt-2">{new Date(a.createdAt).toLocaleString()}</p>
              </div>
            </div>
            {isAdmin && <button onClick={() => handleDelete(a.id)} className="text-gray-400 hover:text-red-600"><Trash2 size={16}/></button>}
          </div>
        ))}
        {items.length === 0 && <div className="card text-center text-gray-400 py-8">No announcements yet</div>}
      </div>
      {modalOpen && (
        <Modal title="New Announcement" onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input className="input-field" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            <textarea className="input-field" rows={4} placeholder="Content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required />
            <button type="submit" className="btn-primary w-full">Post</button>
          </form>
        </Modal>
      )}
    </div>
  )
}
