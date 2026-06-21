import './primitives.css'

/**
 * Labeled form control. `as`: 'input' | 'select' | 'textarea'.
 * For 'select', pass `options` as an array of strings or {value,label}.
 */
export default function FormField({
  label,
  as = 'input',
  options = [],
  required = false,
  note,
  noteAlert = false,
  id,
  className = '',
  ...rest
}) {
  const fieldId = id || rest.name
  const controlClass = `s-field__control${
    as === 'textarea' ? ' s-field__control--textarea' : ''
  }`

  return (
    <div className={`s-field ${className}`}>
      {label && (
        <label className="s-field__label" htmlFor={fieldId}>
          {label}
          {required && <span className="s-field__req">*</span>}
        </label>
      )}

      {as === 'select' ? (
        <select id={fieldId} className={controlClass} {...rest}>
          {options.map((opt) => {
            const value = typeof opt === 'object' ? opt.value : opt
            const text = typeof opt === 'object' ? opt.label : opt
            return (
              <option key={value} value={value}>
                {text}
              </option>
            )
          })}
        </select>
      ) : as === 'textarea' ? (
        <textarea id={fieldId} className={controlClass} {...rest} />
      ) : (
        <input id={fieldId} className={controlClass} {...rest} />
      )}

      {note && (
        <span className={`s-field__note${noteAlert ? ' s-field__note--alert' : ''}`}>
          {note}
        </span>
      )}
    </div>
  )
}
