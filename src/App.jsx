import { Routes, Route, Outlet } from 'react-router-dom'
import Background from './components/Background'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import CaseStudy from './pages/CaseStudy'
import About from './pages/About'
import ScoutsApp from './prototypes/scouts/ScoutsApp'

/* Portfolio chrome: background + header + footer wrap every site page. */
function SiteLayout() {
  return (
    <>
      <Background />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <Routes>
      {/* Scouts prototype — standalone, full-screen, RTL, no portfolio chrome.
          Declared before the layout group; the static path also out-ranks
          the dynamic /work/:slug in React Router v6 matching. */}
      <Route path="/work/israeli-scouts/demo/*" element={<ScoutsApp />} />

      <Route element={<SiteLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/work/:slug" element={<CaseStudy />} />
        <Route path="/about" element={<About />} />
      </Route>
    </Routes>
  )
}
