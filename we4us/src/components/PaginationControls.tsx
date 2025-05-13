import React from "react";
import "./PaginationControls.css";

interface PaginationControlsProps {
  page: number;
  setPage: (page: number) => void;
  hasMore: boolean;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({ page, setPage, hasMore }) => {
  return (
    <div className="pagination-container">
      <button
        className="pagination-button"
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
      >
        Previous
      </button>

      <span className="pagination-indicator">
        Page <span className="pagination-number">{page}</span>
      </span>

      <button
        className="pagination-button"
        onClick={() => setPage(page + 1)}
        disabled={!hasMore}
      >
        Next
      </button>
    </div>
  );
};

export default PaginationControls;
