/* Open activities parents can register children for (פעילויות פתוחות להרשמה). */

/* type → Hebrew label + accent for the card header */
export const ACTIVITY_TYPES = {
  camp: { label: 'מחנה', accent: '#8C2F39' },
  seminar: { label: 'סמינר', accent: '#3f6f9e' },
  course: { label: 'קורס', accent: '#b06b1f' },
  trip: { label: 'טיול', accent: '#1f8a8a' },
  event: { label: 'אירוע', accent: '#9a4b86' },
}

export const activities = [
  {
    id: 'camp-summer',
    title: "מחנה קיץ ארצי – שכבה ז'-ח'",
    type: 'camp',
    location: 'יער בן שמן',
    dateRange: '09/07/24 – 11/07/24',
    deadline: '01/07/24',
    priceILS: 1300,
    lastSpots: false,
    grades: ["ז'", "ח'"],
    description: 'שלושה ימי מחנה עם לינת שטח, פעולות שיא וקורס מסכם לשכבה.',
  },
  {
    id: 'seminar-leadership',
    title: 'סמינר מנהיגות צעירה',
    type: 'seminar',
    location: 'מדרשת שדה בוקר',
    dateRange: '22/08/24 – 24/08/24',
    deadline: '10/08/24',
    priceILS: 450,
    lastSpots: false,
    grades: ["ח'"],
    description: 'סוף שבוע העצמה והכשרת מובילים לקראת שנת הפעילות הבאה.',
  },
  {
    id: 'course-madatz',
    title: 'קורס מד"צ – מדריכים צעירים',
    type: 'course',
    location: 'שבט אופק, תל אביב',
    dateRange: 'אורך הקורס: 8 מפגשים',
    deadline: '05/09/24',
    priceILS: 600,
    lastSpots: false,
    grades: ["ח'"],
    description: 'הכשרה להדרכה: בניית פעולה, עבודה מול קבוצה ובטיחות.',
  },
  {
    id: 'trip-north',
    title: 'טיול שבטי – גליל עליון',
    type: 'trip',
    location: 'נחל כזיב',
    dateRange: '14/06/24',
    deadline: '07/06/24',
    priceILS: 120,
    lastSpots: false,
    grades: ["ד'", "ה'", "ו'", "ז'"],
    description: 'יום טיול שבטי הכולל הסעות, מים ופעילות שיא בסיום.',
  },
  {
    id: 'event-festival',
    title: 'פסטיבל שבטים – פתיחת שנה',
    type: 'event',
    location: 'פארק הירקון',
    dateRange: '06/09/24',
    deadline: '01/09/24',
    priceILS: 35,
    lastSpots: false,
    grades: ["ד'", "ה'", "ו'", "ז'", "ח'"],
    description: 'אירוע פתיחת שנת הפעילות לכל המשפחה – דוכנים, הופעות ומשחקים.',
  },
  {
    id: 'course-firstaid',
    title: 'השתלמות עזרה ראשונה',
    type: 'course',
    location: 'שבט אופק, תל אביב',
    dateRange: '18/08/24',
    deadline: '11/08/24',
    priceILS: 90,
    lastSpots: true,
    grades: ["ו'", "ז'", "ח'"],
    description: 'יום הכשרה בעזרה ראשונה בסיסית בהדרכת מד"א.',
  },
]

export const getActivity = (id) => activities.find((a) => a.id === id)

/* Activities a given child is eligible for, by their שכבה (grade). */
export const activitiesForChild = (child) =>
  activities.filter((a) => a.grades.includes(child.grade))
