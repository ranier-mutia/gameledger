import React, { useState, useMemo, useRef, useEffect } from 'react';

export function ComboboxFilter({
  label,
  paramKey,
  options = [],
  mobile = false,
  hasSearch = false,
  filterParams,
  handleComboBoxToggle
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const popoverRef = useRef(null);

  // Read selected IDs from URL search params (?genre=1,2)
  const selectedIds = useMemo(() => {
    const raw = filterParams?.get(paramKey);
    return raw ? raw.split(',').map(Number) : [];
  }, [filterParams, paramKey]);


  // Close when clicking outside
  useEffect(() => {
    if (mobile) return

    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobile]);

  // Filter options by search input
  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) return options;
    return options.filter((opt) =>
      opt.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
    );
  }, [options, searchTerm]);

  return (
    <div className={`${mobile && 'overflow-hidden'} relative`} ref={popoverRef}>
      {/* Uniform Select Trigger Button (Matches your dark UI image) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`${mobile ? 'bg-gray-900 text-slate-200' : 'bg-gray-800 text-slate-300'} flex w-full items-center justify-between  text-sm  px-3 py-2 rounded-lg hover:bg-gray-900 transition-colors border border-slate-700/60`}
      >
        <span className="truncate">
          {selectedIds.length > 0 ? `${selectedIds.length} Selected` : 'Any'}
        </span>
        <span className="text-xs text-gray-400">{isOpen ? '▲' : '▼'}</span>
      </button>

      {/* Uniform Width Checkbox Popover */}
      {isOpen && (
        <div className={`${mobile ? 'bg-gray-900 rounded-b-lg border-slate-700/60' : 'bg-gray-800 absolute left-0 mt-2 w-52 rounded-lg border-gray-700'} z-50 xl:w-full border  shadow-2xl text-white flex flex-col max-h-72 overflow-y-auto`}>

          {/* Optional Search Input for large lists like Platforms/Themes */}
          {hasSearch && (
            <div className="p-2 border-b border-gray-700">
              <input
                type="text"
                placeholder={`Search ${label.toLowerCase()}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#0b1622] text-xs text-white px-2.5 py-2 rounded border border-gray-700 focus:outline-none focus:border-blue-500"
              />
            </div>
          )}

          {/* Vertical Checkbox List */}
          <div className="overflow-y-auto p-2 space-y-1 divide-y divide-gray-800/50">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((item) => {
                const isChecked = selectedIds.includes(item.id);
                return (
                  <label
                    key={item.id}
                    className={`${isChecked && mobile && 'bg-blue-950/40'} flex items-center space-x-2.5 px-2 py-2 hover:bg-[#1e2c40] rounded cursor-pointer text-xs transition-colors`}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleComboBoxToggle(item.id, paramKey)}
                      className="w-4 h-4 rounded border-gray-600 text-blue-600 bg-[#0b1622] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                    />
                    <span className={isChecked ? 'text-blue-400 font-semibold' : 'text-gray-300'}>
                      {item.name}
                    </span>
                  </label>
                );
              })
            ) : (
              <div className="p-3 text-center text-xs text-gray-400">No results found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}