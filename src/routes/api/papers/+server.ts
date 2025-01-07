export async function GET() {
    const papers = [
      { title: "Paper 1", date: "2025-01-06", author: "Author A" },
      { title: "Paper 2", date: "2025-01-05", author: "Author B" },
    ];
    return new Response(JSON.stringify(papers), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  