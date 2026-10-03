const storagePrefix = import.meta.env.VITE_STORAGE_PREFIX || 'daylight-demo'
const usersKey = `${storagePrefix}:users`
const sessionKey = `${storagePrefix}:session`
const taskKey = (userId) => `${storagePrefix}:tasks:${userId}`

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key)
    return value === null ? fallback : JSON.parse(value)
  } catch (error) {
    throw new Error(`Could not read app data from this browser: ${error.message}`, { cause: error })
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    throw new Error(`Could not save app data in this browser: ${error.message}`, { cause: error })
  }
}

function makeId() {
  return crypto.randomUUID()
}

function normalizeEmail(email) {
  return email.trim().toLowerCase()
}

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email }
}

async function hashPassword(password, salt) {
  if (!crypto.subtle) {
    throw new Error('This browser does not support secure password hashing.')
  }
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: encoder.encode(salt), iterations: 120000, hash: 'SHA-256' },
    key,
    256,
  )
  return Array.from(new Uint8Array(bits), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

function getCurrentUser() {
  const session = readStorage(sessionKey, null)
  if (!session?.userId) return null
  const users = readStorage(usersKey, [])
  const user = users.find((item) => item.id === session.userId)
  return user ? publicUser(user) : null
}

export const api = {
  getSession() {
    return getCurrentUser()
  },

  async register({ name, email, password }) {
    if (name.trim().length < 2) throw new Error('Please enter a name with at least 2 characters.')
    if (!email.trim()) throw new Error('Please enter an email address.')
    if (password.length < 8) throw new Error('Password must be at least 8 characters.')

    const normalizedEmail = normalizeEmail(email)
    const users = readStorage(usersKey, [])
    if (users.some((user) => user.email === normalizedEmail)) {
      throw new Error('An account with this email already exists.')
    }

    const salt = makeId()
    const user = {
      id: makeId(),
      name: name.trim(),
      email: normalizedEmail,
      salt,
      passwordHash: await hashPassword(password, salt),
    }
    writeStorage(usersKey, [...users, user])
    writeStorage(sessionKey, { userId: user.id })
    return publicUser(user)
  },

  async login({ email, password }) {
    if (!email.trim() || !password) throw new Error('Enter your email and password.')

    const normalizedEmail = normalizeEmail(email)
    const users = readStorage(usersKey, [])
    const user = users.find((item) => item.email === normalizedEmail)
    if (!user || (await hashPassword(password, user.salt)) !== user.passwordHash) {
      throw new Error('Email or password is incorrect.')
    }
    writeStorage(sessionKey, { userId: user.id })
    return publicUser(user)
  },

  logout() {
    try {
      localStorage.removeItem(sessionKey)
    } catch (error) {
      throw new Error(`Could not end this session: ${error.message}`, { cause: error })
    }
  },

  listTasks(userId) {
    const tasks = readStorage(taskKey(userId), [])
    if (!Array.isArray(tasks)) throw new Error('Saved task data is invalid.')
    return tasks
  },

  createTask(userId, title) {
    const task = { id: makeId(), title: title.trim(), completed: false, createdAt: new Date().toISOString() }
    writeStorage(taskKey(userId), [task, ...this.listTasks(userId)])
    return task
  },

  updateTask(userId, taskId, updates) {
    const tasks = this.listTasks(userId)
    const taskExists = tasks.some((task) => task.id === taskId)
    if (!taskExists) throw new Error('That task no longer exists.')
    const updated = tasks.map((task) => (task.id === taskId ? { ...task, ...updates } : task))
    writeStorage(taskKey(userId), updated)
    return updated
  },

  deleteTask(userId, taskId) {
    const tasks = this.listTasks(userId).filter((task) => task.id !== taskId)
    writeStorage(taskKey(userId), tasks)
    return tasks
  },

  clearCompleted(userId) {
    const tasks = this.listTasks(userId).filter((task) => !task.completed)
    writeStorage(taskKey(userId), tasks)
    return tasks
  },
}
