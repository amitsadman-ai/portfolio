import { useState } from 'react'
import { Phone, Mail, MapPin, CheckCircle2 } from 'lucide-react'
import Button from '../components/Button'
import FormField from '../components/FormField'
import { tribes, CONTACT_SUBJECTS } from '../data/tribes'
import { parents } from '../data/children'
import { useScouts } from '../ScoutsProvider'
import './ContactTribe.css'
import './screens.css'

const GRADES = ["ד'", "ה'", "ו'", "ז'", "ח'", "ט'"]

export default function ContactTribeScreen() {
  const { roster } = useScouts()
  const [form, setForm] = useState({
    tribe: tribes[0].name,
    parent: parents[0]?.name || '',
    child: roster[0]?.name || '',
    grade: roster[0]?.grade || GRADES[0],
    childId: '',
    phone: '',
    email: '',
    subject: CONTACT_SUBJECTS[0],
    body: '',
  })
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  const [sent, setSent] = useState(false)
  const tribe = tribes.find((t) => t.name === form.tribe) || tribes[0]

  const submit = (e) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <section className="contact">
      <div className="contact__main s-card">
        <img
          className="contact__illustration"
          src="/assets/contact-parent.svg"
          alt=""
        />
        {!sent && (
          <p
            className="s-section__subtitle"
            style={{ marginTop: 12, marginBottom: 12, textAlign: 'center' }}
          >
            יש לכם שאלה? שלחו הודעה לרכז/ת השבט ונחזור אליכם בהקדם.
          </p>
        )}

        {sent ? (
          <div className="contact__sent">
            <CheckCircle2 size={40} />
            <h3>הפנייה נשלחה!</h3>
            <p>{tribe.contactName} מ{tribe.name} יחזרו אליכם בתוך 2 ימי עבודה.</p>
            <Button
              variant="primary"
              onClick={() => setSent(false)}
              style={{ color: '#000000' }}
            >
              שליחת פנייה נוספת
            </Button>
          </div>
        ) : (
          <form className="contact__form" onSubmit={submit}>
            <FormField
              label="שבט"
              as="select"
              value={form.tribe}
              onChange={set('tribe')}
              options={tribes.map((t) => t.name)}
            />
            <FormField
              label="שם ההורה"
              as="select"
              value={form.parent}
              onChange={set('parent')}
              options={parents.map((p) => p.name)}
            />
            <FormField
              label="שם החניך"
              as="select"
              value={form.child}
              onChange={set('child')}
              options={roster.map((c) => c.name)}
            />
            <FormField
              label="כיתה"
              as="select"
              value={form.grade}
              onChange={set('grade')}
              options={GRADES}
            />
            <FormField
              label="תעודה מזהה חניך"
              value={form.childId}
              onChange={set('childId')}
              inputMode="numeric"
              placeholder="9 ספרות"
            />
            <FormField
              label="מספר טלפון"
              value={form.phone}
              onChange={set('phone')}
              inputMode="tel"
              placeholder="050-0000000"
            />
            <FormField
              label="דואר אלקטרוני"
              value={form.email}
              onChange={set('email')}
              inputMode="email"
              placeholder="name@example.com"
            />
            <FormField
              label="סיבת הפנייה"
              as="select"
              value={form.subject}
              onChange={set('subject')}
              options={CONTACT_SUBJECTS}
            />
            <FormField
              label="תוכן הפנייה"
              as="textarea"
              value={form.body}
              onChange={set('body')}
              placeholder="כתבו כאן את פנייתכם..."
              required
            />
            <Button type="submit" variant="primary">
              שליחת הפנייה
            </Button>
          </form>
        )}
      </div>

      <aside className="contact__aside s-card">
        <h3 className="contact__aside-title">פרטי קשר · {tribe.name}</h3>
        <ul className="contact__details">
          <li>
            <span className="contact__role">{tribe.role}</span>
            <strong>{tribe.contactName}</strong>
          </li>
          <li>
            <Phone size={16} />
            <span className="scouts__ltr">{tribe.phone}</span>
          </li>
          <li>
            <Mail size={16} />
            <span className="scouts__ltr">{tribe.email}</span>
          </li>
          <li>
            <MapPin size={16} />
            <span>{tribe.region}</span>
          </li>
        </ul>
      </aside>
    </section>
  )
}
