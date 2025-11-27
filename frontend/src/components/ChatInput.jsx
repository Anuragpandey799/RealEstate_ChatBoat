export default function ChatInput({ query, setQuery, sendQuery, loading }) {

  const handleKey=(e)=>{
    if (e.key === 'Enter') {
      sendQuery();
    }
  }
  
  return (
    <div className="input-group">
      <input
        type="text"
        className="form-control form-control-lg"
        placeholder="Analyze any location (e.g., Wakad)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        disabled={loading}
        onKeyDown={(e)=>{handleKey(e)}}
      />

      <button
        className="btn btn-primary btn-lg"
        type="button"
        disabled={loading}
        onClick={sendQuery}
      >
        {loading ? (
          <>
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
            ></span>
            Loading...
          </>
        ) : (
          "Search"
        )}
      </button>
    </div>
  );
}
  