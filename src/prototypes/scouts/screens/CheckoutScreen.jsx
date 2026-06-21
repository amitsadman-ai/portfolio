import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CheckCircle2,
  ShieldCheck,
  ArrowLeft,
  User,
  Utensils,
  BriefcaseMedical,
  Camera,
  Pencil,
  X,
} from 'lucide-react'
import Button from '../components/Button'
import ChildTabs from '../components/ChildTabs'
import CheckoutSteps from '../components/CheckoutSteps'
import FormField from '../components/FormField'
import Price from '../components/Price'
import CartSummary from '../components/CartSummary'
import { useScouts } from '../ScoutsProvider'
import { path } from '../routes'
import './CheckoutScreen.css'

const FOOD_OPTIONS = [
  'רגיל',
  'צמחוני',
  'טבעוני',
  'ללא גלוטן',
  'ללא לקטוז',
  'כשר',
  'לא בושל בשבת',
]

const ALLERGY_OPTIONS = [
  'בוטנים',
  'אגוזים',
  'חלב',
  'ביצים',
  'חיטה',
  'סויה',
  'דגים',
  'פירות ים',
  'שומשום',
  'G6PD',
  'אחר',
]

/* One declaration block per child — the parent fills out the same set of
 * questions (food / allergies / medical / photos), signs the terms, and adds
 * a (mock) signature. Held outside the main form component so its state can
 * be lifted into one record per child. */
function blankDeclaration() {
  return {
    food: [], // multi-select array of food preference labels
    foodVerified: false,
    allergy: null, // 'yes' | 'no' | null
    /* When allergy === 'yes', each selected allergen lives here as
     * { name, lifeThreat: 'yes'|'no'|null, custom?: string }.
     * `custom` is only used when name === 'אחר'. */
    allergyEntries: [],
    medical: null,
    photo: null,
    terms: false,
    signed: false,
  }
}

/* Mirror of CartDrawer's grouping helper — collapse a flat
 * [{child, activity}, ...] list into [{child, lines: [...]}, ...] preserving
 * the order children first appear. */
function groupLinesByChild(lines) {
  const groups = []
  const seen = new Map()
  for (const line of lines) {
    let g = seen.get(line.child.id)
    if (!g) {
      g = { child: line.child, lines: [] }
      seen.set(line.child.id, g)
      groups.push(g)
    }
    g.lines.push(line)
  }
  return groups
}

export default function CheckoutScreen() {
  const { cartLines, summary, clearCart } = useScouts()
  const groups = useMemo(() => groupLinesByChild(cartLines), [cartLines])
  const [activeDeclId, setActiveDeclId] = useState(groups[0]?.child.id || null)
  const [decls, setDecls] = useState(() => {
    const init = {}
    for (const g of groups) init[g.child.id] = blankDeclaration()
    return init
  })
  const [showErrors, setShowErrors] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  /* Child IDs whose declaration the parent has explicitly "saved". When this
   * set covers every group, the section collapses to a success summary. */
  const [savedChildren, setSavedChildren] = useState(() => new Set())
  const [done, setDone] = useState(false)
  const [paidCount, setPaidCount] = useState(0)
  /* Names of children covered by the payment, captured at submit time
   * before the cart is cleared so the success message can read them back. */
  const [paidChildNames, setPaidChildNames] = useState([])
  /* Controlled payment fields so we can mask the input live:
   * card "1234 5678 9012 3456", exp "MM/YY". */
  const [card, setCard] = useState('')
  const [exp, setExp] = useState('')
  /* Ref to the declaration card so we can scroll the user back to the top
   * of the next child's form after they save the current one. */
  const declSectionRef = useRef(null)
  const navigate = useNavigate()

  /* Strip non-digits, cap at 16, group every 4 with a space. */
  const formatCard = (s) =>
    s
      .replace(/\D/g, '')
      .slice(0, 16)
      .replace(/(\d{4})(?=\d)/g, '$1 ')
  /* Strip non-digits, cap at 4, insert "/" after MM as soon as a 3rd digit
   * appears. Backspace through the "/" deletes the last MM digit cleanly
   * because we always re-derive from raw digits. */
  const formatExp = (s) => {
    const digits = s.replace(/\D/g, '').slice(0, 4)
    if (digits.length <= 2) return digits
    return `${digits.slice(0, 2)}/${digits.slice(2)}`
  }

  /* Accepts either a patch object or a (current) => patch function so callers
   * can do safe back-to-back updates (e.g. toggling multiple food pills before
   * a re-render lands the prior value). */
  const setDecl = (childId, patchOrFn) =>
    setDecls((prev) => {
      const curr = prev[childId]
      const patch = typeof patchOrFn === 'function' ? patchOrFn(curr) : patchOrFn
      return { ...prev, [childId]: { ...curr, ...patch } }
    })

  /* A child's declaration is complete when food is chosen and confirmed,
   * yes/no questions are all answered, terms are checked, and the signature
   * pad has been touched. */
  const isChildComplete = (childId) => {
    const d = decls[childId]
    if (!d) return false
    const food = d.food || []
    const entries = d.allergyEntries || []
    const everyEntryOk = entries.every(
      (e) =>
        e.lifeThreat !== null &&
        e.lifeThreat !== undefined &&
        (e.name !== 'אחר' || (e.custom && e.custom.trim() !== '')) &&
        (e.lifeThreat !== 'yes' || (e.treatment && e.treatment.trim() !== '')),
    )
    const allergyOk =
      d.allergy === 'no' ||
      (d.allergy === 'yes' && entries.length > 0 && everyEntryOk)
    return (
      food.length > 0 &&
      d.foodVerified &&
      d.allergy !== null &&
      allergyOk &&
      d.medical !== null &&
      d.photo !== null &&
      d.terms &&
      d.signed
    )
  }
  const allChildrenComplete =
    groups.length > 0 && groups.every((g) => isChildComplete(g.child.id))
  const allChildrenSaved =
    groups.length > 0 && groups.every((g) => savedChildren.has(g.child.id))

  const submit = (e) => {
    e.preventDefault()
    if (cartLines.length === 0) return
    if (!allChildrenSaved) {
      setShowErrors(true)
      return
    }
    setPaidCount(cartLines.length)
    setPaidChildNames(groups.map((g) => g.child.firstName))
    setDone(true)
    clearCart()
  }

  /* Hebrew list join: 1 → "א", 2 → "א ו-ב", 3+ → "א, ב ו-ג". */
  const joinHebrewNames = (names) => {
    if (names.length === 0) return ''
    if (names.length === 1) return names[0]
    const head = names.slice(0, -1).join(', ')
    return `${head} ו${names[names.length - 1]}`
  }

  if (done) {
    return (
      <div className="checkout__done">
        <img
          className="checkout__done-banner"
          src="/assets/scouts-success.jpg"
          alt=""
        />
        <h2>ההרשמה הושלמה בהצלחה!</h2>
        <p>
          נרשמו <strong className="scouts__ltr">{paidCount}</strong> פעילויות
          ל{joinHebrewNames(paidChildNames)}. אישור וחשבוניות נשלחו אליכם במייל
          וב-SMS.
        </p>
        <Button onClick={() => navigate(path('dashboard'))}>חזרה לסקירה הכללית</Button>
      </div>
    )
  }

  if (cartLines.length === 0) {
    return (
      <div className="checkout__done">
        <h2>אין פריטים לתשלום</h2>
        <p>הסל ריק — חזרו לדף הראשי כדי לבחור פעילויות.</p>
        <Button variant="ghost" icon={<ArrowLeft size={16} />} onClick={() => navigate(path('dashboard'))}>
          לדף הראשי
        </Button>
      </div>
    )
  }

  return (
    <form className="checkout" onSubmit={submit}>
      <div className="checkout__main">
        <div className="checkout__steps">
          {/* Cart is always done by the time the user is on /checkout; the
            * declaration becomes "done" only after every child is saved. */}
          <CheckoutSteps completedIndex={allChildrenSaved ? 1 : 0} />
        </div>
        <section
          className="s-card checkout__block"
          ref={declSectionRef}
        >
          <h2 className="checkout__block-title">הצהרת הורה</h2>

          {allChildrenSaved ? (
            <div className="checkout__decl-saved">
              <CheckCircle2
                size={28}
                className="checkout__decl-saved-icon"
                aria-hidden="true"
              />
              <p className="checkout__decl-saved-msg">
                {groups.length > 1
                  ? 'הצהרות הורים נשמרו בהצלחה'
                  : 'הצהרת הורים נשמרה בהצלחה'}
              </p>
              <button
                type="button"
                className="checkout__decl-saved-edit"
                onClick={() => setSavedChildren(new Set())}
              >
                עריכה
              </button>
            </div>
          ) : (
            <>
              <div className="checkout__decl-tabs">
                <ChildTabs
                  roster={groups.map((g) => g.child)}
                  activeId={activeDeclId}
                  onChange={setActiveDeclId}
                  variant="pill"
                />
              </div>

              {groups.map((g) => {
                if (g.child.id !== activeDeclId) return null
                const d = decls[g.child.id]
                const err = showErrors && !isChildComplete(g.child.id)
                const complete = isChildComplete(g.child.id)
                const currIdx = groups.findIndex(
                  (x) => x.child.id === g.child.id,
                )
                const nextUnsavedChild = groups
                  .slice(currIdx + 1)
                  .find((x) => !savedChildren.has(x.child.id))?.child
                return (
                  <ChildDeclaration
                    key={g.child.id}
                    child={g.child}
                    lines={g.lines}
                    value={d}
                    onChange={(patch) => setDecl(g.child.id, patch)}
                    showErrors={err}
                    isComplete={complete}
                    hasNext={!!nextUnsavedChild}
                    onShowTerms={() => setShowTerms(true)}
                    onSave={() => {
                      if (!complete) {
                        setShowErrors(true)
                        return
                      }
                      setSavedChildren(
                        (prev) => new Set([...prev, g.child.id]),
                      )
                      if (nextUnsavedChild) {
                        setActiveDeclId(nextUnsavedChild.id)
                        /* Scroll the next child's form to the top of the
                         * viewport so the parent doesn't have to scroll
                         * back up manually. */
                        declSectionRef.current?.scrollIntoView({
                          behavior: 'smooth',
                          block: 'start',
                        })
                      }
                    }}
                  />
                )
              })}
            </>
          )}
        </section>

        <section className="s-card checkout__block">
          <h2 className="checkout__block-title">פרטי תשלום</h2>
          <div className="checkout__pay-grid">
            <FormField label="שם בעל הכרטיס" name="holder" placeholder="ישראל כהן" />
            <FormField
              label="מספר כרטיס"
              name="card"
              inputMode="numeric"
              placeholder="0000 0000 0000 0000"
              value={card}
              onChange={(e) => setCard(formatCard(e.target.value))}
              maxLength={19}
            />
            <FormField
              label="תוקף"
              name="exp"
              inputMode="numeric"
              placeholder="MM/YY"
              value={exp}
              onChange={(e) => setExp(formatExp(e.target.value))}
              maxLength={5}
            />
            <FormField label="CVV" name="cvv" inputMode="numeric" placeholder="3 ספרות" />
          </div>
          <p className="checkout__secure">
            <ShieldCheck size={15} /> תשלום מאובטח — זהו אב־טיפוס, לא יבוצע חיוב אמיתי.
          </p>
        </section>
      </div>

      <aside className="checkout__aside">
        <div className="s-card">
          <h2 className="checkout__block-title">סיכום פעילויות והרשמה</h2>
          <ul className="checkout__lines">
            {groupLinesByChild(cartLines).map((group) => (
              <li key={group.child.id} className="checkout__group">
                <div className="checkout__group-head">
                  {group.child.avatar ? (
                    <img
                      className="checkout__avatar"
                      src={group.child.avatar}
                      alt={group.child.firstName}
                    />
                  ) : (
                    <span
                      className="checkout__dot"
                      style={{ background: group.child.color }}
                      aria-hidden="true"
                    >
                      {group.child.firstName[0]}
                    </span>
                  )}
                  <span className="checkout__group-name">
                    {group.child.firstName}
                    <span className="checkout__group-count">
                      {' '}
                      ({group.lines.length}{' '}
                      {group.lines.length === 1 ? 'פעילות' : 'פעילויות'})
                    </span>
                  </span>
                </div>
                <ul className="checkout__group-list">
                  {group.lines.map(({ activity }) => (
                    <li
                      key={`${group.child.id}-${activity.id}`}
                      className="checkout__group-item"
                    >
                      <strong>{activity.title}</strong>
                      <Price amount={activity.priceILS} muted />
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <div className="checkout__summary">
            <CartSummary />
          </div>
          <Button type="submit" full disabled={!allChildrenSaved}>
            אישור ותשלום · <Price amount={summary.total} />
          </Button>
          {!allChildrenSaved && (
            <p className="checkout__hint">
              יש לשמור את הצהרת ההורה לכל החניכים כדי להמשיך
            </p>
          )}
        </div>
      </aside>

      {showTerms && (
        <TermsModal
          onClose={() => setShowTerms(false)}
          onAccept={() => {
            if (activeDeclId) setDecl(activeDeclId, { terms: true })
            setShowTerms(false)
          }}
          onDecline={() => {
            if (activeDeclId) setDecl(activeDeclId, { terms: false })
            setShowTerms(false)
          }}
        />
      )}
    </form>
  )
}

/* Single-child parent declaration. The food question is a dropdown with a
 * "still accurate" confirmation; allergies / medical / photos are yes-no
 * toggles. The terms checkbox and the signature pad are the gate to mark
 * the child's declaration "complete". */
function ChildDeclaration({
  child,
  lines,
  value,
  onChange,
  showErrors,
  isComplete,
  hasNext,
  onSave,
  onShowTerms,
}) {
  const d = value
  const food = d.food || []
  const allergyEntries = d.allergyEntries || []
  const foodMissing = showErrors && (food.length === 0 || !d.foodVerified)
  const allergyMissing = showErrors && d.allergy === null
  const medicalMissing = showErrors && d.medical === null
  const photoMissing = showErrors && d.photo === null
  const termsMissing = showErrors && !d.terms
  const signMissing = showErrors && !d.signed

  return (
    <div className="checkout__decl">
      <p className="checkout__decl-intro">
        אני מאשר/ת בזאת את ההשתתפות של{' '}
        <strong>
          {child.firstName} {child.lastName}
        </strong>{' '}
        מספר זהות{' '}
        <strong className="scouts__ltr">{child.nationalId}</strong>{' '}
        בפעילות/יות:
      </p>
      <ul className="checkout__decl-acts">
        {lines.map(({ activity }) => (
          <li key={activity.id}>
            <strong>{activity.title}</strong>
          </li>
        ))}
      </ul>

      <DeclCard icon={<Utensils size={16} />} title="העדפות מזון">
        <div className="checkout__decl-field">
          <span className="checkout__decl-field-label">
            בחר.י (ניתן לבחור יותר מאחד)
          </span>
          <div className="checkout__food-pills">
            {FOOD_OPTIONS.map((o) => {
              const selected = food.includes(o)
              return (
                <button
                  key={o}
                  type="button"
                  className={`checkout__food-pill ${selected ? 'is-active' : ''}`}
                  onClick={() =>
                    onChange((curr) => {
                      const arr = curr.food || []
                      return {
                        food: arr.includes(o)
                          ? arr.filter((x) => x !== o)
                          : [...arr, o],
                      }
                    })
                  }
                >
                  {o}
                </button>
              )
            })}
          </div>
        </div>
        <label className="checkout__decl-check">
          <input
            type="checkbox"
            checked={d.foodVerified}
            onChange={(e) => onChange({ foodVerified: e.target.checked })}
          />
          <span>
            אני מאשר/ת כי העדפות המזון המוצגות הן עדכניות ונכונות למועד המפעל/ים
            הנוכחי
          </span>
        </label>
        {foodMissing && (
          <p className="checkout__decl-err">
            יש לבחור העדפת מזון או לסמן שהבחירה עדכנית
          </p>
        )}
      </DeclCard>

      <DeclCard icon={<Peanut size={16} />} title="אלרגיות">
        <YesNo
          label="לבני/בתי יש אלרגיה?"
          value={d.allergy}
          onChange={(v) =>
            onChange((curr) => ({
              allergy: v,
              allergyEntries: v === 'no' ? [] : curr.allergyEntries || [],
            }))
          }
          invalid={allergyMissing}
        />

        {d.allergy === 'yes' && (
          <div className="checkout__allergy-followup">
            <div className="checkout__decl-field">
              <span className="checkout__decl-field-label">
                סוג האלרגיה (ניתן לבחור יותר מאחד)
              </span>
              <div className="checkout__food-pills">
                {ALLERGY_OPTIONS.map((o) => {
                  const selected = allergyEntries.some((e) => e.name === o)
                  return (
                    <button
                      key={o}
                      type="button"
                      className={`checkout__food-pill ${
                        selected ? 'is-active' : ''
                      }`}
                      onClick={() =>
                        onChange((curr) => {
                          const arr = curr.allergyEntries || []
                          if (arr.some((e) => e.name === o)) {
                            return {
                              allergyEntries: arr.filter((e) => e.name !== o),
                            }
                          }
                          return {
                            allergyEntries: [
                              ...arr,
                              { name: o, lifeThreat: null, custom: '' },
                            ],
                          }
                        })
                      }
                    >
                      {o}
                    </button>
                  )
                })}
              </div>
              {showErrors && allergyEntries.length === 0 && (
                <p className="checkout__decl-err">
                  יש לבחור לפחות אלרגיה אחת
                </p>
              )}
            </div>

            {/* Per-allergy follow-up: life-threat toggle + custom text for "אחר" */}
            <ul className="checkout__allergy-rows">
              {allergyEntries.map((e, i) => {
                const lifeMissing =
                  showErrors &&
                  (e.lifeThreat === null || e.lifeThreat === undefined)
                const customMissing =
                  showErrors && e.name === 'אחר' && !(e.custom || '').trim()
                return (
                  <li key={e.name} className="checkout__allergy-row">
                    <div className="checkout__allergy-row-head">
                      <span className="checkout__allergy-row-name">{e.name}</span>
                    </div>

                    {e.name === 'אחר' && (
                      <div className="checkout__decl-field">
                        <span className="checkout__decl-field-label">
                          פרטו את האלרגיה
                        </span>
                        <input
                          type="text"
                          className="checkout__decl-input"
                          value={e.custom || ''}
                          onChange={(ev) => {
                            const txt = ev.target.value
                            onChange((curr) => ({
                              allergyEntries: (curr.allergyEntries || []).map(
                                (x, idx) =>
                                  idx === i ? { ...x, custom: txt } : x,
                              ),
                            }))
                          }}
                          placeholder="לדוגמה: תות שדה"
                        />
                        {customMissing && (
                          <p className="checkout__decl-err">
                            יש לפרט את האלרגיה
                          </p>
                        )}
                      </div>
                    )}

                    <YesNo
                      label="האם אלרגיה מסכנת חיים?"
                      value={e.lifeThreat}
                      onChange={(v) =>
                        onChange((curr) => ({
                          allergyEntries: (curr.allergyEntries || []).map(
                            (x, idx) =>
                              idx === i
                                ? {
                                    ...x,
                                    lifeThreat: v,
                                    // Clear stale treatment if life-threat flips back to "no"
                                    treatment: v === 'no' ? '' : x.treatment || '',
                                  }
                                : x,
                          ),
                        }))
                      }
                      invalid={lifeMissing}
                    />

                    {e.lifeThreat === 'yes' && (
                      <div className="checkout__decl-field">
                        <span className="checkout__decl-field-label">
                          מה הוא אופן הטיפול?
                        </span>
                        <input
                          type="text"
                          className="checkout__decl-input"
                          value={e.treatment || ''}
                          onChange={(ev) => {
                            const txt = ev.target.value
                            onChange((curr) => ({
                              allergyEntries: (curr.allergyEntries || []).map(
                                (x, idx) =>
                                  idx === i ? { ...x, treatment: txt } : x,
                              ),
                            }))
                          }}
                          placeholder="לדוגמה: מזרק אפיפן"
                        />
                        {showErrors && !(e.treatment || '').trim() && (
                          <p className="checkout__decl-err">
                            יש לפרט את אופן הטיפול
                          </p>
                        )}
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </DeclCard>

      <DeclCard icon={<BriefcaseMedical size={16} />} title="מגבלות רפואיות">
        <YesNo
          label="לבני/בתי יש מגבלה רפואית?"
          value={d.medical}
          onChange={(v) => onChange({ medical: v })}
          invalid={medicalMissing}
        />
      </DeclCard>

      <DeclCard icon={<Camera size={16} />} title="אישור צילום ופרסום">
        <YesNo
          label="הנני מאשר לתנועת הצופים לצלם ולהשתמש בתמונה/ות של בני/בתי בפרסומי התנועה"
          value={d.photo}
          onChange={(v) => onChange({ photo: v })}
          invalid={photoMissing}
        />
      </DeclCard>

      <label
        className={`checkout__decl-terms ${termsMissing ? 'has-error' : ''}`}
      >
        <input
          type="checkbox"
          checked={d.terms}
          onChange={(e) => onChange({ terms: e.target.checked })}
        />
        <span>
          הריני לאשר כי קראתי את תוכנית הפעילות, ידועים לי כל פרטיה והנני מסכים/ה
          שבני/תי ישתתפו בה, כמו כן, מאשר ההורה בהסכמה בלתי חוזרת כי הרחקת/פינוי
          החניך/ה מהפעילות וכן דרך, מועד ואופן עזיבת החניך/ה את הפעילות תהיה
          בהתאם לשיקול דעתו/ה הבלעדי של מנהל/ת הפעילות בשטח לאחר שקיבל/ה את
          אישור הגורמים הרלוונטיים בתנועה ובהתאם לנהליה ואני מאשר את{' '}
          <a
            href={path()}
            onClick={(e) => {
              e.preventDefault()
              onShowTerms?.()
            }}
          >
            תנאי הביטול
          </a>
        </span>
      </label>

      {showErrors && !d.terms && (
        <p className="checkout__decl-err">יש להסכים לתנאי הביטול</p>
      )}
      {showErrors && (!d.terms || !d.signed) && (
        <p className="checkout__decl-err">נא למלא את כל השדות לפני ביצוע חתימה</p>
      )}

      <div className={`checkout__signature ${signMissing ? 'has-error' : ''}`}>
        <SignaturePad
          signed={d.signed}
          onChange={(s) => onChange({ signed: s })}
        />
        <p className="checkout__signature-caption">חתימת הורה</p>
      </div>

      <div className="checkout__decl-save">
        <Button
          type="button"
          full
          onClick={onSave}
          disabled={!isComplete}
        >
          שמירת הצהרת הורה ל{child.firstName}
          {hasNext && isComplete ? ' והמשך לחניך הבא' : ''}
        </Button>
        {!isComplete && (
          <p className="checkout__hint">
            נא למלא את כל השדות לפני שמירת הצהרה
          </p>
        )}
      </div>
    </div>
  )
}

function DeclCard({ icon, title, children }) {
  return (
    <div className="checkout__decl-card">
      <h4 className="checkout__decl-card-title">
        {icon}
        <span>{title}</span>
      </h4>
      {children}
    </div>
  )
}

/* Peanut "icon" backed by the illustrated PNG in /public/assets so it
 * matches the rest of the hand-drawn illustration set rather than a
 * stroke-icon. The asset is colored, so we don't bind it to currentColor. */
function Peanut({ size = 16, ...props }) {
  return (
    <img
      src="/assets/peanut1.svg"
      alt=""
      width={size}
      height={size}
      style={{ display: 'inline-block', objectFit: 'contain' }}
      {...props}
    />
  )
}

/* Free-hand signature pad. Tracks pointer drags onto a <canvas> and reports
 * `signed=true` once any stroke lands. Re-renders preserve the drawing —
 * we resize/clear the bitmap only on first mount and on explicit clear. */
function SignaturePad({ signed, onChange }) {
  const canvasRef = useRef(null)
  const drawingRef = useRef(false)
  const lastRef = useRef({ x: 0, y: 0 })

  /* High-DPI canvas backing store so strokes stay crisp on retina screens. */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    const ctx = canvas.getContext('2d')
    ctx.scale(dpr, dpr)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = '#1a1a1a'
    ctx.lineWidth = 2
  }, [])

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    const point = e.touches?.[0] || e
    return { x: point.clientX - rect.left, y: point.clientY - rect.top }
  }

  const start = (e) => {
    e.preventDefault()
    drawingRef.current = true
    lastRef.current = getPos(e)
  }

  const move = (e) => {
    if (!drawingRef.current) return
    e.preventDefault()
    const pos = getPos(e)
    const ctx = canvasRef.current.getContext('2d')
    ctx.beginPath()
    ctx.moveTo(lastRef.current.x, lastRef.current.y)
    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
    lastRef.current = pos
    if (!signed) onChange(true)
  }

  const end = () => {
    drawingRef.current = false
  }

  const clear = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    onChange(false)
  }

  return (
    <div className="checkout__signature-pad">
      <canvas
        ref={canvasRef}
        className="checkout__signature-canvas"
        onMouseDown={start}
        onMouseMove={move}
        onMouseUp={end}
        onMouseLeave={end}
        onTouchStart={start}
        onTouchMove={move}
        onTouchEnd={end}
        aria-label="חתימה — צייר חתימה במסך"
      />
      {!signed && <span className="checkout__signature-hint">חתמו כאן</span>}
      {signed && (
        <button
          type="button"
          className="checkout__signature-clear"
          onClick={clear}
        >
          ניקוי
        </button>
      )}
      <Pencil size={16} className="checkout__signature-pencil" />
    </div>
  )
}

/* Static cancellation-policy modal opened from the terms checkbox link.
 * Long body is scrollable inside the modal. */
function TermsModal({ onClose, onAccept, onDecline }) {
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <div className="s-modal__scrim" onClick={onClose} role="presentation">
      <div
        className="s-modal s-modal--wide checkout__terms-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="terms-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="s-modal__head">
          <div className="checkout__terms-titlewrap">
            <img
              className="checkout__terms-logo"
              src="/assets/zofim-logo.png"
              alt="תנועת הצופים"
            />
            <h3 id="terms-modal-title" className="s-modal__title">
              תנאי הביטול
            </h3>
          </div>
          <button
            type="button"
            className="s-modal__close"
            onClick={onClose}
            aria-label="סגירה"
          >
            <X size={18} />
          </button>
        </header>

        <div className="checkout__terms-body">
          <h4 className="checkout__terms-h2">מדיניות ביטולים והחזרים</h4>
          <p className="checkout__terms-note">(עדכון יוני 2026)</p>

          <h5 className="checkout__terms-h3">כללי</h5>
          <p>
            אני מצהיר כי ביררתי מראש וקראתי את פרטי הפעילות נשוא האישור. ידוע
            לי כי במקרה של כוח עליון כגון: מלחמה או מבצע צבאי מהותי המשפיע על
            שגרת החיים במדינה, שביתה כללית, פגעי טבע, מזג אוויר גשום שאינו
            מאפשר פעילות צופית ו/או עלול להוות סכנה לחניכים, או תנאי שרב
            שעלולים לסכן את בריאותם של החניכים ו/או בשל כל סיבה שלפי שיקול
            הדעת של התנועה מהווה סכנה לחניכים ו/או בשל הוראה של משרד החינוך
            ו/א כל גוף ציבורי אחר, אני מוותר מראש על כל תביעה בגין ביטול
            בנסיבות כאמור לעיל.
          </p>
          <p>
            עוד ידוע לי ואני מסכים לכך שגובה ההחזר במקרה של ביטול כאמור יהיה
            בהתאם להחלטת התנועה. בנוסף, אני מאשר כי ידוע לי ואני מסכים כי כל
            החזר בגין ביטול או אי השתתפות יתבצע באמצעות המחאה של השבט או
            באמצעות ביטול החיוב אצל חברת כרטיסי האשראי, לפי נהלי ההחזר של
            התנועה. בביצוע רישום ותשלום לתנועת הצופים אני מסכים למדיניות
            הביטולים וההחזרים המפורטת במסמך זה.
          </p>

          <h5 className="checkout__terms-h3">הגדרות</h5>
          <ul className="checkout__terms-list">
            <li>
              <strong>דמי חבר</strong> – תשלום חד פעמי אשר מועבר ע"י החניך
              לשבט בגין חברות בפעילות התנועה לתקופה מוגדרת. דמי החבר כוללים
              דמי רישום.
            </li>
            <li>
              <strong>דמי רישום</strong> – תשלום של השבט להנהגה ולמטה בגין כל
              חניך אשר נרשם לתנועה. דמי הרישום ניתנים להחזרה רק כאשר הביטול
              בוצע תוך 14 ימים ממועד הרישום של החניך או ממועד קבלת המסמך
              המכיל את פרטי העסקה, בין אם החל מתן השירות ובין אם לאו, וזאת
              בניכוי דמי ביטול. גובה דמי הרישום אינו זהה בין ההנהגות.
            </li>
            <li>
              <strong>דמי ביטול</strong> – דמי ביטול הינם 5% ממחיר העסקה.
            </li>
            <li>
              <strong>תשלום למפעלים</strong> (חנוכה, פסח, קיץ וכו') – תשלום
              אשר מועבר ע"י החניך לשבט בגין השתתפות בפעילות קצרת מועד
              ומוגדרת.
            </li>
          </ul>

          <h5 className="checkout__terms-h3">הודעת ביטול</h5>
          <p>
            הודעת ביטול בגין דמי חבר ו/או תשלום למפעלים תחשב תקפה משפטית אך
            ורק אם נמסרה באמצעות פורטל ההורים המקוון של התנועה. הודעת ביטול
            שתשלח בהודעת טקסט/טלפון לטלפון נייד לא תיחשב הודעת ביטול כדין.
          </p>
          <p>
            למען הסר ספק, הודעות אשר יישלחו באמצעות מסרונים (SMS), ו/או
            יישמוני הודעות (WhatsApp) ו/או שיחות טלפוניות ו/או הודעות בעל-פה
            לדרג המדריך או המרכז, לא ייחשבו כהודעות ביטול תקפה בהתאם למדיניות
            זו וכפועל יוצא לא יזכו את המזמין להחזר כלשהו.
          </p>
          <p>
            דמי החבר כולל דמי הרישום, לא יוחזרו אלא אם כן הביטול בוצע תוך 14
            ימים ממועד הרישום של החניך או ממועד קבלת המסמך המכיל את פרטי
            העסקה, בין אם החל מתן השירות ובין אם לאו.
          </p>
          <p>
            ביטול רישום למפעל תתאפשר תוך 14 יום מיום הרישום למפעל ולא פחות
            מ-7 ימים (לא כולל שבת וחג) לפני יום היציאה למפעל.
          </p>
          <p>
            בתשלום למפעלים ינוכו 5% דמי ביטול במקרה של ביטול הרישום או המפעל.
          </p>

          <h5 className="checkout__terms-h3">זכאות להחזר כספי</h5>
          <p>
            <strong>א.</strong> זכאות להחזר כספי בגין ביטול תשלום דמי חבר
            ו/או דמי רישום – ביטל החניך את הרשמתו לתנועה (לפעילות השוטפת)
            תוך 14 ימים ממועד רישום החניך או ממועד קבלת המסמך המכיל את פרטי
            העסקה, בין אם החל מתן השירות ובין אם לאו, יהא החניך זכאי לקבלת
            מלוא דמי החבר כולל דמי הרישום בניכוי דמי הביטול. ביטל החניך את
            הרשמתו לאחר 14 יום כאמור, יהא החניך זכאי לקבלת החזר מדורג בהתאם
            לאמור בסעיף 4ד' להלן בניכוי דמי הרישום. בכל אופן לא יהא זכאי
            החניך בדמי הרישום.
          </p>
          <p>
            <strong>ב.</strong> זכאות להחזר כספי בגין ביטול תשלום למפעלים
            (חנוכה, פסח, קיץ וכו') – ביטל החניך את הרשמתו תוך 14 יום מיום
            הרישום למפעל ולא פחות מ-7 ימים (לא כולל שבת וחג) לפני יום היציאה
            למפעל, יהא החניך זכאי לקבלת מלוא התשלום בניכוי דמי הביטול.
          </p>
          <p>
            <strong>ביטול בשל מחלה</strong> – ביטל חניך את השתתפותו במפעל
            בשל מחלה, בטרם היציאה למפעל, יהא החניך זכאי לקבל החזר כספי בניכוי
            הסכום שיפורסם בחוזר ע"י השבט. האמור כפוף לכך שבטרם סיום המפעל,
            העביר החניך אישור רפואי בדבר מחלתו בתקופת המפעל. הצגת אישור לאחר
            סיום המפעל לא תזכה את החניך בכל החזר כספי. את האישור הרפואי יש
            לצרף להודעת הביטול בפורטל ההורים המקוון של התנועה, כאמור בסעיף 3
            לעיל.
          </p>
          <p>
            למען הסר ספק, החניך לא יהא זכאי לקבלת החזר כספי כלשהו במקרה בו
            החניך עוזב במהלך המפעל מכל סיבה שהיא, כולל במקרה שהחניך מורחק
            מהמפעל בגלל התנהגות לא ראויה ו/או אי עמידה בנהלי התנועה /
            ההנהגה או השבט, שהתקבלה תוך כדי מפעל.
          </p>
          <p>
            <strong>ג.</strong> משנתמלאו התנאים המפורטים בסעיף "הודעת
            ביטול", ההחזר יבוצע במעמד ביטול העסקה, או במועד הקרוב לכך ולא
            יאוחר מ-14 ימים מקבלת הודעת הביטול.
          </p>
          <p>
            <strong>ד.</strong> דגשים נוספים לחישוב זכאות להחזר כספי בגין
            ביטול תשלום דמי חבר – חניך אשר התקבלה הודעת ביטול עבורו יהיה
            זכאי להחזר בהתאם לתנאים הבאים:
          </p>
          <ul className="checkout__terms-list">
            <li>
              דמי הרישום מתוך סך דמי החבר (שלא יוחזרו בגין ביטול) יעמדו על
              סך של 100 ₪.
            </li>
            <li>
              דמי החבר בניכוי דמי הרישום משולמים עבור חודשי הפעילות החל
              מחודש ספטמבר ועד לחודש יולי.
            </li>
            <li>
              במקרה של ביטול יוזכה ההורה בחלק היחסי (בחודשים) עד לסיום שנת
              הפעילות (חודש יולי) בניכוי דמי הרישום. ההחזר יותאם לתקופת
              הפעילות בהתאם לחודשי תחילת הפעילות בשבט (ספטמבר או אוקטובר).
            </li>
            <li>
              חישוב חודשי הזיכוי יעשו מהחודש העוקב ליום ההודעה (לדוגמה:
              ביטול ב-10.10 – יחושב זיכוי החל מחודש נובמבר).
            </li>
          </ul>
        </div>

        <div className="s-modal__actions">
          <Button variant="ghost" onClick={onDecline || onClose}>
            לא מאשר/ת
          </Button>
          <Button onClick={onAccept || onClose}>מאשר/ת</Button>
        </div>
      </div>
    </div>
  )
}

function YesNo({ label, value, onChange, invalid }) {
  return (
    <div className="checkout__yesno">
      <p className="checkout__yesno-label">{label}</p>
      <div className={`checkout__yesno-pills ${invalid ? 'has-error' : ''}`}>
        <button
          type="button"
          className={`checkout__yesno-pill ${value === 'no' ? 'is-active' : ''}`}
          onClick={() => onChange('no')}
        >
          לא
        </button>
        <button
          type="button"
          className={`checkout__yesno-pill ${value === 'yes' ? 'is-active' : ''}`}
          onClick={() => onChange('yes')}
        >
          כן
        </button>
      </div>
    </div>
  )
}
