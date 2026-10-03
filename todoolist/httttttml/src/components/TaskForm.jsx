import { useState } from 'react'

export default function TaskForm({ onAdd }) {
  const [title, setTitle] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    const trimmedTitle = title.trim()
    if (!trimmedTitle) return
    if (onAdd(trimmedTitle)) setTitle('')
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="new-task">Add a task</label>
      <span className="add-icon" aria-hidden="true">+</span>
      <input
        id="new-task"
        type="text"
        placeholder="What would you like to get done?"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        maxLength={160}
      />
      <button type="submit" disabled={!title.trim()}>
        Add task <span aria-hidden="true">↗</span>
      </button>
    </form>
  )
}
