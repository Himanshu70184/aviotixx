import { Router } from 'express';
import { searchFlights, rePriceFlights, getSeatMap, getSSRAvailability } from '../services/flightService.js';
 
const router = Router();
 
/**
 * POST /api/flights/search
 * Search for flights
 *
 * Request Body:
 * {
 *   tripType: 0 (OneWay) | 1 (RoundTrip) | 2 (MultiCity),
 *   adults: 1-9,
 *   children: 0-9,
 *   infants: 0-2,
 *   cabin: 0 (Economy) | 1 (First) | 2 (Business) | 4 (PremiumEconomy),
 *   searchDetails: [
 *     {
 *       origin: "DEL",
 *       destination: "BOM",
 *       departDate: "2024-03-15"
 *     }
 *   ]
 * }
 */
router.post('/search', async (req, res) => {
  try {
    const { tripType, adults, children, infants, cabin, searchDetails, traceId } = req.body;
 
    // Validation
    if (!adults || adults < 1 || adults > 9) {
      return res.status(400).json({
        success: false,
        error: 'Adults count must be between 1 and 9',
      });
    }
 
    if (children && (children < 0 || children > 9)) {
      return res.status(400).json({
        success: false,
        error: 'Children count must be between 0 and 9',
      });
    }
 
    if (infants && (infants < 0 || infants > 2)) {
      return res.status(400).json({
        success: false,
        error: 'Infants count must be between 0 and 2',
      });
    }
 
    if (!searchDetails || !Array.isArray(searchDetails) || searchDetails.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Search details are required and must be an array',
      });
    }
 
    // Validate trip type
    if (tripType === undefined || ![0, 1, 2].includes(tripType)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid trip type. Must be 0 (OneWay), 1 (RoundTrip), or 2 (MultiCity)',
      });
    }
 
    const result = await searchFlights({
      tripType,
      adults,
      children: children || 0,
      infants: infants || 0,
      cabin: cabin || 0,
      searchDetails,
      traceId,
    });
 
    if (result.success) {
      return res.status(200).json({
        success: true,
        data: result.data,
        traceId: result.traceId,
      });
    } else {
      return res.status(500).json({
        success: false,
        error: result.error,
      });
    }
  } catch (error) {
    console.error('Flight Search Route Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search flights',
      message: error.message,
    });
  }
});
 
/**
 * POST /api/flights/re-price
 * Re-check/validate flight pricing
 *
 * Request Body:
 * {
 *   journeyId: "xxxxx",
 *   segmentId: "xxxxx"
 * }
 */
router.post('/re-price', async (req, res) => {
  try {
    const { journeyId, segmentId } = req.body;
 
    if (!journeyId || !segmentId) {
      return res.status(400).json({
        success: false,
        error: 'Journey ID and Segment ID are required',
      });
    }
 
    const result = await rePriceFlights({
      journeyId,
      segmentId,
    });
 
    if (result.success) {
      return res.status(200).json({
        success: true,
        data: result.data,
      });
    } else {
      return res.status(500).json({
        success: false,
        error: result.error,
      });
    }
  } catch (error) {
    console.error('Flight Re-Price Route Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to re-price flight',
      message: error.message,
    });
  }
});
 
/**
 * POST /api/flights/seat-map
 * Get seat map for a specific flight
 *
 * Request Body:
 * {
 *   journeyId: "xxxxx",
 *   segmentId: "xxxxx"
 * }
 */
router.post('/seat-map', async (req, res) => {
  try {
    const { journeyId, segmentId } = req.body;
 
    if (!journeyId || !segmentId) {
      return res.status(400).json({
        success: false,
        error: 'Journey ID and Segment ID are required',
      });
    }
 
    const result = await getSeatMap({
      journeyId,
      segmentId,
    });
 
    if (result.success) {
      return res.status(200).json({
        success: true,
        data: result.data,
      });
    } else {
      return res.status(500).json({
        success: false,
        error: result.error,
      });
    }
  } catch (error) {
    console.error('Get Seat Map Route Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get seat map',
      message: error.message,
    });
  }
});
 
/**
 * POST /api/flights/ssr
 * Get SSR (Special Service Request) availability
 *
 * Request Body:
 * {
 *   journeyId: "xxxxx",
 *   segmentId: "xxxxx"
 * }
 */
router.post('/ssr', async (req, res) => {
  try {
    const { journeyId, segmentId } = req.body;
 
    if (!journeyId || !segmentId) {
      return res.status(400).json({
        success: false,
        error: 'Journey ID and Segment ID are required',
      });
    }
 
    const result = await getSSRAvailability({
      journeyId,
      segmentId,
    });
 
    if (result.success) {
      return res.status(200).json({
        success: true,
        data: result.data,
      });
    } else {
      return res.status(500).json({
        success: false,
        error: result.error,
      });
    }
  } catch (error) {
    console.error('Get SSR Route Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get SSR availability',
      message: error.message,
    });
  }
});
 
export default router;
 
 
