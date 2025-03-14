import { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <div className="flex justify-center mb-6">
      <div className="relative w-full md:w-1/2">
        <input
          type="text"
          placeholder="🔍 Search projects..."
          onChange={(e) => onSearch(e.target.value)}
          className="w-full px-5 py-3 border border-gray-300 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
        />
      </div>
    </div>
  );
};

export default SearchBar;
