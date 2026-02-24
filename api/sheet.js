export default async function handler(req, res) {
  try {
    const SHEET_ID = '1URBq89zsukibuhspjo4dbWwdf15-nohAO4AwHmDbboo';
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv`;

    const r = await fetch(url, { redirect: 'follow' });
    if (!r.ok) throw new Error(`Google Sheets error: ${r.status}`);
    const text = await r.text();

    const rows = parseCSV(text);
    const today = {};
    const weekData = [];
    let inWeek = false;

    for (const row of rows) {
      const key = (row[0] || '').trim().toLowerCase();
      const val = (row[1] || '').trim();

      if (key.includes('points gagn')) {
        today.earned = parseInt(val) || 0;
      } else if (key === 'objectif') {
        today.goal = parseInt(val) || 0;
      } else if (key === 'restants') {
        today.remaining = parseInt(val) || 0;
      } else if (key === 'date' && val.includes('/') && !today.date) {
        today.date = val;
      } else if (key.includes('total 7 jours')) {
        today.weekTotal = parseInt(val) || 0;
      } else if (key.includes('objectifs atteints')) {
        today.weekGoalsHit = parseInt(val) || 0;
      } else if (key === 'jour') {
        inWeek = true;
        continue;
      }

      if (inWeek && row[0]?.trim() && row[1]?.trim() && row[0].trim().toLowerCase() !== 'jour') {
        weekData.push({
          day: row[0].trim(),
          date: row[1].trim(),
          points: parseInt((row[2] || '0').trim()) || 0,
        });
      }
    }

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json({ today, weekData, fetchedAt: new Date().toISOString() });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

function parseCSV(text) {
  return text.trim().split('\n').map(line => {
    const cols = [];
    let cur = '';
    let inQ = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        if (inQ && line[i + 1] === '"') { cur += '"'; i++; }
        else inQ = !inQ;
      } else if (c === ',' && !inQ) {
        cols.push(cur); cur = '';
      } else {
        cur += c;
      }
    }
    cols.push(cur);
    return cols;
  });
}
