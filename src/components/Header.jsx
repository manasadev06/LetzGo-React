import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import styles from "../styles/Header.module.css";

export default function Header({ theme, setTheme }) {

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const location = useLocation();
 const isLoggedIn = Boolean(localStorage.getItem("userId"));
  const username = localStorage.getItem("username");


  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path ? styles.active : '';
  };

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <Link to="/" className={styles.logo} onClick={closeMenu}>
            <span className={styles.logoIcon}>🚴</span>
            BikePooling
          </Link>
        </div>

        <button 
          className={styles.menuButton} 
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

                <nav className={`${styles.nav} ${isMenuOpen ? styles.navActive : ''}`}>
          <div className={styles.navLinks}>
            <Link 
              to="/offer" 
              className={`${styles.navLink} ${isActive('/offer')}`}
              onClick={closeMenu}
            >
              Offer a Ride
            </Link>

            <Link 
              to="/book" 
              className={`${styles.navLink} ${isActive('/book')}`}
              onClick={closeMenu}
            >
              Book a Ride
            </Link>
          </div>




          <div className={styles.authButtons}>
  {!isLoggedIn ? (
    // 🔹 NOT LOGGED IN → show Login + Signup
    <>
      <Link
        to="/login"
        className={styles.loginButton}
        onClick={closeMenu}
      >
        Log In
      </Link>

      <Link
        to="/signup"
        className={styles.signupButton}
        onClick={closeMenu}
      >
        Sign Up
      </Link>
    </>
  ) : (
    // 🔹 LOGGED IN → show "Hi, username" dropdown
    <div
      className={styles.profileWrapper}
      onClick={() => setShowProfileMenu((prev) => !prev)}
    >
      <span className={styles.profileTrigger}>
        Hi, {username || "User"} ▾
      </span>

      {showProfileMenu && (
        <div className={styles.profileMenu}>
          <Link
            to="/profile"
            onClick={() => {
              setShowProfileMenu(false);
              closeMenu();
            }}
            className={styles.menuItem}
          >
            Profile
          </Link>

          <Link
            to="/dashboard"
            onClick={() => {
              setShowProfileMenu(false);
              closeMenu();
            }}
            className={styles.menuItem}
          >
            Dashboard
          </Link>

          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
            className={styles.menuItemDanger}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  )}
</div>


        </nav>

      </div>
    </header>
  );
}
