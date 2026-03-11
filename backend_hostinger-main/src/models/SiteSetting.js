import mongoose from 'mongoose';

const siteSettingSchema = new mongoose.Schema(
  {
    singletonKey: { type: String, unique: true, default: 'main' },
    seo: {
      title: { type: String, default: 'Aviotixx - Cheap Flights to India' },
      description: { type: String, default: 'Book affordable flights to India with exclusive phone-only fares.' },
      keywords: { type: String, default: 'flights to india, cheap flights, aviotixx' },
    },
    contact: {
      phoneDisplay: { type: String, default: '1-800-123-4567' },
      phoneTel: { type: String, default: '+18001234567' },
      email: { type: String, default: 'support@aviotixx.com' },
      address: { type: String, default: 'New York, USA' },
    },
  },
  { timestamps: true }
);

export const SiteSetting = mongoose.model('SiteSetting', siteSettingSchema);
