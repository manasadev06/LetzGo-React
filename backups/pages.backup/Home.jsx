import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.heroWrap}>
      <div className={`container ${styles.hero}`}>
        <div className={styles.left}>
          <h1 className={styles.title}>
            Share rides. Save money. <span className={styles.accent}>BikePooling</span>
          </h1>
          <p className={styles.sub}>
            Connect with nearby riders — offer a ride or find one in minutes. Safe, cheap and friendly.
          </p>

          <div className={styles.ctas}>
            <Link className={styles.primary} to="/offer">Offer a Ride</Link>
            <Link className={styles.ghost} to="/book">Book a Ride</Link>
          </div>

          <ul className={styles.trust}>
            <li>Verified drivers</li>
            <li>Route preview</li>
            <li>Secure payments</li>
          </ul>
        </div>

        <div className={styles.right}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.avatar}>🚲</div>
              <div>
                <strong>Hemanth</strong>
                <div className={styles.small}>Non-gear • 2 seats</div>
              </div>
            </div>

            <div className={styles.route}>
              <div><strong>From</strong><div>Apollo Hospital</div></div>
              <div className={styles.arrow}>→</div>
              <div><strong>To</strong><div>Main Street</div></div>
            </div>

            <div className={styles.cardFooter}>
              <div>08:00 AM • ₹30</div>
              <button className={styles.select}>Book</button>
            </div>
          </div>

          <div className={styles.features}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>💸</div>
              <div><strong>Save money</strong><div className={styles.small}>Share fuel costs</div></div>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>📍</div>
              <div><strong>Live routes</strong><div className={styles.small}>See pins & pickup</div></div>
            </div>
          </div>
        </div>
      </div>

{/* --- Benefits section --- */}
<section className={styles.benefitsWrap} aria-labelledby="benefits-heading">
  <div className="container">
    <h3 id="benefits-heading" className={styles.benefitsTitle}>Why choose BikePooling?</h3>
    <p className={styles.benefitsSubtitle}>Save money, reduce traffic, and meet friendly riders — small actions, big impact.</p>

    <div className={styles.benefitsGrid}>
      <div className={styles.benefitCard}>
        <div className={styles.icon}>💸</div>
        <h4>Save Money</h4>
        <p>Share fuel costs and split small fees for cheaper commuting.</p>
      </div>

      <div className={styles.benefitCard}>
        <div className={styles.icon}>🌱</div>
        <h4>Eco Friendly</h4>
        <p>Fewer vehicles on the road means lower emissions and cleaner air.</p>
      </div>

      <div className={styles.benefitCard}>
        <div className={styles.icon}>⏱️</div>
        <h4>Faster Commutes</h4>
        <p>Use priority lanes or avoid long parking searches — save time daily.</p>
      </div>

      <div className={styles.benefitCard}>
        <div className={styles.icon}>🤝</div>
        <h4>Community</h4>
        <p>Meet neighbours and build a trusted rider network in your area.</p>
      </div>
    </div>
  </div>
</section>


    </div>
  );
}
