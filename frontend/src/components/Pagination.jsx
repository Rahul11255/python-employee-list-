
const Pagination = ({ page, totalPages, loading, onPageChange }) => {
  // numbers
  const pages = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  return (
    <div className="mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

      <p className="text-sm text-slate-500">
        Page <span className="font-semibold text-slate-900">{page}</span>{" "}
        of {totalPages || 1}
      </p>

      <div className="flex items-center gap-2">

        {/* pre btn */}
        <button
          disabled={page <= 1 || loading}
          onClick={() => onPageChange(page - 1)}
          className="rounded-lg border border-slate-200 cursor-pointer bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>

        {/* page numbers */}
        {pages.map((pageNumber) => (
          <button
            key={pageNumber}
            disabled={loading}
            onClick={() => onPageChange(pageNumber)}
            className={`h-9 min-w-9 rounded-lg px-3 cursor-pointer text-sm font-medium transition ${
              page === pageNumber
                ? "bg-blue-600 text-white"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
            }`}
          >
            {pageNumber}
          </button>
        ))}

        {/* next btn */}
        <button
          disabled={page >= totalPages || loading || totalPages === 0}
          onClick={() => onPageChange(page + 1)}
          className="rounded-lg bg-blue-600 px-4 cursor-pointer py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>

      </div>
    </div>
  );
};

export default Pagination;
