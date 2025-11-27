export default function ResultsTable({ rows }) {
  if (!rows || rows.length === 0)
    return <p>No rows found for this location.</p>;

  const columns = Object.keys(rows[0]);

  return (
    <>
      {/* Only needed to hide scrollbar */}
      <style>
        {`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}
      </style>

      {/* Scrollable container */}
      <div
        className="overflow-auto no-scrollbar p-1 border rounded"
        style={{ maxHeight: "400px" }} // Required for scroll
      >
        <table className="table table-hover table-striped table-bordered table-sm">
          <thead className="sticky-top bg-light">
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  className="text-capitalize fw-semibold align-top"  // 🔥 HEAD TEXT AT TOP
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                {columns.map((col) => (
                  <td key={col} className="align-top">  {/* Optional: Align body text to top also */}
                    {String(row[col])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
