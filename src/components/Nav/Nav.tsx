import SearchBar from "../Search/SearchBar";
import styles from "./nav.module.css";

export const NavBar = () => {
  return (
    <div className={styles.navbar}>
      <div className={styles.NavTitle}>Note Nomad</div>
      <SearchBar />
    </div>
  );
};
