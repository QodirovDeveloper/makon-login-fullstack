import { createContext, useContext, useEffect, useState } from 'react'
import { fetchMe, loginUser, logoutUser, registerUser } from '../api/auth.js'

const TOKEN_KEY = 'makon-token'
const UserContext = createContext(null)

export function UserProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState(null)

  // Sahifa yangilanganda saqlangan token bo'yicha foydalanuvchini qayta olamiz
  useEffect(() => {
    if (!token) return
    let ignore = false
    fetchMe(token)
      .then((data) => {
        if (!ignore) setUser(data.user)
      })
      .catch((error) => {
        if (!ignore && error.status === 401) clearSession()
      })
    return () => {
      ignore = true
    }
  }, [])

  function saveSession(data) {
    localStorage.setItem(TOKEN_KEY, data.token)
    setToken(data.token)
    setUser(data.user)
  }

  function clearSession() {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUser(null)
  }

  async function login(form) {
    saveSession(await loginUser(form))
  }

  async function register(form) {
    saveSession(await registerUser(form))
  }

  async function logout() {
    // Server javob bermasa ham foydalanuvchini lokal chiqaramiz
    if (token) await logoutUser(token).catch(() => {})
    clearSession()
  }

  return (
    <UserContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUserStore() {
  return useContext(UserContext)
}
