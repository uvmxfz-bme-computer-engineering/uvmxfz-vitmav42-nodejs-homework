/**
 * Starts a local MongoDB server using the project-local data directory.
 * Equivalent to running start_mongodb.bat, but cross-platform.
 *
 * @module scripts/start-mongo
 */
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'db');
const logPath = path.join(dbPath, 'mongod.log');

fs.mkdirSync(dbPath, { recursive: true });

const mongod = spawn('mongod', [
    '--dbpath', dbPath,
    '--port', '27017',
    '--logpath', logPath,
    '--logappend',
], { stdio: 'inherit' });

mongod.on('error', (error) => {
    console.error(`Failed to start mongod: ${error.message}`);
    process.exit(1);
});

mongod.on('exit', (code) => process.exit(code ?? 0));

['SIGINT', 'SIGTERM'].forEach((signal) => {
    process.on(signal, () => mongod.kill(signal));
});
