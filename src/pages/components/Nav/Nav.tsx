import Image from "next/image";
import githubIcon from "../../../images/github-mark-white.svg";
import styles from "./nav.module.css";

export const NavBar = () => {
  return (
    <div className={styles.navbar}>
      <div className={styles.NavTitle}>Note Nomad</div>
      <div>
        <a href="https://github.com/jmjpickard/note-your-day" target="_blank">
          <Image
            priority
            src={githubIcon}
            height={32}
            width={32}
            alt="Source code"
          />
        </a>
      </div>
    </div>
  );
};
