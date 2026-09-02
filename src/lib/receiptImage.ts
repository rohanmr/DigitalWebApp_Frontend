import html2canvas from "html2canvas-pro";

export async function captureReceiptAsBlob(
  elementId = "receipt-print-area",
): Promise<Blob | null> {
  const node = document.getElementById(elementId);
  if (!node) return null;

  const canvas = await html2canvas(node, {
    scale: 2,
    backgroundColor: "#ffffff",
    useCORS: true,
  });

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/png", 1);
  });
}
