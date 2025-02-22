import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const AccordionSection = ({
  title,
  defaultOpen = false,
  onClear,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b py-2">
      {/* Header: Title + Clear + Chevron */}
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-lg font-semibold">{title}</h2>
        <div className="flex items-center space-x-4">
          {/* Clear button (optional) */}
          {onClear && (
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent accordion toggle on clear
                onClear();
              }}
              className="text-red-500 text-sm hover:underline"
            >
              Clear
            </button>
          )}
          {isOpen ? <ChevronUp /> : <ChevronDown />}
        </div>
      </div>

      {/* Body: Visible only when isOpen is true */}
      {isOpen && <div className="mt-3">{children}</div>}
    </div>
  );
};

export default AccordionSection;
