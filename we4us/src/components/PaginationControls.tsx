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
      gap: "10px",
      margin: "16px 0",
    },
    button: {
      padding: "6px 12px",
      minWidth: "70px",
      borderRadius: "20px",
      border: "1px solid #2f2f2f;",
      backgroundColor: "#2f2f2f;",
      color: "#fff",
      fontSize: "0.8rem",
      fontWeight: 500,
      cursor: "pointer",
      transition: "all 0.3s ease, transform 0.2s",
      boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
      outline: "none",
    },
    buttonHover: {
      backgroundColor: "#444",
    },
    buttonDisabled: {
      backgroundColor: "#2a2a2a",
      color: "#777",
      cursor: "not-allowed",
      boxShadow: "none",
      opacity: 0.5,
    },
    pageIndicator: {
      fontSize: "0.85rem",
      color: "#ccc",
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
          if (page !== 1) e.currentTarget.style.backgroundColor = "#444";
        }}
        onMouseOut={(e) => {
          if (page !== 1) e.currentTarget.style.backgroundColor = "#1a1a1a";
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
          if (hasMore) e.currentTarget.style.backgroundColor = "#444";
        }}
        onMouseOut={(e) => {
          if (hasMore) e.currentTarget.style.backgroundColor = "#1a1a1a";
        }}
        onClick={() => setPage(page + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default PaginationControls;
