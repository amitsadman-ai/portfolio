import { Fragment } from 'react'
import './DataTable.css'

/**
 * Responsive data table. `columns`: [{ key, label, render?(row), align? }].
 * Desktop renders a <table>; ≤768px each row becomes a stacked card with
 * the column label shown beside each value (via data-label).
 */
export default function DataTable({
  columns,
  rows,
  getRowKey,
  empty,
  isExpanded,
  renderExpanded,
  footer,
}) {
  if (!rows.length && empty) {
    return <div className="s-table__empty">{empty}</div>
  }

  /* When any column declares an explicit `width`, switch to a fixed
   * layout so the widths are honoured exactly. This is how two adjacent
   * tables can be made to line up their columns vertically. */
  const hasFixedWidths = columns.some((c) => c.width)

  return (
    <div className="s-table-wrap">
      <table
        className="s-table"
        style={hasFixedWidths ? { tableLayout: 'fixed' } : undefined}
      >
        {hasFixedWidths && (
          <colgroup>
            {columns.map((col) => (
              <col key={col.key} style={{ width: col.width }} />
            ))}
          </colgroup>
        )}
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={{ textAlign: col.align || 'start' }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const key = getRowKey ? getRowKey(row) : i
            const expanded = isExpanded ? isExpanded(row) : false
            return (
              <Fragment key={key}>
                <tr>
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      data-label={col.label}
                      style={{ textAlign: col.align || 'start' }}
                    >
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
                {expanded && renderExpanded && (
                  <tr className="s-table__expanded">
                    <td colSpan={columns.length}>{renderExpanded(row)}</td>
                  </tr>
                )}
              </Fragment>
            )
          })}
        </tbody>
        {footer && <tfoot>{footer}</tfoot>}
      </table>
    </div>
  )
}
