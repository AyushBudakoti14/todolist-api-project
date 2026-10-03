export default function TaskCard({ task, onToggle, onDelete }) {
  return (
    <li className={task.completed ? 'task completed' : 'task'}>
      <button
        className="check-button"
        type="button"
        onClick={() => onToggle(task)}
        aria-label={task.completed ? `Mark ${task.title} as active` : `Complete ${task.title}`}
        aria-pressed={task.completed}
      >
        {task.completed && (
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="m3 8 3.2 3.2L13 4.8" />
          </svg>
        )}
      </button>
      <span className="task-title">{task.title}</span>
      <button
        className="delete-button"
        type="button"
        onClick={() => onDelete(task.id)}
        aria-label={`Delete ${task.title}`}
      >
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <path d="M4.5 6h11M8 6V4.5h4V6m2 0-.6 9H6.6L6 6m2.4 2.5v4m3.2-4v4" />
        </svg>
      </button>
    </li>
  )
}
