import { NextRequest, NextResponse } from "next/server";
import { validateForm } from "@/lib/validations/formSchema";
import { pool } from "@/lib/db/postgres";

// ── Simple in-memory rate limiter (per IP, resets on cold start) ──────────
const rateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const WINDOW_MS = 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_LIMIT) return true;
  entry.count += 1;
  return false;
}

function getClientIp(req: NextRequest): string | null {
  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = req.headers.get("x-real-ip")?.trim();
  const directIp = (req as NextRequest & { ip?: string | null }).ip?.trim();
  return forwarded || realIp || directIp || null;
}

// ── POST /api/submit ──────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    if (ip && isRateLimited(ip)) {
      return NextResponse.json(
        { error: "অনেক বার চেষ্টা হয়েছে। একটু পরে আবার করুন।" },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { name, mobile, address, form_no } = body as Record<string, unknown>;

    const formData = {
      name: String(name ?? "").trim(),
      mobile: String(mobile ?? "").trim(),
      address: address != null ? String(address).trim() : "",
    };

    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ error: "Validation failed", errors }, { status: 422 });
    }

    const parsedFormNo = Number(form_no);
    if (!Number.isInteger(parsedFormNo) || parsedFormNo < 20261) {
      return NextResponse.json({ error: "Invalid form number" }, { status: 400 });
    }

    const { rows } = await pool.query<{ form_no: number }>(
      `INSERT INTO submissions (form_no, name, mobile, address)
       VALUES ($1, $2, $3, $4)
       RETURNING form_no`,
      [parsedFormNo, formData.name, formData.mobile, formData.address || null]
    );

    return NextResponse.json({ success: true, form_no: rows[0].form_no }, { status: 200 });
  } catch (err: unknown) {
    console.error("[SUBMIT_ERROR]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
