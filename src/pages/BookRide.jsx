import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiMapPin,
  FiCalendar,
  FiFilter,
} from "react-icons/fi";
import RideCard from "../components/RideCard";
import MapDummy from "../components/MapDummy";
import styles from "../styles/BookRide.module.css";

export default function BookRide() {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [results, setResults] = useState([]);
  const [filters, setFilters] = useState({
    gear: true,
    nonGear: true,
    priceRange: [0, 100],
    minRating: 0,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setDate(today);
  }, []);

  async function fetchResults(query) {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/rides/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(query),
      });

      const data = await response.json();
      console.log("Search response:", response.status, data);

      if (!response.ok) {
        setResults([]);
        setError(data.message || "Failed to search rides");
        setIsLoading(false);
        return;
      }

      // Map backend results -> UI format
      const mapped = (data.rides || []).map((r) => ({
        id: r.id,
        driverName: r.driverName,
       vehicle: r.vehicle_type.toLowerCase(), // "gear" or "non-gear"

        seatsAvailable: r.seats_available,
        from: r.pickup,
        to: r.drop_location,
        time: r.ride_time, // already HH:MM from backend
        price: Number(r.price_per_seat),
        rating: r.rating,  // dummy from SQL
        trips: r.trips,    // dummy from SQL
      }));

      // Apply frontend filters
      const filtered = mapped.filter((r) => {
        const matchesVehicle =
  (r.vehicle === "gear" && filters.gear) ||
  (r.vehicle === "non-gear" && filters.nonGear);

        const matchesPrice =
          r.price >= filters.priceRange[0] &&
          r.price <= filters.priceRange[1];
        const matchesRating = r.rating >= filters.minRating;

        return matchesVehicle && matchesPrice && matchesRating;
      });
console.log("MAPPED:", mapped);
console.log("FILTERED:", filtered);

      //setResults(filtered);
      setResults(mapped);
    } catch (err) {
      console.error("Search error:", err);
      setError("Something went wrong while searching rides");
    } finally {
      setIsLoading(false);
    }
  }

  function handleSearch(e) {
    if (e) e.preventDefault();
    const query = { pickup, destination, date };
    fetchResults(query);
  }

  function handleFilterChange(e) {
    const { name, checked, type, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function selectRide(ride) {
  navigate(`/rides/${ride.id}`, {
    state: {
      ride,
      pickup,
      destination,
      date,
    },
  });
}

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1>Find Your Perfect Ride</h1>
        <p>Share your journey, save money, and reduce your carbon footprint</p>

        <form className={styles.searchForm} onSubmit={handleSearch}>
          <div className={styles.searchGrid}>
            <div className={styles.formGroup}>
              <label className={styles.inputLabel}>
                <FiMapPin className={styles.inputIcon} />
                <span>From</span>
              </label>
              <input
                type="text"
                placeholder="Enter pickup location"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                className={styles.searchInput}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.inputLabel}>
                <FiMapPin className={styles.inputIcon} />
                <span>To</span>
              </label>
              <input
                type="text"
                placeholder="Enter drop-off location"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className={styles.searchInput}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.inputLabel}>
                <FiCalendar className={styles.inputIcon} />
                <span>Date</span>
              </label>
              <input
                type="date"
                value={date}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setDate(e.target.value)}
                className={styles.searchInput}
                required
              />
            </div>

            <button type="submit" className={styles.searchButton}>
              Search Rides
            </button>
          </div>
        </form>

        {error && <p className={styles.error}>{error}</p>}
      </div>

      <div id="results" className={styles.resultsContainer}>
        <div className={styles.contentWrapper}>
          {/* Filters Sidebar */}
          <aside
            className={`${styles.sidebar} ${
              showFilters ? styles.sidebarOpen : ""
            }`}
          >
            <div className={styles.sidebarHeader}>
              <h3>
                <FiFilter /> Filters
              </h3>
              <button
                className={styles.closeFilters}
                onClick={() => setShowFilters(false)}
                aria-label="Close filters"
              >
                &times;
              </button>
            </div>

            <div className={styles.filterSection}>
              <h4>Vehicle Type</h4>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="nonGear"
                  checked={filters.nonGear}
                  onChange={handleFilterChange}
                  className={styles.checkboxInput}
                />
                <span className={styles.checkmark}></span>
                Non-gear Bikes
              </label>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="gear"
                  checked={filters.gear}
                  onChange={handleFilterChange}
                  className={styles.checkboxInput}
                />
                <span className={styles.checkmark}></span>
                Gear Bikes
              </label>
            </div>

            <div className={styles.filterSection}>
              <h4>Price Range</h4>
              <div className={styles.priceRange}>
                <span>₹0</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={filters.priceRange[1]}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      priceRange: [prev.priceRange[0], parseInt(e.target.value)],
                    }))
                  }
                  className={styles.rangeInput}
                />
                <span>₹{filters.priceRange[1]}</span>
              </div>
            </div>

            <div className={styles.filterSection}>
              <h4>Minimum Rating</h4>
              <div className={styles.ratingFilter}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`${styles.ratingStar} ${
                      star <= filters.minRating ? styles.active : ""
                    }`}
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        minRating: star,
                      }))
                    }
                    aria-label={`${star} star${star !== 1 ? "s" : ""}`}
                  >
                    ★
                  </button>
                ))}
                <span className={styles.ratingText}>
                  {filters.minRating > 0 ? `${filters.minRating}+` : "Any"}
                </span>
              </div>
            </div>

            <button
              className={styles.applyFilters}
              onClick={() => {
                handleSearch();
                setShowFilters(false);
              }}
            >
              Apply Filters
            </button>
          </aside>

          {/* Main Content */}
          <main className={styles.mainContent}>
            <div className={styles.resultsHeader}>
              <h2>Available Rides</h2>
              <button
                className={styles.mobileFilterButton}
                onClick={() => setShowFilters(!showFilters)}
              >
                <FiFilter /> {showFilters ? "Hide" : "Show"} Filters
              </button>
            </div>

            {isLoading ? (
              <div className={styles.loadingState}>
                <div className={styles.spinner}></div>
                <p>Finding the best rides for you...</p>
              </div>
            ) : results.length > 0 ? (
              <div className={styles.ridesList}>
                {results.map((ride) => (
                  <RideCard
                    key={ride.id}
                    ride={ride}
                    onClick={() => selectRide(ride)}
                  />
                ))}
              </div>
            ) : (
              <div className={styles.noResults}>
                <h3>No rides found</h3>
                <p>Try adjusting your search or filters to find more options.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
