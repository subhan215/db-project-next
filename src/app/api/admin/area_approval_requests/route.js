import { pool } from "../../../../database/database";
// API endpoint to approve area requests
export async function POST(req) {

  const { areaApprovalId } = await req.json();

  if (!areaApprovalId) {
    return new Response(JSON.stringify({ success: false, message: 'Area approval ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Begin transaction
    await pool.query('BEGIN');

    // Retrieve the request_for_area_approval record
    const requestQuery = `SELECT area_id, company_id FROM request_for_area_approval WHERE area_approval_id = $1`;
    const { rows } = await pool.query(requestQuery, [areaApprovalId]);

    if (rows.length === 0) {
      await pool.query('ROLLBACK');
      return new Response(JSON.stringify({ success: false, message: 'Area approval request not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { area_id, company_id } = rows[0];

    // Delete the request_for_area_approval record
    const deleteQuery = `DELETE FROM request_for_area_approval WHERE area_approval_id = $1`;
    await pool.query(deleteQuery, [areaApprovalId]);

    // Assign the company_id to the area
    const assignCompanyQuery = `UPDATE area SET company_id = $1 WHERE area_id = $2`;
    await pool.query(assignCompanyQuery, [company_id, area_id]);

    // Commit transaction
    await pool.query('COMMIT');

    return new Response(JSON.stringify({ success: true, message: 'Area approved and company assigned successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    // Rollback transaction in case of error
    await pool.query('ROLLBACK');
    console.error('Error approving area:', error);
    return new Response(JSON.stringify({ success: false, message: 'An error occurred while processing the request' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}