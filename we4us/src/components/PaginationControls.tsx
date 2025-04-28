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
      gap: "5px", 
      margin: "15px 0", 
    },
    button: {
      padding: "6px 12px", 
      borderRadius: "25px", 
      border: "1px solid rgba(52, 152, 219, 0.7)", 
      background: "linear-gradient(135deg, #3a66d0, #2b5aa0)", // Blue gradient
      color: "#fff",
      fontSize: "0.85rem", 
      fontWeight: "500", 
      cursor: "pointer",
      transition: "all 0.3s ease-out, transform 0.2s ease-in-out, opacity 0.3s",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      outline: "none",
    },
    buttonHover: {
      background: "linear-gradient(135deg, #2b5aa0, #3a66d0)", // Hover gradient
      transform: "scale(1.05)", 
      boxShadow: "0 6px 8px rgba(0, 0, 0, 0.2)",
      opacity: "1",
    },
    buttonDisabled: {
      backgroundColor: "rgba(211, 211, 211, 0.5)", 
      color: "#A9A9A9",
      cursor: "not-allowed",
      boxShadow: "none",
      opacity: "0.5", 
    },
    pageIndicator: {
      fontSize: "1rem", 
      fontWeight: "700", 
      color: "rgba(44, 62, 80, 0.9)",
      margin: "0 4px",
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
