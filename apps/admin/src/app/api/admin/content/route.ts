import { readContent, saveContent } from "@/lib/content-store";
import { apiError } from "@/lib/api-response";
import { ApiError, requireAdmin } from "@/lib/firebase-server";
import { MAX_CONTENT_BYTES, parseContent } from "@content/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "no-store" };

export async function GET(request: Request) {
  try {
    await requireAdmin(request);
    return Response.json(await readContent(), { headers });
  } catch (error) {
    return apiError(error);
  }
}

export async function PUT(request: Request) {
  try {
    const uid = await requireAdmin(request);
    if (!request.headers.get("content-type")?.startsWith("application/json")) {
      throw new ApiError(415, "Invia contenuti in formato JSON.");
    }
    // Bound streamed input as well as Content-Length, which can be absent or forged.
    const reader = request.body?.getReader();
    if (!reader) throw new ApiError(400, "Contenuti mancanti.");
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_CONTENT_BYTES + 1024) {
        await reader.cancel();
        throw new ApiError(413, "I contenuti sono troppo grandi.");
      }
      chunks.push(value);
    }
    let payload;
    try {
      payload = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    } catch {
      throw new ApiError(400, "Formato dei contenuti non valido.");
    }
    if (
      !payload ||
      !Number.isSafeInteger(payload.revision) ||
      payload.revision < 0
    ) {
      throw new ApiError(400, "Revisione dei contenuti non valida.");
    }
    const content = parseContent(payload.content);
    return Response.json(await saveContent(content, payload.revision, uid), {
      headers,
    });
  } catch (error) {
    return apiError(error);
  }
}
