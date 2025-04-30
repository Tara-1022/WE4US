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
      gap: "8px", // Smaller gap between elements
      margin: "15px 0", // Adjusted margin
    },
    button: {
      padding: "6px 12px", // Smaller padding for a more compact button
      borderRadius: "25px", // Rounded edges
      border: "1px solid rgba(255, 255, 255, 0.3)", // Light transparent border
      background: "rgba(255, 255, 255, 0.2)", // Soft frosted grey background
      color: "#fff", // White text
      fontSize: "0.9rem", // Smaller font size for a compact look
      fontWeight: "500", // Slightly bold text
      cursor: "pointer", // Pointer on hover
      transition: "all 0.3s ease-out, transform 0.2s ease-in-out, opacity 0.3s",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
      backdropFilter: "blur(12px)", // Frosted glass effect
      outline: "none",
    },
    buttonHover: {
      background: "rgba(255, 255, 255, 0.3)", // Slightly more opaque on hover
      transform: "scale(1.05)", // Slightly larger on hover
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)", // Slightly stronger shadow on hover
    },
    buttonDisabled: {
      backgroundColor: "rgba(211, 211, 211, 0.5)", // Disabled state with more opacity
      color: "#A9A9A9", // Grey text for disabled
      cursor: "not-allowed", // Disabled pointer
      boxShadow: "none",
      opacity: "0.5", // Faded look for disabled button
    },
    pageIndicator: {
      fontSize: "0.9rem", // Smaller font size for page number
      fontWeight: "500", // Bold text for readability
      color: "rgba(255, 255, 255, 0.8)", // Light grey text color
      margin: "0 8px", // Adjusted space around page number
    },
  };

  return (
    <div style={styles.container}>
      <button
        style={{
          ...styles.button,
          ...(page === 1 && styles.buttonDisabled), // Disable the button when on the first page
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
          ...(hasMore ? styles.buttonHover : styles.buttonDisabled), // Hover effect based on `hasMore`
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
