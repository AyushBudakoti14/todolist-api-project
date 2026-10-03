export default function Pagination({ page, pageCount, onChange }) {
  if (pageCount <= 1) return null

  return (
    <nav className="pagination" aria-label="Task pages">
      <button type="button" onClick={() => onChange(page - 1)} disabled={page === 1}>
        Previous
      </button>
      <span>Page {page} of {pageCount}</span>
      <button type="button" onClick={() => onChange(page + 1)} disabled={page === pageCount}>
        Next
      </button>
    </nav>
  )
}
