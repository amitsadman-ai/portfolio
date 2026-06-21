/* Member discounts (הנחות חבר) shown on the dedicated page and applied at checkout. */

export const discounts = [
  {
    id: 'sibling',
    title: 'הנחת אחים',
    description: 'הנחה אוטומטית מהחניך השני ואילך באותה הרשמה.',
    kind: 'percent',
    value: 10,
    auto: true,
  },
  {
    id: 'veteran',
    title: 'הנחת חבר ותיק',
    description: 'למשפחות חברות בתנועה שלוש שנים ומעלה.',
    kind: 'percent',
    value: 5,
    auto: true,
  },
  {
    id: 'early',
    title: 'הרשמה מוקדמת',
    description: 'בהרשמה עד 30 יום לפני מועד הפעילות.',
    kind: 'fixed',
    value: 50,
    auto: false,
  },
]

/* Family account balances surfaced in the cart summary. */
export const familyBalance = {
  credit: 120, // יתרת זכות
  due: 0, // יתרת חובה
}
