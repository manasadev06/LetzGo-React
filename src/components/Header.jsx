import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiMenu, FiX, FiUser, FiChevronDown } from "react-icons/fi";
import styles from "../styles/Header.module.css";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const location = useLocation();

  const isLoggedIn = Boolean(localStorage.getItem("userId"));
  const username = localStorage.getItem("username");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path) => (location.pathname === path ? styles.active : "");

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.container}>

        {/* Branding */}
        <Link to="/" className={styles.logo}>
          <span>🚴</span> BikePooling
        </Link>

        {/* Mobile Menu Button */}
        <button
          className={styles.menuButton}
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        {/* Main Navigation */}
        <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ""}`}>

          <Link to="/offer" className={`${styles.navLink} ${isActive("/offer")}`}>
            Offer a Ride
          </Link>

          <Link to="/book" className={`${styles.navLink} ${isActive("/book")}`}>
            Book a Ride
          </Link>

          {/* RIGHT SIDE AUTH BUTTONS */}
          {!isLoggedIn ? (
            <div className={styles.authButtons}>
              <Link to="/login" className={styles.loginBtn}>Log In</Link>
              <Link to="/signup" className={styles.signupBtn}>Sign Up</Link>
            </div>
          ) : (
            <div className={styles.profileArea}>
              <button
                className={styles.profileTrigger}
                onClick={() => setShowProfileMenu((prev) => !prev)}
              >
                <FiUser size={18} />
                <span>{username || "User"}</span>
                <FiChevronDown size={16} />
              </button>

              {showProfileMenu && (
                <div className={styles.profileDropdown}>
                  <Link to="/profile" className={styles.dropdownItem}>Profile</Link>
                  <Link to="/dashboard" className={styles.dropdownItem}>Dashboard</Link>

                  <button
                    className={styles.logout}
                    onClick={() => {
                      localStorage.clear();
                      window.location.href = "/";
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

        </nav>
      </div>
    </header>
  );
}
