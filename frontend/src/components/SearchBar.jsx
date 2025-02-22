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
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        className="pl-10 text-white/90 font-light tracking-widest"
      />
    </div>
  );
};

export default SearchBar;
