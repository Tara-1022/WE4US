import React from "react";

interface PaginationControlsProps {
  page: number;
  setPage: (page: number) => void;
  hasMore: boolean;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({ page, setPage, hasMore }) => {
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: "10px", margin: "10px 0" }}>
      <button disabled={page === 1} onClick={() => setPage(page - 1)}>
        Previous
      </button>
      <span> Page {page} </span>
      <button disabled={!hasMore} onClick={() => setPage(page + 1)}>
        Next
      </button>
    </div>
  );
};

export default PaginationControls;
