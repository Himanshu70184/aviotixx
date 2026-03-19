import { Router } from 'express';
import { FlightInquiry } from '../models/FlightInquiry.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = Router();

/**
 * POST /api/inquiries
 * Create a new flight inquiry (Public endpoint)
 */
router.post('/', async (req, res) => {
  try {
    const {
      tripType,
      origin,
      destination,
      departDate,
      returnDate,
      adults,
      children,
      infants,
      cabin,
      // Detailed passenger data
      passengers,
      contactInfo,
      paymentInfo,
      // Legacy fields for backward compatibility
      passengerName,
      passengerEmail,
      passengerPhone,
      // Flight selection
      journeyId,
      segmentId,
      selectedFlight,
      traceId,
      priority,
      source
    } = req.body;

    // Validation for required fields
    if (!origin || !destination || !departDate) {
      return res.status(400).json({
        success: false,
        error: 'Missing required flight details: origin, destination, departDate',
      });
    }

    // Validate contact information
    if (!contactInfo || !contactInfo.email || !contactInfo.phoneNumber) {
      // Fall back to legacy fields if available
      if (!passengerEmail || !passengerPhone || !passengerName) {
        return res.status(400).json({
          success: false,
          error: 'Missing required contact information',
        });
      }
    }

    // Validate passenger information
    if (passengers && passengers.length > 0) {
      for (const passenger of passengers) {
        if (!passenger.firstName || !passenger.lastName || !passenger.gender) {
          return res.status(400).json({
            success: false,
            error: 'Missing required passenger information: firstName, lastName, gender',
          });
        }
      }
    }

    // Prepare inquiry data
    const inquiryData = {
      tripType: tripType || 0,
      origin: origin.toUpperCase(),
      destination: destination.toUpperCase(),
      departDate: new Date(departDate),
      returnDate: returnDate ? new Date(returnDate) : null,
      adults: adults || 1,
      children: children || 0,
      infants: infants || 0,
      cabin: cabin || 0,
      
      // Detailed data if provided
      passengers: passengers || [],
      contactInfo: contactInfo || {
        email: passengerEmail,
        phoneNumber: passengerPhone,
        countryCode: '+1'
      },
      paymentInfo: paymentInfo ? {
        ...paymentInfo,
        cvv: paymentInfo.cvv ? '***' : undefined // Mask CVV for security
      } : {},
      
      // Legacy fields for backward compatibility
      passengerName: passengerName || (passengers && passengers.length > 0 ? `${passengers[0].firstName} ${passengers[0].lastName}` : 'Unknown'),
      passengerEmail: (contactInfo?.email || passengerEmail || '').toLowerCase(),
      passengerPhone: contactInfo?.phoneNumber || passengerPhone || '',
      
      // Flight selection
      journeyId,
      segmentId,
      selectedFlight,
      traceId,
      
      // Status and priority
      status: 'pending',
      priority: priority || 'normal',
      source: source || 'website'
    };

    const inquiry = new FlightInquiry(inquiryData);
    const savedInquiry = await inquiry.save();

    res.status(201).json({
      success: true,
      message: 'Flight inquiry created successfully',
      data: {
        inquiryId: savedInquiry.inquiryId,
        id: savedInquiry._id,
        status: savedInquiry.status,
        createdAt: savedInquiry.createdAt
      },
    });
  } catch (error) {
    console.error('Create Inquiry Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create flight inquiry',
      message: error.message,
    });
  }
});

/**
 * GET /api/inquiries/:id
 * Get a specific inquiry
 */
router.get('/:id', async (req, res) => {
  try {
    const inquiry = await FlightInquiry.findById(req.params.id).populate('brokerAssigned', 'name email');

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        error: 'Inquiry not found',
      });
    }

    res.json({
      success: true,
      data: inquiry,
    });
  } catch (error) {
    console.error('Get Inquiry Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch inquiry',
      message: error.message,
    });
  }
});

/**
 * GET /api/inquiries (Admin only)
 * Get all inquiries with filtering
 */
router.get('/', authenticateAdmin, async (req, res) => {
  try {
    const { status, brokerAssigned, sortBy = '-createdAt', limit = 50, page = 1 } = req.query;

    const filter = { isActive: true };

    if (status) {
      filter.status = status;
    }

    if (brokerAssigned) {
      filter.brokerAssigned = brokerAssigned;
    }

    const skip = (page - 1) * limit;

    const inquiries = await FlightInquiry.find(filter)
      .populate('brokerAssigned', 'name email')
      .sort(sortBy)
      .limit(parseInt(limit))
      .skip(skip);

    const total = await FlightInquiry.countDocuments(filter);

    res.json({
      success: true,
      data: inquiries,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get Inquiries Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch inquiries',
      message: error.message,
    });
  }
});

/**
 * PUT /api/inquiries/:id (Admin only)
 * Update inquiry status and broker assignment
 */
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { status, brokerNotes, brokerAssigned } = req.body;

    const updateData = {};

    if (status && ['pending', 'confirmed', 'under-review', 'contacted', 'booked', 'cancelled', 'expired'].includes(status)) {
      updateData.status = status;
    }

    if (brokerNotes !== undefined) {
      updateData.brokerNotes = brokerNotes;
    }

    if (brokerAssigned !== undefined) {
      updateData.brokerAssigned = brokerAssigned || null;
    }

    const updatedInquiry = await FlightInquiry.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('brokerAssigned', 'name email');

    if (!updatedInquiry) {
      return res.status(404).json({
        success: false,
        error: 'Inquiry not found',
      });
    }

    res.json({
      success: true,
      message: 'Inquiry updated successfully',
      data: updatedInquiry,
    });
  } catch (error) {
    console.error('Update Inquiry Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update inquiry',
      message: error.message,
    });
  }
});

/**
 * GET /api/inquiries/:id/admin (Admin only)
 * Get detailed inquiry for admin dashboard page
 */
router.get('/:id/admin', authenticateAdmin, async (req, res) => {
  try {
    const inquiry = await FlightInquiry.findById(req.params.id)
      .populate('brokerAssigned', 'name email')
      .populate('communications.adminUser', 'name email');

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        error: 'Inquiry not found',
      });
    }

    res.json({
      success: true,
      data: inquiry,
    });
  } catch (error) {
    console.error('Get Detailed Inquiry Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch detailed inquiry',
      message: error.message,
    });
  }
});

/**
 * DELETE /api/inquiries/:id (Admin only)
 * Soft delete an inquiry
 */
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const updatedInquiry = await FlightInquiry.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!updatedInquiry) {
      return res.status(404).json({
        success: false,
        error: 'Inquiry not found',
      });
    }

    res.json({
      success: true,
      message: 'Inquiry deleted successfully',
    });
  } catch (error) {
    console.error('Delete Inquiry Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete inquiry',
      message: error.message,
    });
  }
});

export default router;
