# React + TypeScript + Vite + SSR Boilerplate

This project provides a React application with Server-Side Rendering (SSR) capabilities using Vite.

## Features

- **React 19** with TypeScript
- **Server-Side Rendering (SSR)** for improved performance and SEO
- **Client-side hydration** for interactive experiences
- **Development mode** with Hot Module Replacement (HMR)
- **Production build** with optimized assets

## Available Scripts

- `yarn dev`: Start the standard Vite development server (client-side only)
- `yarn dev:ssr`: Start the development server with SSR capabilities
- `yarn build`: Build both client and server bundles for production
- `yarn start`: Start the production server with SSR
- `yarn dev:prod`: Build and start the production server (for development testing)

## SSR Implementation

This project implements a minimal custom SSR solution with the following components:

- `minimal-dev-server.js`: Development server that provides an HTTP server for serving the application during development
- `simple-prod-server.js`: Production-ready server for serving the application with SSR
- `src/simple-entry-server.jsx`: Server entry point for rendering React components to HTML
- `src/entry-client.tsx`: Client entry point for hydrating the server-rendered HTML
- `src/utils/clientUtils.ts`: Utilities for handling client-side features safely

### How It Works

1. **Server-Side Rendering**:
   - When a request comes in, the server renders the React application to HTML using `ReactDOMServer.renderToString`
   - The HTML is sent to the browser with the initial state of the application

2. **Client-Side Hydration**:
   - When the JavaScript loads in the browser, React "hydrates" the server-rendered HTML
   - The application becomes interactive with event handlers attached

3. **Development Workflow**:
   - Use `yarn dev` for rapid development with client-side rendering only
   - Use `yarn dev:prod` to test SSR functionality during development
   - Use `yarn build && yarn start` for production deployment

### File Structure

```
src/
  ├── App.tsx                # Main application component
  ├── entry-client.tsx       # Client-side entry point for hydration
  ├── simple-entry-server.jsx # Server-side entry point for rendering
  └── utils/
      └── clientUtils.ts     # Utilities for handling client-side code safely
```

## SSR and SEO Benefits

Server-Side Rendering (SSR) provides significant SEO advantages for this application:

### How SSR Helps SEO

1. **Content Indexability**: Search engine crawlers see the fully rendered HTML content immediately, without waiting for JavaScript to execute. All text content, headings, and links are immediately visible to search engines.

2. **Faster Initial Load**: Search engines like Google factor page speed into rankings. SSR provides a faster First Contentful Paint (FCP), improving page speed metrics.

3. **Consistent Rendering**: Content is rendered the same way for search engines and users, avoiding discrepancies between what's indexed and what users see.

### Additional SEO Optimizations to Implement

For maximum SEO benefit with new pages and components, implement these practices:

#### 1. Meta Tags Management

Add meta tags for better search engine understanding:

```tsx
// Example for page components
import { Helmet } from 'react-helmet';

function ProductPage({ product }) {
  return (
    <>
      <Helmet>
        <title>{product.name} | Hotel </title>
        <meta name="description" content={product.description.substring(0, 160)} />
        <meta property="og:title" content={product.name} />
        <meta property="og:description" content={product.description.substring(0, 160)} />
        <meta property="og:image" content={product.imageUrl} />
      </Helmet>
      {/* Page content */}
    </>
  )
}
```

#### 2. Structured Data (JSON-LD)

Add structured data to help search engines understand content better:

```tsx
function HotelRoomPage({ room }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Room",
    "name": room.name,
    "description": room.description,
    "amenityFeature": room.amenities.map(amenity => ({
      "@type": "LocationFeatureSpecification",
      "name": amenity
    })),
    "occupancy": {
      "@type": "QuantitativeValue",
      "minValue": room.minOccupancy,
      "maxValue": room.maxOccupancy
    }
  };

  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      {/* Page content */}
    </>
  );
}
```

#### 3. Semantic HTML

Use semantic HTML elements to help search engines understand content structure:

```tsx
// Good for SEO
<article>
  <h1>Room Title</h1>
  <p>Description of the room</p>
  <section>
    <h2>Amenities</h2>
    <ul>
      {amenities.map(amenity => <li key={amenity}>{amenity}</li>)}
    </ul>
  </section>
</article>
```

#### 4. Image Optimization

Ensure images have proper alt text and consider implementing lazy loading:

```tsx
<img 
  src="/path/to/room-image.jpg" 
  alt="Deluxe Room with Ocean View" 
  width="800" 
  height="600"
  loading="lazy"
/>
```

### Implementation Strategy

To ensure all new pages benefit from SSR for SEO:

1. **Create a Page Template**: Develop a base template that includes common SEO elements
2. **Dynamic Meta Tags**: Ensure each page has unique, descriptive meta tags
3. **Content First Approach**: Place important content early in HTML
4. **Mobile Responsiveness**: Ensure all pages work well on mobile devices
5. **Performance Monitoring**: Use tools like Lighthouse to monitor SEO performance

While the technical SSR implementation provides an excellent foundation, content quality, backlinks, and user experience also play crucial roles in search rankings.
