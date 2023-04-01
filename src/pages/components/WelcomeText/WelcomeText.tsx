import { useSpring, animated } from "@react-spring/web";
import Link from "next/link";
import React from "react";

import styles from "./welcome.module.css";

const rotatingWords = [
  "organise your world",
  "travel through time and space",
  "keep track of your thoughts",
];

export const WelcomeText = () => {
  const [login, setLogin] = React.useState(false);
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

  const [springs, api] = useSpring(() => ({
    config: { tension: 50, friction: 5, duration: 500 },
    from: {
      padding: "10px 20px",
      backgroundColor: "#f5f5f5",
      color: "#376998",
      border: "1px solid #000",
    },
    reverse: true,
  }));

  const handleClick = () => {
    setLogin(true);
    api.start({
      config: { tension: 50, friction: 5, duration: 0 },
      from: {
        padding: "10px 20px",
        backgroundColor: "#376998",
        color: "#376998",
        border: "1px solid #000",
      },
      to: {
        padding: "10px 20px",
        backgroundColor: "transparent",
        color: "#f5f5f5",
        border: "0px solid #000",
      },
      delay: 0,
    });
  };

  return (
    <div className={styles.WelcomeContainer}>
      <div className={styles.title}>
        A simple note-taking application to help you
      </div>
      <div className={styles.finalWords}>
        <animated.span style={wordSpring}>{rotatingWords[index]}</animated.span>
      </div>
      <animated.div
        style={springs}
        onClick={handleClick}
        className={styles.getStarted}
      >
        <Link href="/signin">Get started &#x2192;</Link>
      </animated.div>
    </div>
  );
};
