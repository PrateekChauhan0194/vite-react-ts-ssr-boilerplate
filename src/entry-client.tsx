// Client entry point for hydration
import React from 'react'
import { hydrateRoot } from 'react-dom/client'
import App from './App'
import './index.css'

// Client-side hydration
hydrateRoot(
    document.getElementById('root')!,
    <React.StrictMode>
        <App />
    </React.StrictMode>
)
