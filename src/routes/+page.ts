export const load = async ({ fetch }) => {
    const res = await fetch('/api/papers'); // Call your API route
    const papers = await res.json(); // Parse the JSON response
    return { papers }; // Return the data to the Svelte page
  };