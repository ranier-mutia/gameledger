import React, { useMemo } from 'react';

export function YearRangeFilter({
    options = [],
    paramStart,
    paramEnd,
    filterParams,
    handleYearToggle
}) {

    const StartYear = useMemo(() => {
        const year = filterParams.get(paramStart);
        return year ? year : "";
    }, [filterParams, paramStart]);

    const EndYear = useMemo(() => {
        const year = filterParams.get(paramEnd);
        return year ? year : "";
    }, [filterParams, paramEnd]);


    // Filter "From" options so users can't pick a starting year later than "To"
    const filteredFromOptions = EndYear
        ? options.filter((y) => parseInt(y) <= parseInt(EndYear))
        : options;

    // Filter "To" options so users can't pick an ending year earlier than "From"
    const filteredToOptions = StartYear
        ? options.filter((y) => parseInt(y) >= parseInt(StartYear))
        : options;


    return (
        <div className="w-full bg-[#121927] border border-slate-700/80 rounded-xl p-3.5 space-y-2 shadow-lg">
            <div className="flex items-center gap-3">
                {/* FROM YEAR DROPDOWN */}
                <div className="flex-1">
                    <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
                        From
                    </label>
                    <div className="relative">
                        <select
                            value={StartYear ?? ""}
                            onChange={(e) => { handleYearToggle(e.target.value, "from", paramStart, paramEnd) }}
                            className="w-full h-9 px-3 pr-8 bg-[#0b1120] border border-slate-700 rounded-lg text-slate-100 text-sm appearance-none focus:outline-none transition-colors cursor-pointer hover:ring-1 focus:ring-1 hover:ring-blue-600 focus:ring-blue-500">
                            <option value="">Any</option>
                            {filteredFromOptions.map((year) => (
                                <option key={`from-${year}`} value={year} className="bg-[#121927] text-slate-100 hover:bg-blue-900">
                                    {year}
                                </option>
                            ))}
                        </select>
                        {/* Custom Chevron Indicator */}
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* SEPARATOR DIVIDER */}
                <span className="text-slate-500 font-medium self-end pb-3 text-sm">—</span>

                {/* TO YEAR DROPDOWN */}
                <div className="flex-1">
                    <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
                        To
                    </label>
                    <div className="relative">
                        <select
                            value={EndYear ?? ""}
                            onChange={(e) => { handleYearToggle(e.target.value, "to", paramStart, paramEnd) }}
                            className="w-full h-9 px-3 pr-8 bg-[#0b1120] border border-slate-700 rounded-lg text-slate-100 text-sm appearance-none focus:outline-none transition-colors cursor-pointer hover:ring-1 focus:ring-1 hover:ring-blue-600 focus:ring-blue-500">
                            <option value="">Any</option>
                            {filteredToOptions.map((year) => (
                                <option key={`to-${year}`} value={year} className="bg-[#121927] text-slate-100">
                                    {year}
                                </option>
                            ))}
                        </select>
                        {/* Custom Chevron Indicator */}
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}