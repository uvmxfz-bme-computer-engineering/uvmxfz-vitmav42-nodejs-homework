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
 * @param {string} bin Bare executable name, without extension.
 * @returns {string|null} Absolute path, or null when not installed.
 */
function findOnPath(bin) {
    const extensions = process.platform === 'win32' ? ['.exe', '.cmd', '.bat', ''] : [''];
    const dirs = (process.env.PATH || '').split(path.delimiter).filter(Boolean);
    for (const dir of dirs) {
        for (const ext of extensions) {
            const candidate = path.join(dir, bin + ext);
            if (fs.existsSync(candidate)) return candidate;
        }
    }
    return null;
}

const mongoPort = process.env.MONGO_PORT || '27017';
const mongoDbPath = process.env.MONGO_DB_PATH || path.join(root, 'db');
const mongoLogPath = process.env.MONGO_LOG_PATH || path.join(mongoDbPath, 'mongod.log');
const mongodBin = process.env.MONGOD_BIN || findOnPath('mongod') || 'mongod';

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
            },
        },
    ],
};
