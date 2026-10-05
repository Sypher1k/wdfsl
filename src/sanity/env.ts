export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
export const apiVersion = process.env.SANITY_API_VERSION || '2026-09-01';

if (!projectId && process.env.NODE_ENV !== 'production') {
  // The build can still run before Sanity is connected; the newsroom shows an empty state.
}
