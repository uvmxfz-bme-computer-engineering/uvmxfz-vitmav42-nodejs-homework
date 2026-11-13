/**
 * PM2 process definitions for the local development stack.
 *
 * Defining both processes in one file keeps `pm2 startOrReload` / `pm2 delete`
 * idempotent and identical on Windows, macOS and Linux.
 *
 * @module ecosystem.config
 */
const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;

/**
 * Resolves an executable on PATH so PM2 can spawn a binary instead of a
 * Node script (`script: 'mongod'` alone is not resolved by PM2).
 *
 * Homebrew prefixes are searched explicitly: the PM2 daemon restored at boot
 * (launchd) often does not inherit the interactive shell's PATH.
 *
 * @param {string} bin Bare executable name, without extension.
 * @returns {string|null} Absolute path, or null when not installed.
 */
function findOnPath(bin) {
    const extensions = process.platform === 'win32' ? ['.exe', '.cmd', '.bat', ''] : [''];
    const extraDirs = process.platform === 'darwin' ? ['/opt/homebrew/bin', '/usr/local/bin'] : [];
    const dirs = [...(process.env.PATH || '').split(path.delimiter), ...extraDirs].filter(Boolean);
    for (const dir of dirs) {
        for (const ext of extensions) {
            const candidate = path.join(dir, bin + ext);
            if (fs.existsSync(candidate)) return candidate;
        }
    }
    return null;
}

/**
 * Resolves the database directory, preferring an existing directory whose name
 * only differs in case. Case-insensitive file systems (Windows, default APFS)
 * hide a `DB`/`db` mismatch that case-sensitive ones turn into a second,
 * silently empty data directory.
 *
 * @param {string} dir Absolute path or a directory name relative to the root.
 * @returns {string} Absolute path to use as `--dbpath`.
 */
function resolveDbPath(dir) {
    const absolute = path.resolve(root, dir);
    if (path.dirname(absolute) !== root) return absolute;
    const target = path.basename(absolute).toLowerCase();
    const existing = fs.readdirSync(root, { withFileTypes: true })
        .find(entry => entry.isDirectory() && entry.name.toLowerCase() === target);
    return path.join(root, existing ? existing.name : path.basename(absolute));
}

const mongoPort = process.env.MONGO_PORT || '27017';
const mongoDbPath = resolveDbPath(process.env.MONGO_DB_PATH || 'db');
const mongoLogPath = process.env.MONGO_LOG_PATH || path.join(mongoDbPath, 'mongod.log');
const resolvedMongod = process.env.MONGOD_BIN || findOnPath('mongod');

if (!resolvedMongod) {
    console.warn('[ecosystem] mongod not found on PATH or in Homebrew prefixes; '
        + 'set MONGOD_BIN to an absolute path so PM2 can start the mongodb process.');
}

const mongodBin = resolvedMongod || 'mongod';

// mongod refuses to start when its --dbpath does not exist yet (fresh clone).
fs.mkdirSync(mongoDbPath, { recursive: true });

module.exports = {
    apps: [
        {
            name: 'mongodb',
            script: mongodBin,
            interpreter: 'none',
            args: [
                '--dbpath', mongoDbPath,
                '--port', mongoPort,
                '--logpath', mongoLogPath,
                '--logappend',
            ],
            cwd: root,
            autorestart: true,
            max_restarts: 5,
            min_uptime: '10s',
            env: {
                MONGO_PORT: mongoPort,
                MONGO_DB_PATH: mongoDbPath,
                MONGO_LOG_PATH: mongoLogPath,
            },
        },
        {
            name: 'app',
            script: path.join(root, 'index.js'),
            cwd: root,
            autorestart: true,
            max_restarts: 10,
            min_uptime: '10s',
            env: {
                NODE_ENV: 'development',
                PORT: process.env.PORT || '3000',
                MONGO_PORT: mongoPort,
                MONGODB_URI: process.env.MONGODB_URI || `mongodb://localhost:${mongoPort}/uvmxfz`,
            },
            env_production: {
                NODE_ENV: 'production',
            }
        },
    ],
};
