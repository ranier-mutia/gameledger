import React, { useState, useMemo, useRef, useEffect } from 'react';

export function DropdownFilter({
    label,
    paramKey,
    options = [],
    hasSearch = false,
    isSearching = false,
    filterParams,
    handleDropdownToggle
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const popoverRef = useRef(null);

    // Read selected IDs from URL search params (?genre=1,2)
    const selected = useMemo(() => {
        const id = filterParams.get(paramKey);
        return id ? id : [];
    }, [filterParams, paramKey]);


    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (popoverRef.current && !popoverRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const relevance = useMemo(() => {
        if (!isSearching) return options;
        return options.filter((opt) =>
            opt.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
        );
    }, [options, searchTerm]);

    // Filter options by search input
    const filteredOptions = useMemo(() => {
        if (!searchTerm.trim()) return options;
        return options.filter((opt) =>
            opt.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
        );
    }, [options, searchTerm]);

    return (
        <div className="relative" ref={popoverRef}>
            {/* Uniform Select Trigger Button (Matches your dark UI image) */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between bg-gray-800 text-sm text-slate-300 px-3 py-2 rounded-lg border-slate-700/60 hover:bg-gray-900 transition-colors "
            >
                <span className="truncate">
                    {options.find((item) => item.id === selected)?.name || 'Most Popular'}
                </span>
                <span className="text-xs text-gray-400">{isOpen ? '▲' : '▼'}</span>
            </button>

            {/* Uniform Width Checkbox Popover */}
            {isOpen && (
                <div className="absolute left-0 z-50 mt-2 w-48 xl:w-full bg-gray-800 border border-gray-700 rounded-lg shadow-2xl text-white flex flex-col max-h-72">

                    {/* Optional Search Input for large lists like Platforms/Themes */}
                    {hasSearch && (
                        <div className="p-2 border-b border-gray-700">
                            <input
                                type="text"
                                placeholder={`Search ${label.toLowerCase()}...`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-[#0b1622] text-xs text-white px-2.5 py-1.5 rounded border border-gray-700 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    )}

                    {/* Vertical Checkbox List */}
                    <div className="overflow-y-auto p-2 space-y-1 divide-y divide-gray-800/50">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.filter((option) => option.id !== 'relevance' || isSearching).map((item) => {
                                const isSelected = selected === item.id;
                                return (
                                    <div
                                        onClick={() => {
                                            if(item.id === selected) {
                                                setIsOpen(false);
                                                return
                                            };
                                            handleDropdownToggle(item.id, paramKey);
                                            setIsOpen(false);
                                        }}
                                        key={item.id}
                                        className="flex items-center space-x-2.5 px-2 py-1.5 hover:bg-[#1e2c40] rounded cursor-pointer text-xs transition-colors"
                                    >

                                        <span className={isSelected ? 'text-blue-400 font-semibold' : 'text-gray-300'}>
                                            {item.name}
                                        </span>

                                    </div>
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