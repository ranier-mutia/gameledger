import React from 'react';
import { GAME_MODES, PLAYER_PERSPECTIVES } from "../constants/igdbFilters.js"
import { useGameFilters } from '../hooks/useGameFilters.js';

// Map readable titles to your URL parameter keys
const PARAM_LABELS = {
    platforms: 'Platform',
    genres: 'Genre',
    gameModes: 'Mode',
    perspective: 'Perspective',
    themes: 'Theme',
    startYear: 'From',
    endYear: 'To',
};

export function ActiveFilterBadges({
    filterParams,
    removeBadge,
    resetAll
}) {

    const { igdbFilters } = useGameFilters();

    const filters = {
        platforms: igdbFilters?.platforms,
        genres: igdbFilters?.genres,
        gameModes: GAME_MODES,
        perspective: PLAYER_PERSPECTIVES,
        themes: igdbFilters?.themes
    }

    // 1. Extract all active parameters into a clean array of badges
    const activeBadges = [];

    filterParams.forEach((value, key) => {
        if (!value || key === "sort" || key === "offset") return;

        const label = PARAM_LABELS[key] || key;
        const filter = filters[key] || [];

        // Multi-select values (comma-separated strings like "Cyberpunk,Sci-Fi")
        if (value.includes(',')) {
            const ids = value.split(',');
            ids.forEach((id) => {
                const filterValue = filter.find((val) => String(val.id) === String(id))
                activeBadges.push({ key, value: id, name: filterValue?.name ?? id, label });
            });
        } else {
            if (key !== "startYear" && key !== "endYear" && key !== "search") {
                const filterValue = filter.find((val) => String(val.id) === String(value))
                activeBadges.push({ key, value, name: filterValue?.name ?? value, label });
            } else {
                activeBadges.push({ key, value, name: value, label });
            }

        }
    });

    if (activeBadges.length === 0) return null;

    return (
        <div className="flex md:flex-wrap items-center gap-2 pt-3 pb-2 text-nowrap overflow-x-auto [scrollbar-width:thin] [scrollbar-color:#475569_transparent] [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-600 [&::-webkit-scrollbar-thumb]:rounded-full">
            {/* Active Badges List */}
            {activeBadges.map(({ key, value, name, label }) => (
                <span
                    key={`${key}-${value}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/15 border border-blue-500/40 text-blue-300 rounded-lg text-xs font-medium animate-in fade-in zoom-in-95 duration-150"
                >
                    <span className="text-slate-400 font-normal">{label}:</span>
                    <span className="text-slate-100">{name}</span>

                    {/* Dismiss Button */}
                    <button
                        type="button"
                        onClick={() => removeBadge(key, value)}
                        className="ml-0.5 -mr-1 p-0.5 hover:bg-blue-500/20 text-blue-400 hover:text-blue-200 rounded-md transition-colors"
                        aria-label={`Remove filter ${label}: ${name}`}
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </span>
            ))}

            {/* Clear All Link */}
            <button
                type="button"
                onClick={resetAll}
                className="text-xs text-slate-400 hover:text-slate-200 underline underline-offset-2 ml-1 transition-colors"
            >
                Reset All ({activeBadges.length})
            </button>
        </div>
    );
}