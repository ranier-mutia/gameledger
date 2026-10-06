import { z } from 'zod';
import { 
  GAME_MODES, 
  SORT_OPTIONS, 
  PLAYER_PERSPECTIVES, 
  YEAR_OPTIONS, 
  PLATFORMS, 
  GENRES, 
  THEMES 
} from '../constants/igdbFilters.js';
import { extractIds } from '../utils/zodHelpers.js';

// Pre-calculate valid ID sets on server startup
const validIds = {
  platforms: extractIds(PLATFORMS),
  genres: extractIds(GENRES),
  themes: extractIds(THEMES),
  gameModes: extractIds(GAME_MODES),
  perspectives: extractIds(PLAYER_PERSPECTIVES),
  sorts: extractIds(SORT_OPTIONS),
};

/**
 * Helper to split comma-separated query strings (e.g. ?genres=12,45) 
 * into typed integer/string arrays for Database queries
 */
function createBackendMultiSelectSchema(allowedIds = [], castToNumber = true) {
  const allowedSet = new Set(allowedIds.map((id) => String(id).toLowerCase()));

  return z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return [];

      const items = val
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item.length > 0 && allowedSet.has(item.toLowerCase()));

      // Optionally cast IDs to numbers if IGDB/Database uses numeric IDs
      return castToNumber ? items.map(Number) : items;
    });
}

export const backendFilterSchema = z.object({
  search: z.string().trim().max(100).optional().default(''),
  sort: z.enum(validIds.sorts).catch('popularity_desc'),
  startYear: z.enum(YEAR_OPTIONS).optional().catch(undefined),
  endYear: z.enum(YEAR_OPTIONS).optional().catch(undefined),

  // Multi-select fields output ready-to-use arrays for Prisma/Knex/TypeORM/IGDB API
  platforms: createBackendMultiSelectSchema(validIds.platforms),
  genres: createBackendMultiSelectSchema(validIds.genres),
  themes: createBackendMultiSelectSchema(validIds.themes),
  gameModes: createBackendMultiSelectSchema(validIds.gameModes),
  perspective: createBackendMultiSelectSchema(validIds.perspectives),

  // Correct offset validation
  offset: z.coerce.number().int().nonnegative().catch(0)
});