export async function fetchPoster(title: string, apiKey: string): Promise<string> {
    const url = `https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    // OMDb returns 'N/A' if not found
    return data.Poster && data.Poster !== 'N/A'
      ? data.Poster
      : 'https://placehold.co/400x600.png';
  }