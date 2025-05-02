// Minimal HTTP server for development without Express
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

// Convert ESM __dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  // Create Vite server in middleware mode
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });

  // Read index.html
  const indexPath = path.resolve(__dirname, 'index.html');
  const template = fs.readFileSync(indexPath, 'utf-8');
  
  // Create server
  const server = http.createServer(async (req, res) => {
    const url = req.url || '/';
    console.log(`Requested URL: ${url}`);
    
    try {
      // Let Vite handle static assets
      const viteResponse = await new Promise(resolve => {
        let handled = false;
        
        // Create middleware response-like object
        const mockRes = {
          end: (content) => {
            if (content) res.write(content);
            res.end();
            handled = true;
            resolve(true);
          },
          setHeader: (name, value) => { 
            res.setHeader(name, value); 
            return mockRes;
          },
          getHeader: name => res.getHeader(name),
          hasHeader: name => res.hasHeader(name),
          writeHead: (status, headers) => { 
            res.writeHead(status, headers); 
            return mockRes; 
          },
          write: chunk => { 
            res.write(chunk); 
            return mockRes; 
          },
          statusCode: 200,
        };
        
        // Call Vite middleware
        vite.middlewares({ 
          url, 
          method: req.method, 
          headers: req.headers 
        }, mockRes, () => {
          resolve(false);
        });
        
        // Handle timeout
        setTimeout(() => {
          if (!handled) resolve(false);
        }, 1000);
      });
      
      // If Vite didn't handle it, serve the index with client-side rendering
      if (!viteResponse) {
        const transformedTemplate = await vite.transformIndexHtml(url, template);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(transformedTemplate);
      }
    } catch (e) {
      console.error(`Error handling ${url}:`, e);
      res.writeHead(500, { 'Content-Type': 'text/html' });
      res.end(`<h1>Server Error</h1><pre>${e.stack}</pre>`);
    }
  });
  
  // Start the server
  const PORT = 3000;
  server.listen(PORT, () => {
    console.log(`Development server running at http://localhost:${PORT}`);
    console.log('Using client-side rendering with HMR for development');
  });
}

startServer();
