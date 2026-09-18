import { jsPDF } from "jspdf";
import html2canvas from "html2canvas-pro";

/**
 * يحوّل عناصر التقرير المخفية إلى ملف PDF بمقاس A4 أفقي.
 * كل عنصر يحمل data-pdf-block يُلتقط كوحدة واحدة حتى لا تُقص الصفوف أو الرسم،
 * وتُضاف صفحة جديدة عند عدم كفاية المساحة المتبقية.
 */
export async function exportPerformanceReportPdf(root: HTMLElement, fileName: string) {
  const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const pageW = 297;
  const pageH = 210;
  const margin = 12;
  const contentW = pageW - margin * 2;
  const maxY = pageH - margin - 6;

  const blocks = Array.from(root.querySelectorAll<HTMLElement>("[data-pdf-block]"));
  let y = margin;
  let firstOnPage = true;

  for (const block of blocks) {
    const canvas = await html2canvas(block, { scale: 2, backgroundColor: "#ffffff", useCORS: true });
    if (!canvas.width || !canvas.height) continue;
    let height = (contentW * canvas.height) / canvas.width;
    const available = maxY - margin;
    if (height > available) height = available;

    if (!firstOnPage && y + height > maxY) {
      pdf.addPage();
      y = margin;
      firstOnPage = true;
    }

    pdf.addImage(canvas.toDataURL("image/jpeg", 0.95), "JPEG", margin, y, contentW, height);
    y += height + 4;
    firstOnPage = false;
  }

  const pages = pdf.getNumberOfPages();
  for (let page = 1; page <= pages; page++) {
    pdf.setPage(page);
    pdf.setFontSize(9);
    pdf.setTextColor(130);
    pdf.text(`${page} / ${pages}`, pageW / 2, pageH - 6, { align: "center" });
  }

  pdf.save(fileName);
}
