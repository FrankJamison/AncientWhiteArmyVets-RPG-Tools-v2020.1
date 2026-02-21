// Root entrypoint for hosting platforms that expect index.js at repo root.
// Serve the web UI + API from a single Express app.

const path = require('path');
const fs = require('fs');

// Helpful crash logging for production hosts where logs are the only feedback.
process.on('unhandledRejection', (reason) => {
    console.error('Unhandled promise rejection:', reason);
    process.exitCode = 1;
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught exception:', err);
    process.exitCode = 1;
});

const serverEntrypoint = path.join(__dirname, 'Web-Server', 'src', 'index.js');

try {
    if (!fs.existsSync(serverEntrypoint)) {
        console.error('Server entrypoint not found:', {
            serverEntrypoint,
            cwd: process.cwd(),
            dirname: __dirname,
            node: process.version,
        });
        throw new Error(`Missing server entrypoint at ${serverEntrypoint}`);
    }

    require(serverEntrypoint);
} catch (err) {
    console.error('Failed to start server:', {
        message: err && err.message,
        code: err && err.code,
        serverEntrypoint,
        cwd: process.cwd(),
        dirname: __dirname,
        node: process.version,
    });

    throw err;
}