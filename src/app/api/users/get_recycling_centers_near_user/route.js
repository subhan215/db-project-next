import { NextResponse } from 'next/server';
import {pool} from "../../../../database/database"

const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return distance;
};

export async function GET(req) {
  try {
    // Get user coordinates from query parameters
    const { searchParams } = new URL(req.url);
    const latitude = searchParams.get('latitude');
    const longitude = searchParams.get('longitude');

    if (!latitude || !longitude) {
      return NextResponse.json(
        { message: 'Latitude and Longitude are required' },
        { status: 400 }
      );
    }

    // Query to fetch recycling centers
    const { rows } = await pool.query(`
      SELECT
        recycling_center_id,
        company_id,
        area_id,
        latitude,
        longitude
      FROM
        recycling_center;
    `);

    // Calculate the distance to each recycling center
    const recyclingCenters = rows.map((center) => {
      const distance = getDistance(
        parseFloat(latitude),
        parseFloat(longitude),
        parseFloat(center.latitude),
        parseFloat(center.longitude)
      );
      return { ...center, distance };
    });

    // Sort recycling centers by distance
    recyclingCenters.sort((a, b) => a.distance - b.distance);

    // Return the sorted list of recycling centers
    return NextResponse.json(recyclingCenters);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Error fetching recycling centers' },
      { status: 500 }
    );
  }
}
