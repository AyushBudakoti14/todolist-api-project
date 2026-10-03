import { useMemo, useState } from 'react'
import { api } from '../api.js'
import Navbar from './Navbar.jsx'
import Pagination from './Pagination.jsx'
import TaskCard from './TaskCard.jsx'
import TaskFilter from './TaskFilter.jsx'
import TaskForm from './TaskForm.jsx'

const pageSize = 6

function loadTasks(userId) {
  try {
    return { tasks: api.listTasks(userId), error: '' }
  } catch (error) {
    return { tasks: [], error: error.message }
  }
}

export default function Dashboard({ user, onLogout }) {
  const [initialData] = useState(() => loadTasks(user.id))
  const [tasks, setTasks] = useState(initialData.tasks)
  const [activeFilter, setActiveFilter] = useState('All tasks')
  const [page, setPage] = useState(1)
  const [error, setError] = useState(initialData.error)

  const completedCount = tasks.filter((task) => task.completed).length
  const remainingCount = tasks.length - completedCount
  const filteredTasks = useMemo(
    () => tasks.filter((task) => {
      if (activeFilter === 'Active') return !task.completed
      if (activeFilter === 'Completed') return task.completed
      return true
    }),
    [activeFilter, tasks],
  )
  const pageCount = Math.ceil(filteredTasks.length / pageSize)
  const safePage = Math.min(page, Math.max(pageCount, 1))
  const visibleTasks = filteredTasks.slice((safePage - 1) * pageSize, safePage * pageSize)

  function runTaskAction(action) {
    try {
      const updatedTasks = action()
      setTasks(updatedTasks)
      setError('')
      return true
    } catch (actionError) {
      setError(actionError.message)
      return false
    }
  }

  function addTask(title) {
    try {
      const createdTask = api.createTask(user.id, title)
      setTasks(api.listTasks(user.id))
      setPage(1)
      setError('')
      return createdTask
    } catch (actionError) {
      setError(actionError.message)
      return null
    }
  }

  function toggleTask(task) {
    runTaskAction(() => api.updateTask(user.id, task.id, { completed: !task.completed }))
  }

  function deleteTask(taskId) {
    runTaskAction(() => api.deleteTask(user.id, taskId))
  }

  function clearCompleted() {
    runTaskAction(() => api.clearCompleted(user.id))
    setPage(1)
  }

  function changeFilter(filter) {
    setActiveFilter(filter)
    setPage(1)
  }

  return (
    <main className="page-shell">
      <Navbar onLogout={onLogout} />
      <section className="todo-card" aria-labelledby="page-title">
        <div className="intro">
          <div className="eyebrow"><span className="eyebrow-dot" /> TODAY</div>
          <h1 id="page-title">Ayush&apos;s to-do list</h1>
          <p className="subtitle">Keep track of what needs doing.</p>
          <div className="progress-card">
            <div className="progress-copy">
              <div>
                <p className="progress-label">PROGRESS</p>
                <p className="progress-value">
                  {remainingCount === 0 && tasks.length > 0
                    ? 'All done — lovely work!'
                    : `${remainingCount} ${remainingCount === 1 ? 'task' : 'tasks'} left to go`}
                </p>
              </div>
              <span className="progress-count">{completedCount}/{tasks.length}</span>
            </div>
            <div
              className="progress-track"
              role="progressbar"
              aria-label="Tasks completed"
              aria-valuemin="0"
              aria-valuemax={tasks.length || 1}
              aria-valuenow={completedCount}
            >
              <span
                className="progress-fill"
                style={{ width: `${tasks.length ? (completedCount / tasks.length) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>

        <TaskForm onAdd={addTask} />
        {error && <p className="form-error task-error" role="alert">{error}</p>}

        <div className="list-heading">
          <div>
            <h2>To-do list</h2>
            <p>{remainingCount} remaining</p>
          </div>
          <TaskFilter activeFilter={activeFilter} onChange={changeFilter} />
        </div>

        <ul className="task-list">
          {visibleTasks.map((task) => (
            <TaskCard key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} />
          ))}
          {visibleTasks.length === 0 && (
            <li className="empty-state">
              <p>
                {activeFilter === 'Completed'
                  ? 'No completed tasks.'
                  : activeFilter === 'Active'
                    ? 'No active tasks.'
                    : 'No tasks yet. Add one above.'}
              </p>
            </li>
          )}
        </ul>

        <Pagination page={safePage} pageCount={pageCount} onChange={setPage} />
        {completedCount > 0 && (
          <button className="clear-button" type="button" onClick={clearCompleted}>
            Clear completed
          </button>
        )}
      </section>
      <footer className="page-footer">
        <span>Ayush</span>
        <span>Your task list</span>
      </footer>
    </main>
  )
}
