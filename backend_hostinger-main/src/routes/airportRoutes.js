import express from 'express';
import Airport from '../models/Airport.js';

const router = express.Router();

// GET /api/airports?search=del
router.get('/', async (req, res) => {
  try {
    const { search = '' } = req.query;
    const query = search.trim();
    let filter = {};
    if (query.length > 0) {
      const regex = new RegExp(query, 'i');
      filter = {
        $or: [
          { iata_code: regex },
          { name: regex },
          { municipality: regex },
          { iso_country: regex },
          { keywords: regex },
          { ident: regex }
        ]
      };
    }
    const airports = await Airport.find(filter).limit(15);
    res.json(airports);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
