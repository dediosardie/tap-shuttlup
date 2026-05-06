// Auth guards are handled client-side in React Router (src/app/routes.ts).
// This file intentionally exports no matcher so Vercel Edge Middleware is a no-op.
export const config = { matcher: [] };
