 export default async function handler(req, res) {                             
    try {                                                                      
      const url = 'https://script.google.com/macros/s/AKfycbwRsKUIpN6X6wkA2QhvrJ
  10pP-WsmMCkma5xQsZSpVBurWvnEPa3mLfwPOfMSw86gZIrg/exec';                       

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      const r = await fetch(url, { redirect: 'follow', signal: controller.signal
   });
      clearTimeout(timeout);

      const text = await r.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        return res.status(500).json({ error: 'JSON invalide', raw: text.slice(0,
   300) });
      }

      res.setHeader('Cache-Control', 's-maxage=300,
  stale-while-revalidate=600');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.json(data);

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
