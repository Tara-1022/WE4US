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
      gap: "12px",
      margin: "20px 0",
    },
    button: {
      padding: "8px 16px",
      minWidth: "100px", 
      borderRadius: "25px",
      border: "1px solid #000",
      backgroundColor: "#000", 
      color: "#fff",
      fontSize: "0.95rem",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.3s ease, transform 0.2s",
      boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
      outline: "none",
    },
    buttonHover: {
      backgroundColor: "#555", 
    },
    buttonDisabled: {
      backgroundColor: "#333",
      color: "#888",
      cursor: "not-allowed",
      boxShadow: "none",
      opacity: "0.6",
    },
    pageIndicator: {
      fontSize: "1rem",
      color: "#fff",
    },
    pageNumber: {
      fontWeight: "bold", 
    },
  };

  return (
    <div style={styles.container}>
      <button
        style={{
          ...styles.button,
          ...(page === 1 ? styles.buttonDisabled : {}),
        }}
        disabled={page === 1}
        onMouseOver={(e) => {
          if (page !== 1) e.currentTarget.style.backgroundColor = "#555";
        }}
        onMouseOut={(e) => {
          if (page !== 1) e.currentTarget.style.backgroundColor = "#000";
        }}
        onClick={() => setPage(page - 1)}
      >
        Previous
      </button>

      <span style={styles.pageIndicator}>
        Page <span style={styles.pageNumber}>{page}</span>
      </span>

      <button
        style={{
          ...styles.button,
          ...(!hasMore ? styles.buttonDisabled : {}),
        }}
        disabled={!hasMore}
        onMouseOver={(e) => {
          if (hasMore) e.currentTarget.style.backgroundColor = "#555";
        }}
        onMouseOut={(e) => {
          if (hasMore) e.currentTarget.style.backgroundColor = "#000";
        }}
        onClick={() => setPage(page + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default PaginationControls;
