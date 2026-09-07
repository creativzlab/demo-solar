import { leadSchema } from "@/lib/lead-schema";
import { acceptDemoLead, isRateLimited, requestFingerprint } from "@/lib/lead-service";

export const runtime = "nodejs";

function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!origin || !host) return true;

  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
export async function POST(request: Request) {
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > 12_000) return Response.json({ ok: false, message: "Dados acima do limite." }, { status: 413 });
  if (!isSameOrigin(request)) return Response.json({ ok: false, message: "Origem não permitida." }, { status: 403 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, message: "Dados inválidos." }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ ok: false, message: "Revise os campos destacados." }, { status: 422 });
  }

  if (parsed.data.website || Date.now() - parsed.data.startedAt < 2_000) {
    return Response.json({ ok: true, demoMode: true });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const userAgent = request.headers.get("user-agent") ?? "unknown";
  const fingerprint = requestFingerprint(ip, userAgent, parsed.data.phone);

  if (isRateLimited(fingerprint)) {
    return Response.json({ ok: false, message: "Este orçamento já foi enviado. Aguarde alguns minutos." }, { status: 429 });
  }

  try {
    const result = await acceptDemoLead();
    return Response.json({ ok: true, demoMode: result.demoMode });
  } catch (caught) {
    console.error(
      "[demo-solar:lead-submit]",
      caught instanceof Error ? caught.message : "Unexpected lead submission error",
    );
    return Response.json(
      { ok: false, message: "Não foi possível enviar agora. Tente novamente em instantes." },
      { status: 502 },
    );
  }
}
