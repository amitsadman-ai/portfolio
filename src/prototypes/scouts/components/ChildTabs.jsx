import './primitives.css'

/**
 * Per-child tab switcher (אלון / מיכאל / דניאלה), optionally with an
 * "all children" tab (used in the cart). Mirrors the portfolio's
 * AppFixes tablist a11y (role=tablist/tab, aria-selected).
 *
 * `activeId` is a child id, or 'all' when includeAll is set.
 */
export default function ChildTabs({
  roster,
  activeId,
  onChange,
  includeAll = false,
  allLabel = 'כולם',
  variant = 'underline',
}) {
  const tabs = includeAll
    ? [{ id: 'all', firstName: allLabel }, ...roster]
    : roster

  const isPill = variant === 'pill'
  const groupCls = isPill ? 's-filters' : 's-childtabs'
  const tabCls = isPill ? 's-filter' : 's-childtab'

  return (
    <div className={groupCls} role="tablist">
      {tabs.map((t) => {
        const active = activeId === t.id
        return (
          <button
            key={t.id}
            role="tab"
            type="button"
            aria-selected={active}
            className={`${tabCls} ${isPill && active ? 'is-active' : ''}`.trim()}
            onClick={() => onChange(t.id)}
          >
            {t.firstName}
          </button>
        )
      })}
    </div>
  )
}
