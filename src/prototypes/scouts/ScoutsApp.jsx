import { Routes, Route, Navigate } from 'react-router-dom'
import { ScoutsProvider } from './ScoutsProvider'
import PortalLayout from './PortalLayout'
import LoginScreen from './screens/LoginScreen'
import DashboardScreen from './screens/DashboardScreen'
import CheckoutScreen from './screens/CheckoutScreen'
import AddChildScreen from './screens/AddChildScreen'
import HistoryScreen from './screens/HistoryScreen'
import FamilyScreen from './screens/FamilyScreen'
import ContactTribeScreen from './screens/ContactTribeScreen'
import DiscountsScreen from './screens/DiscountsScreen'
import './scouts.css'

/**
 * Israeli Scouts Parent Portal — interactive prototype.
 *
 * Mounted at /work/israeli-scouts/demo, OUTSIDE the portfolio chrome.
 * The single `.scouts` + dir="rtl" wrapper scopes RTL, the Alef font,
 * and the brand palette to this subtree only — nothing leaks to the
 * English / LTR portfolio.
 */
export default function ScoutsApp() {
  return (
    <ScoutsProvider>
      <div className="scouts" dir="rtl">
        <Routes>
          <Route index element={<LoginScreen />} />
          <Route element={<PortalLayout />}>
            <Route path="dashboard" element={<DashboardScreen />} />
            <Route path="family" element={<FamilyScreen />} />
            <Route path="add-child" element={<AddChildScreen />} />
            <Route path="history" element={<HistoryScreen />} />
            <Route path="contact" element={<ContactTribeScreen />} />
            <Route path="discounts" element={<DiscountsScreen />} />
            <Route path="checkout" element={<CheckoutScreen />} />
          </Route>
          <Route path="*" element={<Navigate to="" replace />} />
        </Routes>
      </div>
    </ScoutsProvider>
  )
}
