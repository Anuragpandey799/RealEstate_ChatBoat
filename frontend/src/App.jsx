import { useState } from "react";
import axios from "axios";
import ChatInput from "./components/ChatInput";
import PriceChart from "./components/PriceChart";
import ResultsTable from "./components/ResultsTable";

function App() {
  const [query, setQuery] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);

  const sendQuery = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setResponseData(null);

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/analyze/", {
        query: query.trim(),
      });

      setResponseData(res.data);
    } catch (err) {
      console.error(err);
      alert("Error: Could not fetch data from API");
    }

    setLoading(false);
  };

  return (
    <div className="vw-100 m-5 bg-light d-flex flex-column gap-5 justify-content-center align-items-center bg-white">
      <div className="w-75 h-auto p-5 rounded-4 bg-white border-2 border-black shadow-lg">
        <h2 className="text-center mb-4 fw-bold text-primary">
          🏡 Real Estate Analysis Chatbot
        </h2>

        {/* Chat input */}
        <div
          className="mb-4 p-3"
          style={{
            border: "1px solid #e0e0e0",
            borderRadius: "10px",
            background: "#fafafa",
          }}
        >
          <ChatInput
            query={query}
            setQuery={setQuery}
            sendQuery={sendQuery}
            loading={loading}
          />
        </div>

        {/* Response Section */}
        {responseData && (
          <div className="mt-4">
            {/* Summary Card */}
            <div className="mb-4 p-3 border-1 border-black rounded-2 bg-white shadow">
              <h4 className="fw-bold text-secondary">📌 Summary</h4>
              <p className="mt-2">{responseData.summary}</p>
            </div>

            {/* Chart Card */}
            <div className="mb-4 p-3 border-1 border-black rounded-2 bg-white shadow">
              <h4 className="fw-bold text-secondary">📈 Price Trend</h4>

              <div
                style={{ width: "100%", minHeight: "320px", marginTop: "10px" }}
              >
                <PriceChart chart={responseData.chart} />
              </div>
            </div>

            {/* Table Card */}
            <div className="mb-4 p-3 border-1 border-black rounded-2 bg-white shadow">
              <h4 className="fw-bold text-secondary">📊 Filtered Data Table</h4>
              <ResultsTable rows={responseData.table} />
            </div>
          </div>
        )}
      </div>
      <button
        className="btn btn-success"
        onClick={() =>
          window.open("http://127.0.0.1:8000/api/download/", "_blank")
        }
      >
        ⬇ Download Data
      </button>
    </div>
  );
}

export default App;
