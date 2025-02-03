import React from "react";
import { Link } from "react-router-dom";

const Index: React.FC = () => {
  return (
    <div style={styles.container}>
      <p style={styles.text}>This is a test app. Hi tl</p>
      <Link to="/recent" style={styles.link}>
        Go to Recent screen
      </Link>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh", // Full viewport height
  },
  text: {
    fontSize: "18px",
    marginBottom: "10px",
  },
  link: {
    fontSize: "16px",
    color: "#007BFF", // Bootstrap link color
    textDecoration: "none",
  },
};

export default Index;
