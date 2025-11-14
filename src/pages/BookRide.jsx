import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiMapPin, FiCalendar, FiClock, FiFilter, FiArrowRight, FiUser, FiDollarSign, FiCheck } from "react-icons/fi";
import RideCard from "../components/RideCard";
import MapDummy from "../components/MapDummy";
import styles from "../styles/BookRide.module.css";

const DUMMY = [
  { 
    id: "1", 
    driverName: "Hemanth", 
    vehicle: "Non-gear", 
    seatsAvailable: 2, 
    from: "MG Road", 
    to: "Koramangala", 
    time: "08:00", 
    price: 30,
    rating: 4.8,
    trips: 42
  },
  { 
    id: "2", 
    driverName: "Priya", 
    vehicle: "Gear", 
    seatsAvailable: 1, 
    from: "Indiranagar", 
    to: "Whitefield", 
    time: "08:15", 
    price: 35,
    rating: 4.9,
    trips: 67
  },
  { 
    id: "3", 
    driverName: "Ravi", 
    vehicle: "Non-gear", 
    seatsAvailable: 3, 
    from: "Jayanagar", 
    to: "Malleswaram", 
    time: "09:00", 
    price: 40,
    rating: 4.7,
    trips: 35
  }
];

export default function BookRide() {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [results, setResults] = useState([]);
  const [filters, setFilters] = useState({
    gear: true,
    nonGear: true,
    priceRange: [0, 100],
    minRating: 0
  });
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    setDate(today);
    
    // Show some initial results
    setResults(DUMMY);
  }, []);

  function fetchResults(query) {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const filtered = DUMMY.filter(r => {
        const matchesFrom = (r.from || "").toLowerCase().includes((query.pickup || "").toLowerCase());
        const matchesTo = (r.to || "").toLowerCase().includes((query.destination || "").toLowerCase());
        const matchesVehicle = 
          (r.vehicle === "Gear" && filters.gear) || 
          (r.vehicle === "Non-gear" && filters.nonGear);
        const matchesPrice = r.price >= filters.priceRange[0] && r.price <= filters.priceRange[1];
        const matchesRating = r.rating >= filters.minRating;
        
        return matchesFrom && matchesTo && matchesVehicle && matchesPrice && matchesRating;
      });
      
      setResults(filtered);
      setIsLoading(false);
    }, 800);
  }

  function handleSearch(e) {
    if (e) e.preventDefault();
    const query = { pickup, destination, date };
    fetchResults(query);
  }

  function handleFilterChange(e) {
    const { name, checked, type, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }

  function selectRide(ride) {
    navigate("/confirmation", { 
      state: { 
        pickup, 
        destination, 
        date, 
        ride 
      } 
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
                min={new Date().toISOString().split('T')[0]}
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
      </div>

      <div id="results" className={styles.resultsContainer}>
        <div className={styles.contentWrapper}>
          {/* Filters Sidebar */}
          <aside className={`${styles.sidebar} ${showFilters ? styles.sidebarOpen : ''}`}>
            <div className={styles.sidebarHeader}>
              <h3><FiFilter /> Filters</h3>
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
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    priceRange: [prev.priceRange[0], parseInt(e.target.value)]
                  }))}
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
                      star <= filters.minRating ? styles.active : ''
                    }`}
                    onClick={() => setFilters(prev => ({
                      ...prev,
                      minRating: star
                    }))}
                    aria-label={`${star} star${star !== 1 ? 's' : ''}`}
                  >
                    ★
                  </button>
                ))}
                <span className={styles.ratingText}>
                  {filters.minRating > 0 ? `${filters.minRating}+` : 'Any'}
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
                <FiFilter /> {showFilters ? 'Hide' : 'Show'} Filters
              </button>
            </div>

            {isLoading ? (
              <div className={styles.loadingState}>
                <div className={styles.spinner}></div>
                <p>Finding the best rides for you...</p>
              </div>
            ) : results.length > 0 ? (
              <div className={styles.ridesList}>
                {results.map(ride => (
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
                <button 
                  className={styles.resetButton}
                  onClick={() => {
                    setPickup('');
                    setDestination('');
                    setResults(DUMMY);
                    setFilters({
                      gear: true,
                      nonGear: true,
                      priceRange: [0, 100],
                      minRating: 0
                    });
                  }}
                >
                  Reset Search
                </button>
              </div>
            )}
          </main>

         
          
        </div>
      </div>
    </div>
  );
}
