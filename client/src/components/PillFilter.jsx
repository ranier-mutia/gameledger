import React, { useMemo, useState } from "react";

export const PillFilter = ({ label, paramKey, options = [], hasSearch = false, multiSelect = false, filterParams, handlePillToggle }) => {

    const [searchTerm, setSearchTerm] = useState('');


    const selectedItem = useMemo(() => {
        const selected = filterParams.get(paramKey);

        if (!multiSelect) {
            return selected ? selected : [];
        } else {
            return selected ? selected.split(',').map(Number) : [];
        }

    }, [filterParams, paramKey]);

    // Filter options by search input
    const filteredOptions = useMemo(() => {
        if (!searchTerm.trim()) return options;
        return options.filter((opt) =>
            opt.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
        );
    }, [options, searchTerm]);


    return (
        <div className="flex flex-wrap gap-2">

            {hasSearch && (
                <div className="p-2 border-b border-gray-700 w-full">
                    <input
                        type="text"
                        placeholder={`Search ${label.toLowerCase()}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#0b1622] text-xs text-white px-2.5 py-2 rounded border border-gray-700 focus:outline-none focus:border-blue-500"
                    />
                </div>
            )}

            {options.map((item) => {
                let isSelected = false;
                if (!multiSelect) {
                    isSelected = selectedItem == item.id;
                } else {
                    isSelected = selectedItem.includes(item.id);
                }

                return (
                    <button
                        key={item.id}
                        type="button"
                        onClick={() => handlePillToggle(item.id, paramKey, multiSelect, selectedItem)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all break-words max-w-full text-left ${isSelected
                            ? 'bg-blue-600/25 text-blue-300 border border-blue-500/60 shadow-sm shadow-blue-500/10'
                            : 'bg-[#0f172a] text-slate-300 border border-slate-700/60 hover:border-slate-600'
                            }`}
                    >
                        {item.name}
                    </button>
                );
            })}
        </div>
    )



}