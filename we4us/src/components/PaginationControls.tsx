import React from "react";

interface PaginationControlsProps {
  page: number;
  setPage: (page: number) => void;
  hasMore: boolean;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({ page, setPage, hasMore }) => {
  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "8px",
      margin: "15px 0", 
    },
    button: {
      padding: "6px 12px",
      borderRadius: "25px",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      background: "rgba(255, 255, 255, 0.2)", 
      color: "#fff", 
      fontSize: "0.9rem", 
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.3s ease-out, transform 0.2s ease-in-out, opacity 0.3s",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", 
      backdropFilter: "blur(12px)",
      outline: "none",
    },
    buttonHover: {
      background: "rgba(255, 255, 255, 0.3)", 
      transform: "scale(1.05)", 
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)", 
    },
    buttonDisabled: {
      backgroundColor: "rgba(211, 211, 211, 0.5)", 
      color: "#A9A9A9", 
      cursor: "not-allowed", 
      boxShadow: "none",
      opacity: "0.5",
    },
    pageIndicator: {
      fontSize: "0.9rem", 
      fontWeight: "500", 
      color: "rgba(255, 255, 255, 0.8)",
      margin: "0 8px",
    },
  };

  return (
    <div style={styles.container}>
      <button
        style={{
          ...styles.button,
          ...(page === 1 && styles.buttonDisabled), 
        }}
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
      >
        Previous
      </button>

      <span style={styles.pageIndicator}>Page {page}</span>

      <button
        style={{
          ...styles.button,
          ...(hasMore ? styles.buttonHover : styles.buttonDisabled), 
        }}
        disabled={!hasMore}
        onClick={() => setPage(page + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default PaginationControls;
