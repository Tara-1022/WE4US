import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface PaginationControlsProps {
  page: number;
  setPage: (page: number) => void;
  hasMore: boolean;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({ page, setPage, hasMore }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handlePageChange = (newPage: number) => {

    setPage(newPage);
    if (location.pathname === '/') {
      navigate(`/?page=${newPage}`, { replace: true });
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", gap: "10px", margin: "10px 0" }}>
      <button 
        disabled={page === 1} 
        onClick={() => handlePageChange(page - 1)}
      >
        Previous
      </button>
      <span> Page {page} </span>
      <button 
        disabled={!hasMore} 
        onClick={() => handlePageChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default PaginationControls;