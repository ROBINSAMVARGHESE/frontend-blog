"use client"

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = []

  // Generate page numbers
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i)
  }

  // Limit displayed page numbers
  const getPageNumbers = () => {
    const maxPagesToShow = 5

    if (totalPages <= maxPagesToShow) {
      return pageNumbers
    }

    const halfWay = Math.ceil(maxPagesToShow / 2)

    if (currentPage <= halfWay) {
      return [...pageNumbers.slice(0, maxPagesToShow - 1), "...", totalPages]
    }

    if (currentPage > totalPages - halfWay) {
      return [1, "...", ...pageNumbers.slice(totalPages - maxPagesToShow + 1)]
    }

    return [1, "...", ...pageNumbers.slice(currentPage - 2, currentPage + 1), "...", totalPages]
  }

  return (
    <ul className="pagination">
      <li>
        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
          Prev
        </button>
      </li>

      {getPageNumbers().map((page, index) => (
        <li key={index}>
          {page === "..." ? (
            <span className="pagination-ellipsis">...</span>
          ) : (
            <button className={currentPage === page ? "active" : ""} onClick={() => onPageChange(page)}>
              {page}
            </button>
          )}
        </li>
      ))}

      <li>
        <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </button>
      </li>
    </ul>
  )
}

export default Pagination

