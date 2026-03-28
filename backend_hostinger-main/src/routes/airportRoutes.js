import express from 'express';
import Airport from '../models/Airport.js';

const router = express.Router();

// GET /api/airports?search=del
router.get('/', async (req, res) => {
  try {
    const { search = '' } = req.query;
    const query = search.trim();
    let results = [];
    if (query.length > 0) {
      const regex = new RegExp(query, 'i');
      // 1. Exact IATA code match (case-insensitive)
      const iataMatch = await Airport.find({ iata_code: { $regex: `^${query}$`, $options: 'i' } });
      // 2. Other matches (name, city, etc.), excluding the IATA match
      const orFilter = [
        { name: regex },
        { municipality: regex },
        { iso_country: regex },
        { keywords: regex },
        { ident: regex }
      ];
      if (iataMatch.length > 0) {
        // Exclude the already matched IATA code from the rest
        orFilter.push({ iata_code: { $nin: iataMatch.map(a => a.iata_code) } });
      }
      const otherMatches = await Airport.find({ $or: orFilter }).limit(15 - iataMatch.length);
      results = [...iataMatch, ...otherMatches];
    } else {
      // No query: return empty or popular airports if you wish
      results = [];
    }
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
