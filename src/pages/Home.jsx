import React from "react";
import { Link } from "react-router-dom";
import SearchForm from "../components/SearchForm";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.page}>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroLeft}>
          <h1 className={styles.heroTitle}>
            Find the Smarter Way to Commute
          </h1>
          <p className={styles.heroSubtitle}>
            Share rides, save money, and reduce your carbon footprint with a trusted community of commuters.
          </p>

          <div className={styles.searchBox}>
            <SearchForm />
          </div>

          <div className={styles.ctaButtons}>
            <Link to="/offer" className={styles.primaryButton}>Offer a Ride</Link>
            <Link to="/book" className={styles.secondaryButton}>Find a Ride</Link>
          </div>
        </div>

        <div className={styles.heroRight}>
          <img
            src="https://media3.giphy.com/media/LVKiYd9wufSPyyHeTK/source.gif"


            alt="Commute illustration"
            className={styles.heroGraphic}
          />
        </div>
      </section>

      {/* Features */}
      <section className={styles.featuresSection}>
        <div className={styles.featureCard}>
          <span className={styles.featureIcon}>🚗</span>
          <h3>Reliable Rides</h3>
          <p>Verified users ensure a safe and comfortable journey.</p>
        </div>

        <div className={styles.featureCard}>
          <span className={styles.featureIcon}>💸</span>
          <h3>Save Money</h3>
          <p>Split ride costs and make your trips more affordable.</p>
        </div>

        <div className={styles.featureCard}>
          <span className={styles.featureIcon}>🌍</span>
          <h3>Eco-Friendly</h3>
          <p>Reduce traffic and pollution by sharing your commute.</p>
        </div>
      </section>

      {/* How it works */}
      <section className={styles.howItWorks}>
        <h2 className={styles.sectionTitle}>How It Works</h2>

        <div className={styles.stepsContainer}>
          <div className={styles.stepCard}>
            <h3>1. Create Profile</h3>
            <p>Sign up and personalize your commuter preferences.</p>
          </div>

          <div className={styles.stepCard}>
            <h3>2. Offer or Find a Ride</h3>
            <p>Choose your route and instantly see matching rides.</p>
          </div>

          <div className={styles.stepCard}>
            <h3>3. Connect & Ride</h3>
            <p>Chat, confirm, and enjoy a smoother commute.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
