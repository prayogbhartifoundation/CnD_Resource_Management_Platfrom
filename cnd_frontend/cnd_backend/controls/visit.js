// routes/visit.js
import { Router } from 'express';
import Visit from '../models/visitModel.js';

const visit_router = Router();

// POST: Increment visit count
visit_router.post('/api/visitHit', async (req, res) => {
  try {
    console.log("Visit hit endpoint hit");
    let visit = await Visit.findOne();

    if (!visit) {
      visit = new Visit({ count: 1 });
    } else {
      visit.count += 1;
    }

    await visit.save();
    res.json({ count: visit.count });
  } catch (err) {
    console.error("Visit count update error:", err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET: Current visit count
visit_router.get('/api/visitHitCount', async (req, res) => {
  try {
    const visit = await Visit.findOne();
    res.json({ count: visit ? visit.count : 0 });
  } catch (err) {
    console.error("Visit count fetch error:", err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ❌ DELETE THIS: Incorrect/unused GET /api/visit route
// It uses an undefined method `findOne()` with no model, causing errors
// visit_router.get('/api/visit', async (req, res) => {
//   try {
//     const visit = await findOne(); // ❌ This will break
//     res.json({ count: visit ? visit.count : 0 });
//   } catch (err) {
//     res.status(500).json({ error: 'Server error' });
//   }
// });

export default visit_router;
