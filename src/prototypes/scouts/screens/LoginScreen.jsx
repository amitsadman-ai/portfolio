import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import FormField from '../components/FormField'
import { useScouts } from '../ScoutsProvider'
import { path } from '../routes'
import './LoginScreen.css'

const TABS = [
  { id: 'password', label: 'תעודת זהות וסיסמה' },
  { id: 'sms', label: 'קוד חד פעמי ב-SMS' },
]

export default function LoginScreen() {
  const [tab, setTab] = useState('password')
  const { login } = useScouts()
  const navigate = useNavigate()

  const submit = (e) => {
    e.preventDefault()
    login()
    navigate(path('dashboard'))
  }

  return (
    <div className="login login--bg1">
      <div className="login__art" aria-hidden="true">
        <img className="login__art-emblem" src="/assets/scouts-logo-hebrew.png" alt="" />
        <span className="login__art-dot login__art-dot--1" />
        <span className="login__art-dot login__art-dot--2" />
      </div>

      <div className="login__panel">
        <img
          className="login__logo"
          src="/assets/zofim-logo-01.png"
          alt="צופי ישראל"
        />
        <form className="login__card" onSubmit={submit}>
          <h1 className="login__title">פורטל הורים</h1>
          <p className="login__subtitle">הרשמה לפעילויות וניהול החניכים במשפחה</p>

          <div className="login__tabs" role="tablist">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                className="login__tab"
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>

          <FormField
            label="תעודת זהות"
            name="id"
            inputMode="numeric"
            placeholder="9 ספרות"
            autoComplete="username"
            defaultValue="324115678"
          />

          {tab === 'password' ? (
            <FormField
              label="סיסמה"
              name="password"
              type="password"
              placeholder="הקלידו סיסמה"
              autoComplete="current-password"
              defaultValue="••••••••"
            />
          ) : (
            <FormField
              label="קוד אימות"
              name="otp"
              inputMode="numeric"
              placeholder="נשלח אליכם ב-SMS"
            />
          )}

          <a
            className="login__forgot"
            href={path()}
            onClick={(e) => e.preventDefault()}
          >
            שכחתי סיסמה
          </a>

          <Button type="submit" full>
            התחברו
          </Button>

          <div className="login__signup">
            <span className="login__signup-prompt">פעם ראשונה אצלנו?</span>
            <a
              className="login__signup-link"
              href={path()}
              onClick={(e) => e.preventDefault()}
            >
              להרשמה
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
