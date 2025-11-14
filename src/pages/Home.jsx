import React from "react";
import { Link } from "react-router-dom";
import SearchForm from "../components/SearchForm";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Ride Smarter, <span className={styles.highlight}>Save Greener</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Connect with fellow commuters and share your ride. Save money, reduce traffic, and make your daily commute more enjoyable.
          </p>
          
          <div className={styles.searchContainer}>
            <SearchForm />
          </div>

          <div className={styles.features}>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>🚗</span>
              <span>Share Rides</span>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>💰</span>
              <span>Save Money</span>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>🌍</span>
              <span>Reduce Carbon Footprint</span>
            </div>
          </div>
        </div>
        <div className={styles.heroImage}>
          <img src="https://media3.giphy.com/media/LVKiYd9wufSPyyHeTK/source.gif" alt="People riding bikes together" />
        </div>
      </header>

      {/* How It Works Section */}
      <section className={styles.howItWorks}>
        <div className={styles.sectionHeader}>
          <h2>How It Works</h2>
          <p>Get started in just a few simple steps</p>
        </div>
        
        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <div className={styles.stepContent}>
              <h3>Create Your Profile</h3>
              <p>Sign up and set your preferences for the perfect ride match.</p>
            </div>
          </div>
          
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepContent}>
              <h3>Find or Offer a Ride</h3>
              <p>Search for rides or post your own route and schedule.</p>
            </div>
          </div>
          
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepContent}>
              <h3>Connect & Ride</h3>
              <p>Chat with your ride match and confirm the details.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <h2>Ready to Start Your Journey?</h2>
        <p>Join our community of eco-conscious commuters today.</p>
        <div className={styles.ctaButtons}>
          <Link to="/signup" className={styles.primaryButton}>Sign Up Now</Link>
          <Link to="/book" className={styles.secondaryButton}>Find a Ride</Link>
        </div>
      </section>
    </div>
  );
}
