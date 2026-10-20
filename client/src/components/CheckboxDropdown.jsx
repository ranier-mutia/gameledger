import React, { useState, useRef, useEffect } from 'react';

export function CheckboxDropdown({
  label = "Platforms",
  options = [],
  selectedIds = [], // Array of selected IDs coming from React Hook Form
  onChange,
  error          // Callback to update selected IDs: (newIds) => void
}) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle individual checkbox toggle
  const handleToggle = (id) => {
    const current = Array.isArray(selectedIds) ? selectedIds : [];
    if (current.includes(id)) {
      onChange(current.filter((item) => item !== id));
    } else {
      onChange([...current, id]);
    }
  };

  return (
    <div className="relative w-full" ref={popoverRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`bg-gray-700 flex items-center justify-between w-full rounded-md px-3 py-1 border border-gray-600 focus:outline-none text-xs ${error
            ? 'ring-1 focus:ring-red-600 ring-red-400'
            : 'focus:ring-blue-500 hover:ring-blue-400 hover:outline-none hover:ring-1 focus:ring-1'
          }`}
      >
        <span className="truncate text-gray-400">
          {selectedIds.length > 0
            ? `${selectedIds.length} ${label} Selected`
            : `None`}
        </span>
        <span className=" text-gray-400">{isOpen ? '▲' : '▼'}</span>
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-full bg-gray-800 rounded-lg border border-gray-700 z-50 shadow-2xl text-white flex flex-col max-h-52 overflow-hidden">
          {/* Vertical Checkbox List */}
          <div className="overflow-y-auto p-2 space-y-1 divide-y divide-gray-800/50">
            {options.length > 0 ? (
              options.map((item) => {
                const isChecked = selectedIds.includes(item.id);
                return (
                  <label
                    key={item.id}
                    className="flex items-center space-x-2.5 px-2 py-1.5 hover:bg-[#1e2c40] rounded cursor-pointer text-xs transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggle(item.id)}
                      className="w-4 h-4 rounded border-gray-600 text-blue-600 bg-[#0b1622] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                    />
                    <span
                      className={
                        isChecked ? 'text-blue-400 font-semibold' : 'text-gray-300'
                      }
                    >
                      {item.name}
                    </span>
                  </label>
                );
              })
            ) : (
              <div className="p-3 text-center text-xs text-gray-400">
                No options available
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}