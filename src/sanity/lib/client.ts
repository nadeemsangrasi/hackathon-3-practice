import { createClient } from "next-sanity";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, // Replace with your project ID
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET, // Or your dataset name
  apiVersion: "2024-01-04", // Today's date or latest API version
  useCdn: false, // Disable CDN for real-time updates
  token: process.env.token,
});
