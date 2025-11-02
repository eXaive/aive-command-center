import type { NextApiRequest, NextApiResponse } from "next";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const method = req.method || "POST";
    let asset = "GOLD";
    let influences: any[] = [];
    if (method === "POST") {
      const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
      asset = String(body.asset || "GOLD").toUpperCase();
      influences = Array.isArray(body.influences) ? body.influences : [];
    } else {
      asset = String(req.query.asset || "GOLD").toUpperCase();
      influences = [];
    }

    const pdf = await PDFDocument.create();
    const page = pdf.addPage([612, 792]); // US Letter portrait
    const { width, height } = page.getSize();
    const margin = 48;

    const titleFont = await pdf.embedFont(StandardFonts.HelveticaBold);
    const bodyFont = await pdf.embedFont(StandardFonts.Helvetica);

    // Title
    page.drawText(`Influence Brief — ${asset}`, {
      x: margin,
      y: height - margin - 12,
      size: 20,
      font: titleFont,
      color: rgb(0.12, 0.14, 0.18),
    });

    // Logo (PNG best for pdf-lib)
    try {
      const logoPath = path.join(process.cwd(), "public", "crowned_x.png");
      if (fs.existsSync(logoPath)) {
        const pngBytes = fs.readFileSync(logoPath);
        const png = await pdf.embedPng(pngBytes);
        const w = 92, h = 92;
        page.drawImage(png, { x: width - margin - w, y: height - margin - h, width: w, height: h });
      }
    } catch {}

    // Body
    let y = height - margin - 130;
    page.drawText("Top Influences", { x: margin, y, size: 12, font: titleFont, color: rgb(0.12,0.14,0.18) });
    y -= 18;

    const list = (influences || []).slice(0, 14);
    if (!list.length) {
      page.drawText("• No influences passed from client — run from Focus view for details.", {
        x: margin, y, size: 11, font: bodyFont, color: rgb(0.25,0.27,0.3),
      });
    } else {
      for (const it of list) {
        const line = `• ${it.label ?? it.id}: polarity ${(it.polarity ?? 0).toFixed(2)}, strength ${(it.strength ?? 0).toFixed(2)} [${it.group ?? "-"}]`;
        page.drawText(line, { x: margin, y, size: 11, font: bodyFont, color: rgb(0.2,0.22,0.26) });
        y -= 16;
        if (y < margin + 40) break;
      }
    }

    const bytes = await pdf.save();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${asset}_influence_brief.pdf"`);
    res.status(200).send(Buffer.from(bytes));
  } catch (e) {
    res.status(500).json({ error: "PDF generation failed" });
  }
}
