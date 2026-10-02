import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import AuthLayout from '../components/auth/AuthLayout.jsx'
import ArrowIcon from '../components/shared/ArrowIcon.jsx'
import { authErrorClasses, authInputClasses, authLabelClasses, primaryButtonClasses } from '../components/shared/uiClasses.js'
import { useUserStore } from '../store/userStore.jsx'

export default function LoginPage() {
  const { user, login } = useUserStore()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Kirgan foydalanuvchi (yoki muvaffaqiyatli login) bosh sahifaga o'tadi
  if (user) return <Navigate to="/" replace />

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      number="02"
      title="Xush kelibsiz."
      description="Hisobingizga kirish uchun ma’lumotlaringizni kiriting."
      visualTitle="Hisobingizga qayting."
      alternateText="Hali hisobingiz yo‘qmi?"
      alternateLabel="Ro‘yxatdan o‘tish"
      alternateTo="/register"
    >
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <label className={authLabelClasses} htmlFor="login-email">Elektron pochta</label>
        <input className={authInputClasses} id="login-email" name="email" type="email" placeholder="name@example.com" autoComplete="email" value={form.email} onChange={handleChange} required />
        <label className={authLabelClasses} htmlFor="login-password">Parol</label>
        <input className={authInputClasses} id="login-password" name="password" type="password" placeholder="Parolingizni kiriting" autoComplete="current-password" value={form.password} onChange={handleChange} required />
        {error && <p className={authErrorClasses} role="alert">{error}</p>}
        <button className={`${primaryButtonClasses} mt-[9px] h-[57px] w-full disabled:pointer-events-none disabled:opacity-60`} type="submit" disabled={loading}>
          {loading ? 'Kirilmoqda…' : 'Kirish'} <ArrowIcon />
        </button>
      </form>
    </AuthLayout>
  )
}
