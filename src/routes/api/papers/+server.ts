import { DOMParser } from '@xmldom/xmldom'; // Import the DOMParser from xmldom

export async function GET({ url }) {
  const searchQuery = url.searchParams.get('query') || 'high+energy+physics';
  const apiUrl = `http://export.arxiv.org/api/query?search_query=all:${searchQuery}&start=0&max_results=10&sortBy=submittedDate&sortOrder=descending`;

  try {
    // Fetch data from the ArXiv API
    const response = await fetch(apiUrl);
    const xmlData = await response.text(); // ArXiv API returns XML

    // Parse the XML response into JSON
    const parsedData = parseArxivXml(xmlData);

    // Return the JSON response
    return new Response(JSON.stringify(parsedData), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    // Log the error and return a response with a 500 status code
    console.error('Error fetching papers:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch papers', details: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}

// Helper function to parse ArXiv XML into JSON
function parseArxivXml(xml) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'application/xml');
  const entries = Array.from(doc.getElementsByTagName('entry'));

  return entries.map((entry) => ({
    title: entry.getElementsByTagName('title')[0].textContent.trim(),
    summary: entry.getElementsByTagName('summary')[0].textContent.trim(),
    published: entry.getElementsByTagName('published')[0].textContent.trim(),
    link: entry.getElementsByTagName('id')[0].textContent.trim(),
    author: Array.from(entry.getElementsByTagName('author')).map((author) =>
      author.getElementsByTagName('name')[0].textContent.trim()
    ),
  }));
}
