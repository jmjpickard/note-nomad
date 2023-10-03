import { useSpring, animated } from "@react-spring/web";
import Link from "next/link";
import React from "react";

import styles from "./welcome.module.css";

const rotatingWords = [
  "organise your world",
  "test a bit of code",
  "keep track of your thoughts",
];

export const WelcomeText = () => {
  const [index, setIndex] = React.useState(0);
  const wordSpring = useSpring({
    config: { duration: 5000, tension: 120, friction: 14 },
    from: { opacity: 0.3 },
    to: { opacity: 1 },
    reset: true,
    onRest: () => {
      setIndex((index + 1) % rotatingWords.length);
    },
  });

  return (
    <div className={styles.WelcomeContainer}>
      <div className={styles.title}>
        A simple note-taking application to help you
      </div>
      <div className={styles.finalWords}>
        <animated.span style={wordSpring}>{rotatingWords[index]}</animated.span>
      </div>
      <div className={styles.getStarted}>
        <Link href="/signin">Get started &#x2192;</Link>
      </div>
    </div>
  );
};
