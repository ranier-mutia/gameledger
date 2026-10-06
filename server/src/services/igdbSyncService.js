import db from '../config/database.js';
import { getTwitchToken } from '../config/igdb.js';

export async function syncIgdbReferenceData() {
    const token = await getTwitchToken();

    async function fetchAllFromIgdb(endpoint, fields) {
        let allRecords = [];
        let offset = 0;
        const limit = 500;
        let keepFetching = true;

        while (keepFetching) {
            const response = await fetch(`https://api.igdb.com/v4/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Client-ID': process.env.TWITCH_CLIENT_ID,
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'text/plain',
                },
                body: `fields ${fields}; limit ${limit}; offset ${offset};`,
            });

            const records = await response.json();
            allRecords = allRecords.concat(records);

            if (records.length < limit) {
                keepFetching = false;
            } else {
                offset += limit;
            }
        }

        return allRecords;
    }

    // 3. PostgreSQL Bulk Upsert Helper
    async function upsertRecords(tableName, records, columns) {
        if (records.length === 0) return;

        try {
            await db.query('BEGIN');

            for (const item of records) {
                const colNames = columns.join(', ');
                const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
                const values = columns.map((col) => item[col] ?? null);

                // Construct ON CONFLICT statement
                const updateSet = columns
                    .filter((c) => c !== 'id')
                    .map((c) => `${c} = EXCLUDED.${c}`)
                    .join(', ');

                const query = `
        INSERT INTO ${tableName} (${colNames}, updated_at)
        VALUES (${placeholders}, NOW())
        ON CONFLICT (id) DO UPDATE SET ${updateSet}, updated_at = NOW();
      `;

                await db.query(query, values);
            }

            await db.query('COMMIT');
            console.log(`Successfully synced ${records.length} items to ${tableName}`);
        } catch (err) {
            await db.query('ROLLBACK');
            console.error(`Error syncing ${tableName}:`, err);
        }
    }

    async function runDailySync() {
        console.log('Starting daily IGDB reference sync...');

        // Sync Genres
        const genres = await fetchAllFromIgdb('genres', 'name,slug');
        await upsertRecords('igdb_genres', genres, ['id', 'name', 'slug']);

        // Sync Themes
        const themes = await fetchAllFromIgdb('themes', 'name,slug');
        await upsertRecords('igdb_themes', themes, ['id', 'name', 'slug']);

        // Sync Platforms
        const platforms = await fetchAllFromIgdb('platforms', 'name,slug,abbreviation, platform_type');
        await upsertRecords('igdb_platforms', platforms, ['id', 'name', 'slug', 'abbreviation', 'platform_type']);

        console.log('Daily IGDB sync finished!');
        return;
    }

    //runDailySync();

    return { status: 'success', syncedAt: new Date() };
}

await syncIgdbReferenceData()