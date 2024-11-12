import { pool } from "../../../../database/database";

export async function POST(req) {
    try {
        // Parse the request body
        let { waste, preferredDate, preferredTime, latitude, longitude, userId } = await req.json();

        // Validate the input data
        if (!waste || !preferredDate || !preferredTime || !latitude || !longitude || !userId) {
            return new Response(JSON.stringify({ error: "All fields are required" }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Check if a request already exists for the user
        const existingRequest = await pool.query(
            `SELECT request_id FROM request_for_waste WHERE user_id = $1`,
            [userId]
        );

        if (existingRequest.rowCount > 0) {
            return new Response(
                JSON.stringify({ message: "User already has an existing request", success: false }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        // Insert the data into the database
        const result = await pool.query(
            `INSERT INTO request_for_waste (user_id, weight, latitude, longitude, date, time) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING request_id`,
            [userId, waste, latitude, longitude, preferredDate, preferredTime]
        );

        // Respond with success and the created request ID
        return new Response(
            JSON.stringify({ message: "Request created successfully", requestId: result.rows[0].request_id, success: true }),
            {
                status: 201,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    } catch (error) {
        console.error("Error inserting data:", error);
        return new Response(JSON.stringify({ message: "Internal Server Error" }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
// GET request to fetch requests based on user_id
export async function GET(req) {
    try {
        const url = new URL(req.url);
        const userId = url.searchParams.get("userId");

        if (!userId) {
            return new Response(
                JSON.stringify({ error: "User ID is required" }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Query the database for all requests by the user
        const result = await pool.query(
            `SELECT request_id, user_id, weight, latitude, longitude, date, time, offered_price
             FROM request_for_waste WHERE user_id = $1`,
            [userId]
        );

        if (result.rowCount === 0) {
            return new Response(
                JSON.stringify({ message: "No requests found for this user" }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Respond with the user's requests
        return new Response(
            JSON.stringify({ requests: result.rows }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error("Error fetching requests:", error);
        return new Response(
            JSON.stringify({ message: "Internal Server Error" }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}