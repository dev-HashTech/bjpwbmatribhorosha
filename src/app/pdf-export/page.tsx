"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import PdfPage1 from "@/components/pdf/PdfPage1";
import PdfPage2 from "@/components/pdf/PdfPage2";
import { Suspense } from "react";

function PdfExportContent() {
  const params = useSearchParams();
  const page1Ref = useRef<HTMLDivElement>(null);
  const page2Ref = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"generating" | "done" | "error">("generating");
  const [errorMsg, setErrorMsg] = useState("");

  const data = {
    form_no: Number(params.get("form_no") ?? 0),
    name: params.get("name") ?? "",
    mobile: params.get("mobile") ?? "",
    address: params.get("address") ?? "",
    date: params.get("date") ?? "",
  };

  useEffect(() => {
    const run = async () => {
      try {
        if (!page1Ref.current || !page2Ref.current) {
          throw new Error("Page elements not found");
        }

        await document.fonts.ready;
        // Give images time to fully paint
        await new Promise(r => setTimeout(r, 1500));

        const { default: html2canvas } = await import("html2canvas");
        const { default: jsPDF } = await import("jspdf");

        const opts = {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: false,
          backgroundColor: "#ffffff",
          imageTimeout: 15000,
        };

        const [c1, c2] = await Promise.all([
          html2canvas(page1Ref.current!, opts),
          html2canvas(page2Ref.current!, opts),
        ]);

        const pdf = new jsPDF({ unit: "pt", format: "a4", orientation: "portrait" });
        const W = pdf.internal.pageSize.getWidth();
        const H = pdf.internal.pageSize.getHeight();

        pdf.addImage(c1.toDataURL("image/jpeg", 0.95), "JPEG", 0, 0, W, H);
        pdf.addPage();
        pdf.addImage(c2.toDataURL("image/jpeg", 0.95), "JPEG", 0, 0, W, H);
        pdf.save(`matrishakti-bharosa-card-${data.form_no}.pdf`);

        setStatus("done");

        // Notify opener and close after a short delay so download can start
        await new Promise(r => setTimeout(r, 2000));
        if (window.opener) {
          window.opener.postMessage("pdf-done", "*");
        }
        window.close();
      } catch (err) {
        console.error("PDF generation failed:", err);
        setErrorMsg(err instanceof Error ? err.message : String(err));
        setStatus("error");
      }
    };

    run();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ background: "#f5f5f5", minHeight: "100vh" }}>
      {/* Status bar */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 999,
        background: status === "done" ? "#01a650" : status === "error" ? "#e53e3e" : "#f76223",
        color: "#fff", fontFamily: "sans-serif", fontSize: 16,
        padding: "14px 20px", textAlign: "center",
      }}>
        {status === "generating" && "⏳ PDF তৈরি হচ্ছে… এই উইন্ডো স্বয়ংক্রিয়ভাবে বন্ধ হবে।"}
        {status === "done" && "✅ PDF ডাউনলোড সম্পন্ন! উইন্ডো বন্ধ হচ্ছে…"}
        {status === "error" && `❌ PDF তৈরিতে সমস্যা: ${errorMsg}`}
      </div>

      <div style={{ paddingTop: 60, paddingBottom: 40, display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
        <div ref={page1Ref} style={{ display: "inline-block" }}>
          <PdfPage1 data={data} />
        </div>
        <div ref={page2Ref} style={{ display: "inline-block" }}>
          <PdfPage2 />
        </div>
      </div>
    </div>
  );
}

export default function PdfExportPage() {
  return (
    <Suspense fallback={<p style={{ fontFamily: "sans-serif", padding: 20 }}>Loading…</p>}>
      <PdfExportContent />
    </Suspense>
  );
}
