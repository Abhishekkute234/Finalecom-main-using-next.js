// components/Other/HandlePagination.tsx

"use client";

import React from "react";
import ReactPaginate from "react-paginate";

interface Props {
  pageCount: number;
  currentPage: number; // Current active page (0-based index)
  onPageChange: (selected: number) => void; // Callback for page change
}

const HandlePagination: React.FC<Props> = ({
  pageCount,
  currentPage,
  onPageChange,
}) => {
  return (
    <ReactPaginate
      previousLabel="<"
      nextLabel=">"
      pageCount={pageCount}
      pageRangeDisplayed={3}
      marginPagesDisplayed={2}
      forcePage={currentPage} // Ensures the correct active page is controlled externally
      onPageChange={(selectedItem) => onPageChange(selectedItem.selected)}
      containerClassName="pagination"
      activeClassName="active"
      previousClassName="page-item"
      nextClassName="page-item"
      pageClassName="page-item"
      breakClassName="page-item"
      breakLinkClassName="page-link"
    />
  );
};

export default HandlePagination;
    