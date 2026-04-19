"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import PdfPage1 from "@/components/pdf/PdfPage1";
import PdfPage2 from "@/components/pdf/PdfPage2";
import { generatePdf } from "@/lib/generatePdf";

export interface SuccessData {
  form_no: number;
  name: string;
  mobile: string;
  address: string;
  date: string;
}

export default function SuccessScreen({ data }: { data: SuccessData }) {
  const [pdfState, setPdfState] = useState<"pending" | "generating" | "done" | "error">("pending");
  const page1Ref = useRef<HTMLDivElement>(null);
  const page2Ref = useRef<HTMLDivElement>(null);

  const runGenerate = async () => {
    setPdfState("generating");
    try {
      if (!page1Ref.current || !page2Ref.current) throw new Error("PDF pages not mounted");
      await generatePdf(
        page1Ref.current,
        page2Ref.current,
        `matrishakti-bharosa-card-${data.form_no}.pdf`
      );
      setPdfState("done");
    } catch (err) {
      console.error("PDF generation failed:", err);
      setPdfState("error");
    }
  };

  useEffect(() => {
    const timer = setTimeout(runGenerate, 150);
    return () => clearTimeout(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="relative flex min-h-screen w-full max-w-[402px] flex-col mx-auto overflow-x-hidden shadow-[0_10px_30px_rgba(0,0,0,0.12)]" style={{ background: "#ffe1ca" }}>

      {/* BJP lotus watermarks */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/Group_37312.svg" alt="" aria-hidden="true" className="absolute pointer-events-none select-none" style={{ top: "12.11%", left: "8.51%", right: "58.31%", bottom: "72.84%" }} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/Group_37313.svg" alt="" aria-hidden="true" className="absolute pointer-events-none select-none" style={{ top: "23.89%", left: "69.4%", right: "5.77%", bottom: "64.84%" }} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/Group_37314.svg" alt="" aria-hidden="true" className="absolute pointer-events-none select-none" style={{ top: "62.21%", left: "9.7%", right: "59.45%", bottom: "23.79%" }} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/Group_37315.svg" alt="" aria-hidden="true" className="absolute pointer-events-none select-none" style={{ top: "67.21%", left: "60.7%", right: "10.95%", bottom: "24.92%" }} />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center text-center px-6 py-12">
        <div className="relative mb-6 flex items-center justify-center">
          <Image
            src="/assets/success-logo-new.svg"
            alt="BJP logo"
            width={137}
            height={137}
            priority
            className="block"
          />
        </div>

        <h1 className="text-[#374151] font-semibold text-[24px] leading-[31px] font-noto-bengali mb-3 tracking-[-0.24px] max-w-[332px]">
          অভিনন্দন, আপনার মাতৃশক্তি ভরসা কার্ড তৈরি।
        </h1>

        <p className="text-[#374151] text-[16px] font-noto-bengali max-w-[332px] mb-2 tracking-[-0.16px]">
          পাল্টানো দরকার, চাই বিজেপি সরকার
        </p>

        <p className="text-[#f76223] text-[13px] font-semibold font-inter mb-6">
          Form No: {data.form_no}
        </p>

        {pdfState === "pending" || pdfState === "generating" ? (
          <div className="flex items-center gap-2 text-[#6b4c2a] text-[13px] font-noto-bengali">
            <div className="h-5 w-5 rounded-full border-2 border-[#f76223] border-t-transparent animate-spin" />
            {pdfState === "pending" ? "কার্ড প্রস্তুত হচ্ছে…" : "কার্ড তৈরি হচ্ছে…"}
          </div>
        ) : pdfState === "done" ? (
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 text-[#01a650] text-[14px] font-noto-bengali font-semibold">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="9" fill="#01a650" />
                <path d="M5 9l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              কার্ড ডাউনলোড হয়েছে
            </div>
            <button
              onClick={runGenerate}
              className="text-[12px] text-[#f76223] underline font-inter"
            >
              আবার ডাউনলোড করুন
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <p className="text-red-500 text-[13px] font-noto-bengali">কার্ড তৈরিতে সমস্যা হয়েছে।</p>
            <button
              onClick={runGenerate}
              className="rounded-[40px] bg-[#f76223] px-6 py-2 text-white text-[14px] font-semibold font-noto-bengali"
            >
              আবার চেষ্টা করুন
            </button>
          </div>
        )}
      </div>

      {/* Off-screen PDF source — same markup as /pdf-preview */}
      <div style={{ position: "fixed", left: -10000, top: 0, pointerEvents: "none", opacity: 0 }} aria-hidden="true">
        <div ref={page1Ref}><PdfPage1 data={data} /></div>
        <div ref={page2Ref}><PdfPage2 /></div>
      </div>
    </div>
  );
}
