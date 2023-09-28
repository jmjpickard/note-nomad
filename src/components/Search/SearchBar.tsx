import React, { useState, useEffect, ChangeEvent } from "react";
import styles from "./SearchBar.module.css";

const SearchBar: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [selectedTimeFrame, setSelectedTimeFrame] = useState("");

  const handleSearchClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilterText(e.target.value);
  };

  const handleTimeFrameChange = (timeFrame: string) => {
    setSelectedTimeFrame(timeFrame);
    // Add logic to filter notes or todos based on the selected time frame
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        handleSearchClick();
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <div className={styles.searchContainer}>
      <input
        className={styles.searchInput}
        type="text"
        placeholder="Search (⌘ + k)"
        value={filterText}
        onChange={handleFilterChange}
        onClick={handleSearchClick}
      />

      {isModalOpen && (
        <div className={styles.modal}>
          <button className={styles.closeButton} onClick={handleModalClose}>
            X
          </button>
          <div className={styles.searchHeader}>View past notes or todos</div>
          <div className={styles.filterOptions}>
            <button
              className={styles.filterButton}
              onClick={() => handleTimeFrameChange("1 week")}
            >
              1 Week
            </button>
            <button
              className={styles.filterButton}
              onClick={() => handleTimeFrameChange("2 weeks")}
            >
              2 Weeks
            </button>
            <button
              className={styles.filterButton}
              onClick={() => handleTimeFrameChange("4 weeks")}
            >
              4 Weeks
            </button>
            <button
              className={styles.filterButton}
              onClick={() => handleTimeFrameChange("8 weeks")}
            >
              8 Weeks
            </button>
          </div>
          {/* Add logic to display filtered notes or todos */}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
