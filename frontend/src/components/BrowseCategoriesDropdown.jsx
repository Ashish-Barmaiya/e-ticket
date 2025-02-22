import { useState } from "react";
import { ChevronDown } from "lucide-react";

const BrowseCategoriesDropdown = ({ categories = [] }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={toggleDropdown}
        className="inline-flex justify-center w-full rounded-md px-4 py-2 bg-white text-md font-extralight tracking-widest text-gray-700 hover:bg-gray-50 hover:text-teal-500 focus:outline-none"
      >
        Browse Categories
        <ChevronDown className="ml-2 h-5 w-5" />
      </button>
      {isOpen && (
        <div className="origin-top-right absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1">
            {categories.map((category, index) => (
              <a
                key={index}
                href={`#${category.toLowerCase().replace(/\s+/g, "-")}`}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {category}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowseCategoriesDropdown;
