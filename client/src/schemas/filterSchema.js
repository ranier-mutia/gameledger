// filterSchema.js
import { z } from 'zod';
import { GAME_MODES, SORT_OPTIONS, PLAYER_PERSPECTIVES, YEAR_OPTIONS, PLATFORMS, GENRES, THEMES } from '../constants/igdbFilters.js';
import { extractIds } from '../utils/zodHelpers.js';

const modeIds = extractIds(GAME_MODES);
const sortIds = extractIds(SORT_OPTIONS);
const perspectiveIds = extractIds(PLAYER_PERSPECTIVES);

/**
 * Creates a dynamic Zod filter schema using live IGDB data
 * @param {Object} dynamicFilters - Object containing igdbFilters (platforms, genres, themes)
 */
export const createFilterSchema = (dynamicFilters = {}) => {
  // Safe extraction with fallbacks to empty arrays if IGDB data is still loading
  const platformIds = extractIds(dynamicFilters?.platforms || PLATFORMS);
  const genreIds = extractIds(dynamicFilters?.genres || GENRES);
  const themeIds = extractIds(dynamicFilters?.themes || THEMES);

  return z.object({
    search: z.string().trim().max(100).optional(),
    sort: z.enum(sortIds).catch('popularity_desc'),
    startYear: z.enum(YEAR_OPTIONS).optional().catch(undefined),
    endYear: z.enum(YEAR_OPTIONS).optional().catch(undefined),

    // Multi-select helper for dynamic arrays
    platforms: createMultiSelectSchema(platformIds),
    genres: createMultiSelectSchema(genreIds),
    themes: createMultiSelectSchema(themeIds),
    gameModes: createMultiSelectSchema(modeIds),
    perspective: createMultiSelectSchema(perspectiveIds),

    offset: z.coerce.number().int().nonnegative().catch(0),
  });
};

function createMultiSelectSchema(validIds = []) {
    return z
      .string()
      .optional()
      .transform((val) => {
        if (!val) return [];
  
        // 1. Split URL string into clean trimmed values
        const urlItems = val
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean);
  
        // 2. Safeguard: Convert validIds to a normalized string list
        const stringValidIds = (validIds || []).map((id) => String(id).toLowerCase());
  
        // 3. If dynamic options haven't loaded yet from API, keep the URL values intact
        if (stringValidIds.length === 0) {
          return urlItems;
        }
  
        // 4. Once loaded, filter against case-insensitive string IDs
        return urlItems.filter((item) => stringValidIds.includes(item.toLowerCase()));
      });
  }