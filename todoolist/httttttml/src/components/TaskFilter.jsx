const filters = ['All tasks', 'Active', 'Completed']

export default function TaskFilter({ activeFilter, onChange }) {
  return (
    <div className="filters" aria-label="Filter tasks">
      {filters.map((filter) => (
        <button
          className={activeFilter === filter ? 'filter active' : 'filter'}
          key={filter}
          type="button"
          onClick={() => onChange(filter)}
          aria-pressed={activeFilter === filter}
        >
          {filter}
        </button>
      ))}
    </div>
  )
}
