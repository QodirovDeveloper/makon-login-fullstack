import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import AuthLayout from '../components/auth/AuthLayout.jsx'
import ArrowIcon from '../components/shared/ArrowIcon.jsx'
import { authErrorClasses, authInputClasses, authLabelClasses, primaryButtonClasses } from '../components/shared/uiClasses.js'
import { useUserStore } from '../store/userStore.jsx'

export default function RegisterPage() {
  const { user, register } = useUserStore()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Ro'yxatdan o'tgach backend token qaytaradi, foydalanuvchi darhol kirgan bo'ladi
  if (user) return <Navigate to="/" replace />

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(form)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      number="03"
      title="Boshlaymiz."
      description="Yangi hisob uchun quyidagi maydonlarni to‘ldiring."
      visualTitle="Yangi hisob yarating."
      alternateText="Hisobingiz bormi?"
      alternateLabel="Kirish"
      alternateTo="/login"
    >
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <label className={authLabelClasses} htmlFor="register-name">Ism va familiya</label>
        <input className={authInputClasses} id="register-name" name="name" type="text" placeholder="Ism Familiya" autoComplete="name" value={form.name} onChange={handleChange} required minLength={2} maxLength={80} />
        <label className={authLabelClasses} htmlFor="register-email">Elektron pochta</label>
        <input className={authInputClasses} id="register-email" name="email" type="email" placeholder="name@example.com" autoComplete="email" value={form.email} onChange={handleChange} required />
        <label className={authLabelClasses} htmlFor="register-password">Parol</label>
        <input className={authInputClasses} id="register-password" name="password" type="password" placeholder="Kamida 8 belgi" autoComplete="new-password" value={form.password} onChange={handleChange} required minLength={8} maxLength={128} />
        {error && <p className={authErrorClasses} role="alert">{error}</p>}
        <button className={`${primaryButtonClasses} mt-[9px] h-[57px] w-full disabled:pointer-events-none disabled:opacity-60`} type="submit" disabled={loading}>
          {loading ? 'Yuborilmoqda…' : 'Ro‘yxatdan o‘tish'} <ArrowIcon />
        </button>
      </form>
    </AuthLayout>
  )
}
