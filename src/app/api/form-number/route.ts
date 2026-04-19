import { NextResponse } from "next/server";
import { pool } from "@/lib/db/postgres";

// GET /api/form-number — reserves and returns the next form number
export async function GET() {
  try {
    const { rows } = await pool.query<{ form_no: string }>(
      "SELECT nextval('form_no_seq') AS form_no"
    );
    return NextResponse.json({ form_no: Number(rows[0].form_no) }, { status: 200 });
  } catch (err) {
    console.error("[FORM_NUMBER_ERROR]", err);
    return NextResponse.json({ error: "Could not generate form number" }, { status: 500 });
  }
}

export function POST() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
