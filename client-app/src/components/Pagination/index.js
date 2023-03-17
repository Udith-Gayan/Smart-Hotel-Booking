import React from "react";
import style from "./index.module.scss";

const Pagination = ({ nPages, currentPage, setCurrentPage }) => {
  const pageNumbers = [...Array(nPages + 1).keys()].slice(1);

  const nextPage = () => {
    if (currentPage !== nPages) setCurrentPage(currentPage + 1);
  };
  const prevPage = () => {
    if (currentPage !== 1) setCurrentPage(currentPage - 1);
  };
  return (
    <nav>
      <ul className="pagination justify-content-center">
        <li className="page-item">
          <button
            className={`page-link secondaryButton ${style.overridePageLink}`}
            onClick={prevPage}
          >
            Previous
          </button>
        </li>
        {pageNumbers.map((pgNumber) => (
          <li
            key={pgNumber}
            className={`page-item ${currentPage === pgNumber ? "active" : ""} `}
          >
            <button
              onClick={() => setCurrentPage(pgNumber)}
              className={`page-link primaryButton ${style.overridePageLink}`}
            >
              {pgNumber}
            </button>
          </li>
        ))}
        <li className="page-item">
          <button
            className={`page-link secondaryButton ${style.overridePageLink}`}
            onClick={nextPage}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
