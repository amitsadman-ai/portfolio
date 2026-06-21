import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Button from '../components/Button'
import FormField from '../components/FormField'
import { useScouts } from '../ScoutsProvider'
import { tribes } from '../data/tribes'
import { path } from '../routes'
import './screens.css'
import './AddChild.css'

const GRADES = ["ד'", "ה'", "ו'", "ז'", "ח'", "ט'"]
const COLORS = ['#367757', '#e7a90f', '#c0507a', '#3f6f9e', '#9a4b86']

export default function AddChildScreen() {
  const { addChild, roster, setActiveChildId } = useScouts()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    firstName: '',
    lastName: 'כהן',
    nationalId: '',
    dob: '',
    grade: "ד'",
    school: '',
    city: 'תל אביב',
    tribe: tribes[0].name,
  })

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    const id = `child-${roster.length + 1}`
    addChild({
      id,
      firstName: form.firstName || 'חניך',
      name: `${form.firstName} ${form.lastName}`.trim(),
      status: 'active',
      nationalId: form.nationalId || '000000000',
      dob: form.dob || '01/01/2015',
      grade: form.grade,
      school: form.school || '—',
      city: form.city,
      tribe: form.tribe,
      color: COLORS[roster.length % COLORS.length],
    })
    setActiveChildId(id)
    navigate(path('dashboard'))
  }

  return (
    <form className="addchild" onSubmit={submit}>
      <div className="s-card addchild__card">
        <h2 className="addchild__title">הוספת חניך חדש</h2>
        <p className="addchild__sub">
          הוסיפו ילד/ה למשפחה כדי לרשום אותם לפעילויות. ניתן לערוך את הפרטים בכל עת.
        </p>

        <div className="addchild__grid">
          <FormField label="שם פרטי" required value={form.firstName} onChange={set('firstName')} placeholder="לדוגמה: יעל" />
          <FormField label="שם משפחה" value={form.lastName} onChange={set('lastName')} />
          <FormField label="תעודת זהות" required inputMode="numeric" value={form.nationalId} onChange={set('nationalId')} placeholder="9 ספרות" />
          <FormField label="תאריך לידה" value={form.dob} onChange={set('dob')} placeholder="DD/MM/YYYY" />
          <FormField label="שכבה" as="select" value={form.grade} onChange={set('grade')} options={GRADES} />
          <FormField label="שבט" as="select" value={form.tribe} onChange={set('tribe')} options={tribes.map((t) => t.name)} />
          <FormField label="בית ספר" value={form.school} onChange={set('school')} placeholder="שם בית הספר" />
          <FormField label="עיר" value={form.city} onChange={set('city')} />
        </div>

        <div className="addchild__actions">
          <Button variant="ghost" type="button" icon={<ArrowLeft size={16} />} onClick={() => navigate(path('dashboard'))}>
            ביטול
          </Button>
          <Button variant="secondary" type="submit">
            הוספת החניך
          </Button>
        </div>
      </div>
    </form>
  )
}
