// src/routes/+page.ts

// Define the `load` function for server-side or client-side data fetching
export const load = async ({ fetch }) => {
  // Fetch data from the API route you created (e.g., /api/papers)
  const res = await fetch('/api/papers?query="hep-th"&start=0&maxResults=20');
  const parsedData = await res.json(); // Parse the JSON response

  // Return the data to the page
  return {
    papers: parsedData,
  };
};
