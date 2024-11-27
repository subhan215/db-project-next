import { pool } from "../../../../database/database";

export async function GET(req) {
  try {
    // Basic query to fetch reward conversion data
    let query = 'SELECT * FROM RewardConversions rC join "User" u on u.user_id = rC.user_id  ORDER BY created_at DESC where status!= $1 and status!= $2';
    const result = await pool.query(query , ['Approved' , 'Rejected']);

    // Return the response with the fetched data
    return new Response(JSON.stringify({
      success: true,
      data: result.rows,
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (err) {
    console.error('Error fetching reward conversion requests:', err);

    // Return an error response
    return new Response(JSON.stringify({
      success: false,
      message: 'Failed to fetch reward conversion requests',
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}