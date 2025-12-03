import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import styles from "../styles/Header.module.css";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

    const isLoggedIn = !!localStorage.getItem("userId");
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

            {isLoggedIn && (
              <>
                <Link 
                  to="/my-bookings" 
                  className={`${styles.navLink} ${isActive('/my-bookings')}`}
                  onClick={closeMenu}
                >
                  My Bookings
                </Link>

                {/* optional later when you have page ready */}
                {/* <Link 
                  to="/my-offers" 
                  className={`${styles.navLink} ${isActive('/my-offers')}`}
                  onClick={closeMenu}
                >
                  My Offers
                </Link> */}
              </>
            )}

            <Link 
              to="/maps" 
              className={`${styles.navLink} ${isActive('/maps')}`}
              onClick={closeMenu}
            >
              Map
            </Link>

            {isLoggedIn && (
              <Link 
                to="/profile" 
                className={`${styles.navLink} ${isActive('/profile')}`}
                onClick={closeMenu}
              >
                Profile
              </Link>
            )}
          </div>

          <div className={styles.authButtons}>
            {!isLoggedIn ? (
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
              <>
                <span style={{ marginRight: "8px" }}>
                  {username ? `Hi, ${username}` : "Logged in"}
                </span>
                <button
                  type="button"
                  className={styles.loginButton}
                  onClick={() => {
                    localStorage.removeItem("userId");
                    localStorage.removeItem("username");
                    closeMenu();
                    window.location.href = "/"; // force refresh, simplest
                  }}
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </nav>

      </div>
    </header>
  );
}
