import { useState } from "react";

function SearchBar({ placeholder, onSearch }) {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <section className="row justify-content-center mb-4" aria-label="Buscar">
      <div className="col-12 col-md-8 col-lg-6">
        <input
          className="form-control form-control-lg"
          type="search"
          placeholder={placeholder}
          value={query}
          onChange={handleChange}
          autoComplete="off"
        />
      </div>
    </section>
  );
}

export default SearchBar;
