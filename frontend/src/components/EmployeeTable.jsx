

const EmployeeTable = ({ employees, loading, error }) => {

   const SkeletonRows = () => (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <tr key={index} className="border-b border-slate-100">
          {Array.from({ length: 5 }).map((_, colIndex) => (
            <td key={colIndex} className="px-6 py-5">
              <div
                className={`h-4 animate-pulse rounded-md bg-linear-to-r from-slate-100 via-slate-200 to-slate-100 ${
                  colIndex === 1 ? "w-36" : "w-24"
                }`}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {error ? (
        <div className="p-12 text-center">
          <p className="font-medium text-red-600">{error}</p>
          <p className="mt-2 text-sm text-slate-500">
            Please try again.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="px-6 py-4 font-semibold">ID</th>
                <th className="px-6 py-4 font-semibold">Employee</th>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold">Department</th>
                <th className="px-6 py-4 font-semibold">Designation</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <SkeletonRows />
              ) : employees.length > 0 ? (
                employees.map((employee) => (
                  <tr
                    key={employee.id}
                    className="transition-colors hover:bg-slate-50"
                  >
                    <td className="px-6 py-4 text-slate-500">
                      #{employee.id}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {employee.name}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {employee.email}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {employee.department}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {employee.designation}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    No employees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default EmployeeTable