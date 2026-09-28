import { readContent } from "@/lib/content-store";
import { apiError } from "@/lib/api-response";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Only already-published content is public; no credentials or draft data.
const headers = {
  "Access-Control-Allow-Origin": "*",
  "Cache-Control": "no-store",
};

export async function GET() {
  try {
    return Response.json(await readContent(), { headers });
  } catch (error) {
    return apiError(error, headers);
  }
}
