import { useRouter } from "next/router";
import SearchBar from "../Search/SearchBar";
import styles from "./nav.module.css";
import React from "react";

interface props {
  showSearch?: boolean;
}

export const NavBar: React.FC<props> = ({ showSearch }: props) => {
  const router = useRouter();
  return (
    <div className={styles.navbar}>
      <div className={styles.NavTitle} onClick={() => router.push("/")}>
        Note Nomad
      </div>
      {showSearch ? <SearchBar /> : <div />}
    </div>
  );
};
