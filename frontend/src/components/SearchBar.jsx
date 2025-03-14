import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const SearchBar = ({ placeholder = "Search events...", onSearch }) => {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    if (onSearch) {
      onSearch(newQuery);
    }
  };

  return (
    <div className="relative flex w-full max-w-md">
      {/* <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500 rounded-r-none" /> */}
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        className="text-white/90 font-light tracking-widest rounded-r-none"
      />
      <button className="text-white/70 px-2 border border-l-0 border-white/80 rounded-r-md hover:bg-white/10">
        <Search size={20} />
      </button>
    </div>
  );
};

export default SearchBar;
