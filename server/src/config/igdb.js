import db from "./database.js";

export async function getTwitchToken() {
    // 1. Query database for existing active token
    const { rows } = await db.query(
        `SELECT access_token FROM system_tokens 
       WHERE service_name = 'twitch' AND expires_at > NOW() + INTERVAL '5 minutes'`
    );

    if (rows.length > 0) {
        return rows[0].access_token; // Reuse database token across independent script runs
    }

    // 2. Fetch new token from Twitch API
    const res = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_SECRET}&grant_type=client_credentials`, { method: 'POST' });
    const data = await res.json();

    if (!res.ok || !data.access_token) {
        throw new Error(`Twitch OAuth error: ${data.message || 'Failed to retrieve access token'}`);
    }

    // 2. Safely parse expires_in (defaults to 5,184,000 seconds / 60 days if missing)
    const expiresInSeconds = parseInt(data.expires_in, 10) || 5184000;

    // 3. Calculate future expiration date
    const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);

    await db.query(
        `INSERT INTO system_tokens (service_name, access_token, expires_at)
       VALUES ('twitch', $1, $2)
       ON CONFLICT (service_name) DO UPDATE SET access_token = EXCLUDED.access_token, expires_at = EXCLUDED.expires_at`,
        [data.access_token, expiresAt]
    );

    return data.access_token;
}