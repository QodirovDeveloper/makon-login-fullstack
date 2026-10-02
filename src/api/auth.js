const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

// Backendga so'rov yuboradi. Xato bo'lsa serverdagi `message` bilan Error tashlaydi.
async function request(path, { method = 'GET', body, token } = {}) {
  let response
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new Error('Serverga ulanib bo‘lmadi. Backend ishlayotganini tekshiring.')
  }

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    const error = new Error(data.message || 'Xatolik yuz berdi.')
    error.status = response.status
    throw error
  }
  return data
}

export const registerUser = (form) => request('/api/auth/register', { method: 'POST', body: form })
export const loginUser = (form) => request('/api/auth/login', { method: 'POST', body: form })
export const fetchMe = (token) => request('/api/auth/me', { token })
export const logoutUser = (token) => request('/api/auth/logout', { method: 'POST', token })
