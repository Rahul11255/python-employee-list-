
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import "./App.css";
import EmployeeTable from "./components/EmployeeTable";
import Pagination from "./components/Pagination";
import { getEmployees } from "./api/employeeApi";

const PAGE_SIZE = 5;

function App() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get values from URL
  const searchFromUrl = searchParams.get("search") || "";
  const pageFromUrl = Math.max(
    1,
    Number(searchParams.get("page")) || 1
  );

  const [search, setSearch] = useState(searchFromUrl);
  const [debouncedSearch, setDebouncedSearch] = useState(searchFromUrl);

  // Keep input synchronized when browser back/forward is used
  useEffect(() => {
    setSearch(searchFromUrl);
    setDebouncedSearch(searchFromUrl);
  }, [searchFromUrl]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  // Update URL after debounce
  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (debouncedSearch) {
      params.set("search", debouncedSearch);
    } else {
      params.delete("search");
    }

    params.set("page", "1");

    if (params.toString() !== searchParams.toString()) {
      setSearchParams(params, { replace: true });
    }
  }, [debouncedSearch]);

  // tanstack query to fetch api Fetch employees
  const {
    data,
     isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["employees", searchFromUrl, pageFromUrl],
    queryFn: getEmployees,
    placeholderData: (previousData) => previousData,
  });

  const employees = data?.items || [];
  const total = data?.total || 0;

  // Search handler
  function handleSearch(e) {
    setSearch(e.target.value);
  }

  // Pagination handler
  function handlePageChange(newPage) {
    const params = new URLSearchParams(searchParams)
    params.set("page", String(newPage));
    setSearchParams(params);
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#ff1200]">
            Management System
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Employee Directory
          </h1>

          <p className="mt-2 text-slate-500">
            Search and manage your employee records.
          </p>
        </div>

        {/* Search and count */}
        <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="relative w-full sm:max-w-md">
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search employees by name..."
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="text-sm text-slate-500">
            Total employees:{" "}
            <span className="font-bold text-slate-900">{total}</span>
          </div>
        </div>

        {/* Employee Table */}
        <EmployeeTable
          employees={employees}
          loading={isFetching}
          error={isError ? error.message : ""}
        />

        {/* Pagination */}
        <Pagination
          page={pageFromUrl}
          totalPages={totalPages}
          loading={isFetching}
          onPageChange={handlePageChange}
        />

      </div>
    </div>
  );
}

export default App;
