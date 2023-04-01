import React, { useState } from "react";
import { useSpring, animated } from "@react-spring/web";

const LoginButton: React.FC = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const buttonSpring = useSpring({
    borderRadius: isLoggingIn ? "50%" : "5px",
    backgroundColor: isLoggingIn ? "#2196f3" : "#4CAF50",
    color: isLoggingIn ? "#fff" : "#fff",
    width: isLoggingIn ? "60px" : "100px",
    height: isLoggingIn ? "60px" : "40px",
    fontSize: isLoggingIn ? "20px" : "16px",
    justifyContent: isLoggingIn ? "center" : "flex-start",
    padding: isLoggingIn ? "0" : "10px",
    config: { tension: 200, friction: 20 },
  });

  const handleClick = () => {
    setIsLoggingIn(true);
    setTimeout(() => setIsLoggingIn(false), 2000);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <animated.button style={buttonSpring} onClick={handleClick}>
        {isLoggingIn ? <animated.span>Logging in...</animated.span> : "Login"}
      </animated.button>
    </div>
  );
};

export default LoginButton;
