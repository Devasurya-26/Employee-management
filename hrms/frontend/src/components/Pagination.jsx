export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null
  return (
    <div className="flex items-center justify-end gap-2 mt-4 text-sm">
      <button className="btn-secondary px-3 py-1" disabled={page === 0} onClick={() => onChange(page - 1)}>Prev</button>
      <span className="text-gray-500">Page {page + 1} of {totalPages}</span>
      <button className="btn-secondary px-3 py-1" disabled={page >= totalPages - 1} onClick={() => onChange(page + 1)}>Next</button>
    </div>
  )
}
