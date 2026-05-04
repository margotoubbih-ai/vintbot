export default async function handler(req, res) {
  // Allow all origins (ton app frontend)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { search, price_from, price_to, per_page = 48 } = req.query;

  if (!search) {
    return res.status(400).json({ error: 'Missing search param' });
  }

  // Build Vinted URL
  let vintedUrl = `https://www.vinted.fr/api/v2/catalog/items?search_text=${encodeURIComponent(search)}&order=newest_first&per_page=${per_page}`;
  if (price_from) vintedUrl += `&price_from=${price_from}`;
  if (price_to)   vintedUrl += `&price_to=${price_to}`;

  try {
    const response = await fetch(vintedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'fr-FR,fr;q=0.9',
        'Referer': 'https://www.vinted.fr/',
        'Origin': 'https://www.vinted.fr',
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: `Vinted error: ${response.status}` });
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
