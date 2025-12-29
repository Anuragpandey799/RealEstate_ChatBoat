import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function PriceChart({ chart }) {
  if (!chart || !chart.years || chart.years.length === 0) {
    return (
      <div className="alert alert-warning p-2">
        No chart data available.
      </div>
    );
  }

  const data = chart.years.map((year, i) => ({
    year,
    price: chart.prices[i],
  }));

  return (
    <div className="border rounded p-3 bg-white shadow-sm">
      {/* Bootstrap card title */}
      <h5 className="text-secondary fw-semibold mb-3">Price Trend Chart</h5>

      {/* Chart container */}
      <div className="w-100" style={{ height: "300px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Line
            
              type="monotone"
              dataKey="price"
              stroke="blue"
              strokeWidth={2}

            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
    
  );
}
