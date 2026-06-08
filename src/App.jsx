import { Routes, Route } from 'react-router-dom'
import Background from './components/Background'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import CaseStudy from './pages/CaseStudy'
import About from './pages/About'

export default function App() {
  return (
    <>
      <Background />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work/:slug" element={<CaseStudy />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
