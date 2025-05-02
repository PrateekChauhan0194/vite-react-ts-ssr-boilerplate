// Robust SSR entry point with improved error handling
import React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import App from './App';

/**
 * Server-side render the React application
 * @param {string} url - The URL being rendered
 * @returns {string} - HTML string of the rendered application
 */
export function render(url) {
    console.log(`Server rendering URL: ${url}`);

    try {
        // Use renderToString for server-side rendering
        const html = ReactDOMServer.renderToString(
            <React.StrictMode>
                <App />
            </React.StrictMode>
        );

        console.log('Server rendering successful');
        return html;
    } catch (error) {
        // Log the error but return an empty div to avoid breaking the page
        console.error('Error during server rendering:', error);
        return '<div>Loading application...</div>';
    }
}
