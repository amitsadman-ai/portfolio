import { Linkedin, Mail, Phone } from 'lucide-react'
import { CONTACT } from '../data/contact'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="container footer__inner">
        <h2 className="footer__title">Let's Keep in Touch</h2>

        <ul className="footer__list">
          <li>
            <a className="footer__link" href={`mailto:${CONTACT.email}`}>
              <Mail size={18} />
              {CONTACT.email}
            </a>
          </li>
          <li>
            <a className="footer__link" href={`tel:${CONTACT.phoneHref}`}>
              <Phone size={18} />
              {CONTACT.phone}
            </a>
          </li>
          <li>
            <a
              className="footer__link"
              href={CONTACT.linkedin}
              target="_blank"
              rel="noreferrer"
            >
              <Linkedin size={18} />
              LinkedIn
            </a>
          </li>
        </ul>

        <p className="footer__sign">Amit Mittlman</p>
        <p className="footer__copy">© {new Date().getFullYear()} Amit Mittlman · Product Designer</p>
      </div>
    </footer>
  )
}
