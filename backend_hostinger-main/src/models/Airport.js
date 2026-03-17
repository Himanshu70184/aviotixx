import mongoose from 'mongoose';

const AirportSchema = new mongoose.Schema({
  iata_code: { type: String, required: true },
  name: { type: String, required: true },
  municipality: { type: String },
  iso_country: { type: String },
  keywords: { type: String },
  type: { type: String },
  scheduled_service: { type: String },
  continent: { type: String },
  latitude_deg: { type: Number },
  longitude_deg: { type: Number },
  ident: { type: String },
  elevation_ft: { type: Number },
  iso_region: { type: String },
  gps_code: { type: String },
  local_code: { type: String },
  home_link: { type: String },
  wikipedia_link: { type: String }
}, { collection: 'airports' });

export default mongoose.models.Airport || mongoose.model('Airport', AirportSchema);