import React from "react";
import { Link } from "react-router-dom";
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiMapPin, FiPhone, FiMail } from "react-icons/fi";
import styles from "../styles/Footer.module.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerContent}>
          {/* About Section */}
          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>BikePooling</h3>
            <p className={styles.aboutText}>
              Connecting riders and commuters for a greener, more affordable way to travel. 
              Join our community today and make your commute better.
            </p>
            <div className={styles.socialLinks}>
              <a href="https://facebook.com" aria-label="Facebook" className={styles.socialLink}>
                <FiFacebook />
              </a>
              <a href="https://twitter.com" aria-label="Twitter" className={styles.socialLink}>
                <FiTwitter />
              </a>
              <a href="https://instagram.com" aria-label="Instagram" className={styles.socialLink}>
                <FiInstagram />
              </a>
              <a href="https://linkedin.com" aria-label="LinkedIn" className={styles.socialLink}>
                <FiLinkedin />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>Quick Links</h3>
            <ul className={styles.footerLinks}>
              <li><Link to="/" className={styles.footerLink}>Home</Link></li>
              <li><Link to="/about" className={styles.footerLink}>About Us</Link></li>
              <li><Link to="/book" className={styles.footerLink}>Book a Ride</Link></li>
              <li><Link to="/offer" className={styles.footerLink}>Offer a Ride</Link></li>
              <li><Link to="/contact" className={styles.footerLink}>Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>Contact Us</h3>
            <ul className={styles.contactInfo}>
              <li className={styles.contactItem}>
                <FiMapPin className={styles.contactIcon} />
                <span>123 Bike Lane, Cycling City, 10001</span>
              </li>
              <li className={styles.contactItem}>
                <FiPhone className={styles.contactIcon} />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className={styles.contactItem}>
                <FiMail className={styles.contactIcon} />
                <span>info@bikepooling.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>Newsletter</h3>
            <p className={styles.newsletterText}>
              Subscribe to our newsletter for the latest updates and offers.
            </p>
            <form className={styles.newsletterForm}>
              <input 
                type="email" 
                placeholder="Your email address" 
                className={styles.newsletterInput}
                required 
              />
              <button type="submit" className={styles.newsletterButton}>
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p className={styles.copyright}>
            &copy; {currentYear} BikePooling. All rights reserved.
          </p>
          <div className={styles.legalLinks}>
            <Link to="/privacy" className={styles.legalLink}>Privacy Policy</Link>
            <span className={styles.divider}>|</span>
            <Link to="/terms" className={styles.legalLink}>Terms of Service</Link>
            <span className={styles.divider}>|</span>
            <Link to="/cookies" className={styles.legalLink}>Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
