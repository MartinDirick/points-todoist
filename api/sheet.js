export default async function handler(req, res) {                            
    try {                                                                       
      const url = 'https://script.google.com/macros/s/AKfycbwRsKUIpN6X6wkA2QhvrJ
  10pP-WsmMCkma5xQsZSpVBurWvnEPa3mLfwPOfMSw86gZIrg/exec';
      const r = await fetch(url, { redirect: 'follow' });
      if (!r.ok) throw new Error(`Apps Script error: ${r.status}`);
      const data = await r.json();

      res.setHeader('Cache-Control', 's-maxage=300,
  stale-while-revalidate=600');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.json(data);

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
