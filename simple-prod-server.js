// Simple HTTP server for React SSR without Express
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { URL } from 'url';

async function startServer() {
    // Set up directory paths
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const distPath = path.join(__dirname, 'dist');
    const clientDistPath = path.join(distPath, 'client');
    const serverDistPath = path.join(distPath, 'server');

    try {
        // Import the server entry point
        const { render } = await import('./dist/server/simple-entry-server.js');

        // Read the client entry HTML template
        console.log('Client dist path:', clientDistPath);
        const templatePath = path.join(clientDistPath, 'index.html');
        console.log('Using template at:', templatePath);

        if (!fs.existsSync(templatePath)) {
            console.error('Error: Template file not found at', templatePath);
            process.exit(1);
        }

        const template = fs.readFileSync(templatePath, 'utf-8');

        // Create an HTTP server
        const server = http.createServer(async (req, res) => {
            const url = req.url || '/';
            console.log(`Request received for: ${url}`);

            // Check if this is a request for a static file
            if (url.includes('.') && !url.endsWith('/')) {
                // Serve static file from client build directory
                const filePath = path.join(clientDistPath, url);
                try {
                    const data = fs.readFileSync(filePath);

                    // Set content type header based on file extension
                    const ext = path.extname(url).toLowerCase();
                    const contentType = {
                        '.html': 'text/html',
                        '.js': 'text/javascript',
                        '.css': 'text/css',
                        '.json': 'application/json',
                        '.png': 'image/png',
                        '.jpg': 'image/jpeg',
                        '.gif': 'image/gif',
                        '.svg': 'image/svg+xml',
                    }[ext] || 'application/octet-stream';

                    res.writeHead(200, { 'Content-Type': contentType });
                    res.end(data);
                    return;
                } catch (err) {
                    console.error(`Error serving static file ${url}:`, err);
                    res.writeHead(404);
                    res.end('File not found');
                    return;
                }
            }

            // For non-static files, use server-side rendering
            try {
                // Render the app to HTML
                const appHtml = await render(url);

                // Insert the rendered app into the HTML template
                const html = template.replace(`<div id="root"></div>`, `<div id="root">${appHtml}</div>`);

                // Send the complete HTML
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(html);
            } catch (error) {
                console.error('Error rendering page:', error);
                res.writeHead(500);
                res.end('Internal Server Error');
            }
        });

        // Start server
        const port = process.env.PORT || 3000;
        server.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
    }
}

startServer();
