import { useEffect, useState } from 'react'
import { Pencil, Trash2, Plus, ChevronDown, X } from 'lucide-react'
import Button from '../components/Button'
import DataTable from '../components/DataTable'
import StatusPill from '../components/StatusPill'
import FormField from '../components/FormField'
import { useScouts } from '../ScoutsProvider'
import { tribes } from '../data/tribes'
import { parents as initialParents } from '../data/children'
import './screens.css'

/* Stand-alone "My family" page. Owns the children + parents tables and all
 * the related modals (add child / edit child / confirm delete). Lifted out
 * of the dashboard so the sidebar can route to it directly. */
export default function FamilyScreen() {
  const { roster, removeChild, updateChild, addChild } = useScouts()
  const [tribeFilter, setTribeFilter] = useState('all')
  const [pendingDelete, setPendingDelete] = useState(null)
  const [editingChild, setEditingChild] = useState(null)
  const [addingChild, setAddingChild] = useState(false)
  const [expandedId, setExpandedId] = useState(null)
  /* Parents live in local state so edits made via the popup persist for
   * the session (we don't have a real backend to round-trip through). */
  const [parentRoster, setParentRoster] = useState(initialParents)
  const [editingParent, setEditingParent] = useState(null)
  const [expandedParentId, setExpandedParentId] = useState(null)

  const filteredRoster =
    tribeFilter === 'all'
      ? roster
      : roster.filter((c) => c.tribe === tribeFilter)

  const columns = [
    {
      key: 'name',
      label: 'שם החניך',
      render: (c) => (
        <span className="s-name">
          {c.avatar ? (
            <img
              className="s-name__avatar"
              src={c.avatar}
              alt={c.firstName}
            />
          ) : (
            <span className="s-name__dot" style={{ background: c.color }}>
              {c.firstName[0]}
            </span>
          )}
          {c.name}
        </span>
      ),
    },
    { key: 'status', label: 'סטטוס', render: (c) => <StatusPill status={c.status} /> },
    {
      key: 'nationalId',
      label: 'תעודת זהות',
      render: (c) => <span className="scouts__ltr">{c.nationalId}</span>,
    },
    {
      key: 'dob',
      label: 'תאריך לידה',
      render: (c) => <span className="scouts__ltr">{c.dob}</span>,
    },
    { key: 'grade', label: 'שכבה' },
    { key: 'school', label: 'בית ספר' },
    { key: 'tribe', label: 'שבט' },
    {
      key: 'actions',
      label: '',
      align: 'end',
      render: (c) => (
        <span className="s-rowactions">
          <button aria-label="עריכה" onClick={() => setEditingChild(c)}>
            <Pencil size={16} />
          </button>
          <button
            aria-label="מחיקה"
            className="is-danger"
            onClick={() => setPendingDelete(c)}
          >
            <Trash2 size={16} />
          </button>
          <button
            aria-label={expandedId === c.id ? 'סגירה' : 'הצגת פרטים מלאים'}
            aria-expanded={expandedId === c.id}
            className={`s-rowactions__expand ${
              expandedId === c.id ? 'is-open' : ''
            }`}
            onClick={() =>
              setExpandedId((curr) => (curr === c.id ? null : c.id))
            }
          >
            <ChevronDown size={16} />
          </button>
        </span>
      ),
    },
  ]

  const parentColumns = [
    {
      key: 'name',
      label: 'שם ההורה',
      render: (p) => (
        <span className="s-name">
          {p.avatar ? (
            <img
              className="s-name__avatar"
              src={p.avatar}
              alt={p.firstName}
            />
          ) : (
            <span className="s-name__dot" style={{ background: p.color }}>
              {p.firstName[0]}
            </span>
          )}
          {p.name}
        </span>
      ),
    },
    { key: 'role', label: 'תפקיד' },
    {
      key: 'nationalId',
      label: 'תעודת זהות',
      render: (p) => <span className="scouts__ltr">{p.nationalId}</span>,
    },
    {
      key: 'phone',
      label: 'טלפון',
      render: (p) => <span className="scouts__ltr">{p.phone}</span>,
    },
    { key: 'email', label: 'אימייל' },
    {
      key: 'actions',
      label: '',
      align: 'end',
      render: (p) => (
        <span className="s-rowactions">
          <button aria-label="עריכה" onClick={() => setEditingParent(p)}>
            <Pencil size={16} />
          </button>
          <button
            aria-label={
              expandedParentId === p.id ? 'סגירה' : 'הצגת פרטים מלאים'
            }
            aria-expanded={expandedParentId === p.id}
            className={`s-rowactions__expand ${
              expandedParentId === p.id ? 'is-open' : ''
            }`}
            onClick={() =>
              setExpandedParentId((curr) => (curr === p.id ? null : p.id))
            }
          >
            <ChevronDown size={16} />
          </button>
        </span>
      ),
    },
  ]

  return (
    <div>
      <section className="s-section">
        <div className="s-section__head s-section__head--with-subaction">
          <h2 className="s-section__title">חניכים</h2>
          <p className="s-section__subtitle">{roster.length} חניכים פעילים</p>
          <Button
            variant="primary"
            size="sm"
            icon={<Plus size={16} />}
            onClick={() => setAddingChild(true)}
          >
            הוספת חניך חדש
          </Button>
        </div>

        <div className="s-filters">
          <button
            className={`s-filter ${tribeFilter === 'all' ? 'is-active' : ''}`}
            onClick={() => setTribeFilter('all')}
          >
            כל השבטים
          </button>
          {tribes.map((t) => (
            <button
              key={t.id}
              className={`s-filter ${tribeFilter === t.name ? 'is-active' : ''}`}
              onClick={() => setTribeFilter(t.name)}
            >
              {t.name}
            </button>
          ))}
        </div>

        <div className="s-card s-card--flush s-cardrows s-people-table">
          <DataTable
            columns={columns}
            rows={filteredRoster}
            getRowKey={(c) => c.id}
            empty="אין חניכים בשבט זה."
            isExpanded={(c) => c.id === expandedId}
            renderExpanded={(c) => <ChildDetails child={c} />}
          />
        </div>

        <h3 className="s-subsection__title">הורים</h3>
        <div className="s-card s-card--flush s-cardrows s-people-table">
          <DataTable
            columns={parentColumns}
            rows={parentRoster}
            getRowKey={(p) => p.id}
            isExpanded={(p) => p.id === expandedParentId}
            renderExpanded={(p) => <ParentDetails parent={p} />}
          />
        </div>
      </section>

      {pendingDelete && (
        <ConfirmDelete
          child={pendingDelete}
          onCancel={() => setPendingDelete(null)}
          onConfirm={() => {
            removeChild(pendingDelete.id)
            setPendingDelete(null)
          }}
        />
      )}

      {editingChild && (
        <EditChildModal
          child={editingChild}
          onCancel={() => setEditingChild(null)}
          onSave={(patch) => {
            updateChild(editingChild.id, patch)
            setEditingChild(null)
          }}
        />
      )}

      {addingChild && (
        <EditChildModal
          child={{}}
          title="הוספת חניך חדש"
          submitLabel="הוספת החניך"
          onCancel={() => setAddingChild(false)}
          onSave={(form) => {
            const id = `child-${Date.now().toString(36)}`
            const fullName = `${form.firstName || 'חניך'} ${
              form.lastName || ''
            }`.trim()
            addChild({
              id,
              firstName: form.firstName || 'חניך',
              name: fullName,
              status: 'active',
              color: '#367757',
              ...form,
            })
            setAddingChild(false)
          }}
        />
      )}

      {editingParent && (
        <EditParentModal
          parent={editingParent}
          parentIndex={parentRoster.findIndex(
            (p) => p.id === editingParent.id,
          )}
          onCancel={() => setEditingParent(null)}
          onSave={(form) => {
            setParentRoster((prev) =>
              prev.map((p) =>
                p.id === editingParent.id
                  ? {
                      ...p,
                      ...form,
                      name: `${form.firstName || ''} ${
                        form.lastName || ''
                      }`.trim(),
                    }
                  : p,
              ),
            )
            setEditingParent(null)
          }}
        />
      )}
    </div>
  )
}

function ConfirmDelete({ child, onCancel, onConfirm }) {
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && onCancel()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [onCancel])

  return (
    <div className="s-modal__scrim" onClick={onCancel} role="presentation">
      <div
        className="s-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="s-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="s-modal-title" className="s-modal__title">
          מחיקת חניך
        </h3>
        <p className="s-modal__body">
          האם אתם בטוחים שברצונכם למחוק את <strong>{child.name}</strong>?
          <br />
          פעולה זו לא ניתנת לביטול.
        </p>
        <div className="s-modal__actions">
          <Button variant="ghost" onClick={onCancel}>
            ביטול
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            מחיקה
          </Button>
        </div>
      </div>
    </div>
  )
}

/* Read-only details panel rendered under an expanded row. */
function ChildDetails({ child }) {
  const items = [
    { label: 'שם פרטי', value: child.firstName },
    { label: 'שם משפחה', value: child.lastName },
    { label: 'תעודת זהות', value: child.nationalId },
    { label: 'תאריך לידה', value: child.dob },
    { label: 'שכבה', value: child.grade },
    { label: 'כיתה', value: child.classroom },
    { label: 'שבט', value: child.tribe },
    {
      label: 'גדוד וקבוצה',
      value: [child.battalion, child.group].filter(Boolean).join(' · '),
    },
    { label: 'בית ספר', value: child.school },
    { label: 'עיר', value: child.city },
    { label: 'טלפון נייד', value: child.phone },
    { label: 'ארץ לידה', value: child.birthCountry },
    { label: 'מגדר', value: child.gender },
  ].filter((i) => i.value)

  return (
    <div className="s-child-details">
      {items.map((i) => (
        <div className="s-child-details__item" key={i.label}>
          <span className="s-child-details__label">{i.label}</span>
          <span className="s-child-details__value">{i.value}</span>
        </div>
      ))}
    </div>
  )
}

const ID_TYPES = [
  { id: 'nationalId', label: 'תעודת זהות' },
  { id: 'passport', label: 'דרכון' },
  { id: 'travelDoc', label: 'תעודת מסע' },
]
const GENDERS = ['זכר', 'נקבה', 'אחר']
const EDIT_GRADES = ["ד'", "ה'", "ו'", "ז'", "ח'", "ט'"]
const SCHOOL_OPTIONS = [
  'חינוך אלונים',
  'צוקים',
  'רמות',
  'תל אביב',
  'גורדון',
  'גבריאלי',
  'בלפור',
  'אחר',
]

function EditChildModal({
  child,
  onCancel,
  onSave,
  title = 'עריכת פרטי חניך',
  submitLabel = 'שמירת שינויים',
}) {
  const [form, setForm] = useState({
    firstName: child.firstName || '',
    lastName: child.lastName || '',
    idType: child.idType || 'nationalId',
    nationalId: child.nationalId || '',
    dob: child.dob || '',
    grade: child.grade || EDIT_GRADES[0],
    classroom: child.classroom || '',
    tribe: child.tribe || '',
    battalion: child.battalion || '',
    group: child.group || '',
    school: child.school || '',
    phone: child.phone || '',
    birthCountry: child.birthCountry || '',
    gender: child.gender || GENDERS[0],
  })
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && onCancel()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [onCancel])

  const submit = (e) => {
    e.preventDefault()
    onSave(form)
  }

  return (
    <div className="s-modal__scrim" onClick={onCancel} role="presentation">
      <form
        className="s-modal s-modal--wide"
        role="dialog"
        aria-modal="true"
        aria-labelledby="s-edit-title"
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
      >
        <header className="s-modal__head">
          <h3 id="s-edit-title" className="s-modal__title">
            {title}
          </h3>
          <button
            type="button"
            className="s-modal__close"
            onClick={onCancel}
            aria-label="סגירה"
          >
            <X size={18} />
          </button>
        </header>

        <div className="s-modal__grid">
          <FormField label="שם פרטי" value={form.firstName} onChange={set('firstName')} />
          <FormField label="שם משפחה" value={form.lastName} onChange={set('lastName')} />

          <div className="s-modal__row-wide">
            <span className="s-modal__row-label">סוג מסמך מזהה</span>
            <div className="s-toggle">
              {ID_TYPES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`s-toggle__btn ${form.idType === t.id ? 'is-active' : ''}`}
                  onClick={() => setForm((f) => ({ ...f, idType: t.id }))}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <FormField
            label={ID_TYPES.find((t) => t.id === form.idType)?.label || 'מספר מסמך'}
            value={form.nationalId}
            onChange={set('nationalId')}
            inputMode="numeric"
          />
          <FormField label="תאריך לידה" value={form.dob} onChange={set('dob')} placeholder="DD/MM/YYYY" />
          <FormField label="שכבה" as="select" value={form.grade} onChange={set('grade')} options={EDIT_GRADES} />
          <FormField label="כיתה" value={form.classroom} onChange={set('classroom')} />
          <FormField label="קבוצה" value={form.group} onChange={set('group')} />
          <FormField
            label="בית ספר"
            as="select"
            value={form.school}
            onChange={set('school')}
            options={SCHOOL_OPTIONS}
          />
          <FormField
            label="שבט"
            value={form.tribe}
            onChange={set('tribe')}
            placeholder="ניתן להוסיף את שם השבט או העיר"
          />
          <FormField label="טלפון נייד" value={form.phone} onChange={set('phone')} placeholder="050-0000000" />
          <FormField label="ארץ לידה" value={form.birthCountry} onChange={set('birthCountry')} />
          <FormField label="מגדר" as="select" value={form.gender} onChange={set('gender')} options={GENDERS} />
        </div>

        <div className="s-modal__actions">
          <Button variant="ghost" type="button" onClick={onCancel}>
            ביטול
          </Button>
          <Button variant="primary" type="submit">
            {submitLabel}
          </Button>
        </div>
      </form>
    </div>
  )
}

/* Read-only details panel rendered under an expanded parent row. */
function ParentDetails({ parent }) {
  const items = [
    { label: 'שם פרטי', value: parent.firstName },
    { label: 'שם משפחה', value: parent.lastName },
    { label: 'תפקיד', value: parent.role },
    { label: 'תעודת זהות', value: parent.nationalId },
    { label: 'מצב משפחתי', value: parent.maritalStatus },
    { label: 'כתובת', value: parent.address },
    { label: 'טלפון נייד', value: parent.phone },
    { label: 'דואר אלקטרוני', value: parent.email },
  ].filter((i) => i.value)

  return (
    <div className="s-child-details">
      {items.map((i) => (
        <div className="s-child-details__item" key={i.label}>
          <span className="s-child-details__label">{i.label}</span>
          <span className="s-child-details__value">{i.value}</span>
        </div>
      ))}
    </div>
  )
}

const MARITAL_STATUSES = [
  'נשוי/אה',
  'גרוש/ה',
  'אלמן/ה',
  'רווק/ה',
  'בזוגיות',
  'אחר',
]

/* Edit-parent popup. Mirrors the EditChildModal layout: identifier toggle
 * (תעודת זהות / דרכון / תעודת מסע), inline ID number, marital status select,
 * and the parent's personal contact info. */
function EditParentModal({ parent, parentIndex, onCancel, onSave }) {
  const [form, setForm] = useState({
    firstName: parent.firstName || '',
    lastName: parent.lastName || '',
    idType: parent.idType || 'nationalId',
    nationalId: parent.nationalId || '',
    maritalStatus: parent.maritalStatus || MARITAL_STATUSES[0],
    address: parent.address || '',
    /* `differentAddress` exposes the alternate-residence input. When true,
     * `alternateAddress` becomes the person's actual home address while
     * the main `address` field keeps the registration/billing address. */
    differentAddress: !!parent.alternateAddress,
    alternateAddress: parent.alternateAddress || '',
    phone: parent.phone || '',
    email: parent.email || '',
    password: parent.password || '',
  })
  const set = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && onCancel()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [onCancel])

  const submit = (e) => {
    e.preventDefault()
    onSave(form)
  }

  const titleLabel =
    typeof parentIndex === 'number' && parentIndex >= 0
      ? `הורה ${parentIndex + 1}: ${parent.name}`
      : `עריכת ${parent.name}`

  return (
    <div className="s-modal__scrim" onClick={onCancel} role="presentation">
      <form
        className="s-modal s-modal--wide"
        role="dialog"
        aria-modal="true"
        aria-labelledby="s-edit-parent-title"
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
      >
        <header className="s-modal__head">
          <h3 id="s-edit-parent-title" className="s-modal__title">
            {titleLabel}
          </h3>
          <button
            type="button"
            className="s-modal__close"
            onClick={onCancel}
            aria-label="סגירה"
          >
            <X size={18} />
          </button>
        </header>

        <div className="s-modal__grid">
          <FormField
            label="שם פרטי"
            value={form.firstName}
            onChange={set('firstName')}
          />
          <FormField
            label="שם משפחה"
            value={form.lastName}
            onChange={set('lastName')}
          />

          <div className="s-modal__row-wide">
            <span className="s-modal__row-label">סוג מסמך מזהה</span>
            <div className="s-toggle">
              {ID_TYPES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`s-toggle__btn ${
                    form.idType === t.id ? 'is-active' : ''
                  }`}
                  onClick={() => setForm((f) => ({ ...f, idType: t.id }))}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <FormField
            label="תעודה מזהה"
            value={form.nationalId}
            onChange={set('nationalId')}
            inputMode="numeric"
          />
          <FormField
            label="מצב משפחתי"
            as="select"
            value={form.maritalStatus}
            onChange={set('maritalStatus')}
            options={MARITAL_STATUSES}
          />
          <FormField
            label="כתובת"
            value={form.address}
            onChange={set('address')}
            placeholder="רחוב, מספר, יישוב"
            disabled={form.differentAddress}
          />

          <div className="s-modal__row-wide">
            <label className="s-switch">
              <input
                type="checkbox"
                className="s-switch__input"
                checked={form.differentAddress}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    differentAddress: e.target.checked,
                    /* Clear the alternate field when toggling off so stale
                     * residence data doesn't survive the next save. */
                    alternateAddress: e.target.checked
                      ? f.alternateAddress
                      : '',
                  }))
                }
              />
              <span className="s-switch__track" aria-hidden="true" />
              <span className="s-switch__label">מתגורר/ת בכתובת אחרת</span>
            </label>
            {form.differentAddress && (
              <div style={{ marginTop: 10 }}>
                <FormField
                  label="כתובת מגורים"
                  value={form.alternateAddress}
                  onChange={set('alternateAddress')}
                  placeholder="רחוב, מספר, יישוב"
                />
              </div>
            )}
          </div>

          <FormField
            label="מספר נייד"
            value={form.phone}
            onChange={set('phone')}
            placeholder="050-0000000"
          />
          <FormField
            label="דואר אלקטרוני"
            value={form.email}
            onChange={set('email')}
            placeholder="name@example.com"
          />
          <FormField
            label="סיסמה"
            type="password"
            value={form.password}
            onChange={set('password')}
          />
        </div>

        <div className="s-modal__actions">
          <Button variant="ghost" type="button" onClick={onCancel}>
            ביטול
          </Button>
          <Button variant="primary" type="submit">
            שמירת שינויים
          </Button>
        </div>
      </form>
    </div>
  )
}
