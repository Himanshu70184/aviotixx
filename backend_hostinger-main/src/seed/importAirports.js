
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Airport from '../models/Airport.js';
import { connectDatabase } from '../config/db.js';

dotenv.config();

async function importAirports() {
  await connectDatabase();
  
  // Download from CDN
  console.log('📡 Downloading airports data from CDN...');
  const response = await fetch('https://cdn.jsdelivr.net/npm/airports-json@1.0.0/data/airports.json');
  if (!response.ok) throw new Error('Failed to download airports data');
  const data = await response.json();
  
  console.log(`📊 Downloaded ${data.length} airports from CDN`);

  // Remove all existing airports to avoid duplicates
  await Airport.deleteMany({});

  // Filter and use CDN airports data as-is (no field mapping)
  const mapped = data
    .filter(a => a.iata_code && a.name && a.iata_code.length === 3); // Only valid 3-letter IATA codes

  await Airport.insertMany(mapped);
  console.log('✅ Airports imported:', mapped.length);
  mongoose.connection.close();
}

importAirports().catch(e => {
  console.error('❌ Import failed:', e);
  process.exit(1);
});
