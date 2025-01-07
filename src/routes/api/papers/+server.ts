import { DOMParser } from '@xmldom/xmldom'; // Import the DOMParser from xmldom

export async function GET({ url }) {
  const searchQuery = url.searchParams.get('query') || 'hep-th';
  const title = url.searchParams.get('title') || '';
  const start = url.searchParams.get('start') || 0;
  const maxResults = url.searchParams.get('maxResults') || 20;
  const apiUrl = `http://export.arxiv.org/api/query?search_query=cat:"${searchQuery}"${title ? `+AND+ti:"${title}"` : ''}&start=${start}&max_results=${maxResults}&sortBy=submittedDate&sortOrder=descending`;

  try {
    // Fetch data from the ArXiv API
    const response = await fetch(apiUrl);
    const xmlData = await response.text(); // ArXiv API returns XML

    // Parse the XML response into JSON
    const parsedData = await parseArxivXml(xmlData);

    // Fetch citation counts from Semantic Scholar API
    const papersWithCitations = await fetchCitationCounts(parsedData);

    // Return the JSON response
    return new Response(JSON.stringify(papersWithCitations), {
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
    title: entry.getElementsByTagName('title')[0]?.textContent?.trim() || '',
    summary: entry.getElementsByTagName('summary')[0]?.textContent?.trim() || '',
    published: entry.getElementsByTagName('published')[0]?.textContent?.trim().split('T')[0] || '',
    link: entry.getElementsByTagName('id')[0]?.textContent?.trim() || '',
    author: Array.from(entry.getElementsByTagName('author')).map((author) =>
      author.getElementsByTagName('name')[0]?.textContent?.trim() || ''
    ),
  }));
}

// Helper function to fetch citation counts from Semantic Scholar API
async function fetchCitationCounts(papers) {
  const apiKey = 'YOUR_SEMANTIC_SCHOLAR_API_KEY';
  const baseUrl = 'https://api.semanticscholar.org/graph/v1/paper/';
  const fields = 'citationCount';

  const papersWithCitations = await Promise.all(
    papers.map(async (paper) => {
      const paperId = paper.link.split('/abs/')[1];
      const url = `${baseUrl}${paperId}?fields=${fields}`;
      const response = await fetch(url, {
        headers: { 'x-api-key': apiKey },
      });
      const data = await response.json();
      return {
        ...paper,
        citationCount: data.citationCount || 0,
      };
    })
  );

  return papersWithCitations;
}
