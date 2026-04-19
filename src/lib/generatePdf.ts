export async function generatePdf(
  page1El: HTMLElement,
  page2El: HTMLElement,
  filename = "matrishakti-bharosa-card.pdf"
) {
  if (!page1El || !page2El) return;

  const fontsReady = document.fonts?.ready ?? Promise.resolve();
  const [{ domToJpeg }, { default: jsPDF }] = await Promise.all([
    import("modern-screenshot"),
    import("jspdf"),
    Promise.race([fontsReady, new Promise((r) => setTimeout(r, 2000))]),
  ]);

  const opts = {
    scale: 2,
    quality: 0.93,
    backgroundColor: "#ffffff",
  };

  const [img1, img2] = await Promise.all([
    domToJpeg(page1El, opts),
    domToJpeg(page2El, opts),
  ]);

  const pdf = new jsPDF({ unit: "pt", format: "a4", orientation: "portrait" });
  const W = pdf.internal.pageSize.getWidth();
  const H = pdf.internal.pageSize.getHeight();

  pdf.addImage(img1, "JPEG", 0, 0, W, H);
  pdf.addPage();
  pdf.addImage(img2, "JPEG", 0, 0, W, H);
  pdf.save(filename.endsWith(".pdf") ? filename : `${filename}.pdf`);
}
