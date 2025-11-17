import pdf from "pdf-parse";

export const runtime = "nodejs"; // force Node environment

export async function POST(req: Request) {
  try {
    const arrayBuffer = await req.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const data = await pdf(buffer);
    return Response.json({ text: data.text });
  } catch (err) {
    console.error("PDF parse error:", err);
    return Response.json({ error: "Failed to parse PDF" }, { status: 500 });
  }
}
