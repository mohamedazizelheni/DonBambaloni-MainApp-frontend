import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const MAX_PAGE_BUTTONS = 5;

  const getPageNumbers = () => {
    const pages = [];

    let start = Math.max(1, currentPage - Math.floor(MAX_PAGE_BUTTONS / 2));
    let end = start + MAX_PAGE_BUTTONS - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - MAX_PAGE_BUTTONS + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  if (totalPages === 0) return null;

  return (
    <nav className="flex justify-center items-center mt-6 space-x-1">
      {getPageNumbers().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded-md ${
            page === currentPage
              ? 'bg-gray-200 text-black font-semibold'
              : 'font-semibold text-gray-500 hover:bg-gray-100'
          }`}
          aria-label={`Page ${page}`}
        >
          {page}
        </button>
      ))}
    </nav>
  );
};

export default Pagination;
