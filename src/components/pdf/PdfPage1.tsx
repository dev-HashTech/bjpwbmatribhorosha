import React from "react";

export interface PdfSubmissionData {
  form_no: number;
  name: string;
  mobile: string;
  address: string;
  date: string;
}

// Replicates Figma's overflow-hidden + % crop
function Crop({
  src, containerStyle, wPct, hPct, lPct, tPct,
}: {
  src: string;
  containerStyle: React.CSSProperties;
  wPct: number; hPct: number; lPct: number; tPct: number;
}) {
  const cw = containerStyle.width as number;
  const ch = containerStyle.height as number;
  return (
    <div style={{ position: "absolute", overflow: "hidden", pointerEvents: "none", ...containerStyle }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        style={{
          position: "absolute",
          width: (wPct / 100) * cw,
          height: (hPct / 100) * ch,
          left: (lPct / 100) * cw,
          top: (tPct / 100) * ch,
          maxWidth: "none",
          display: "block",
        }}
      />
    </div>
  );
}

export default function PdfPage1({ data }: { data: PdfSubmissionData }) {
  const S: React.CSSProperties = {
    position: "absolute",
    fontFamily: "var(--font-noto-bengali), 'Noto Sans Bengali', sans-serif",
  };

  return (
    <div
      style={{
        position: "relative",
        width: 595,
        height: 841,
        overflow: "hidden",
        background: "#fff",
        fontFamily: "var(--font-noto-bengali), 'Noto Sans Bengali', sans-serif",
      }}
    >
      {/* ── Orange gradient background ── */}
      <div
        style={{
          position: "absolute",
          left: 0, top: 0, width: 595, height: 550,
          background: "linear-gradient(180deg, #f76223 0%, #f34f22 100%)",
        }}
      />

      {/* ── Top-right decoration ── */}
      <div style={{ position: "absolute", right: 0, top: 0, width: 143, height: 143, overflow: "hidden", pointerEvents: "none" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/image_71.png" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
      </div>

      {/* ── Glow ellipse ── */}
      <div
        style={{
          position: "absolute",
          left: "calc(40% - 173px)", top: 28,
          width: 346, height: 176,
          borderRadius: "50%",
          background: "radial-gradient(ellipse at center, #FFD54F 0%, #FFB300 40%, rgba(255,179,0,0) 70%)",
          filter: "blur(30px)",
          opacity: 0.85,
          pointerEvents: "none",
        }}
      />

      {/* ── Center women group (image3, top crop) ── */}
      <Crop
        src="/assets/image3.png"
        containerStyle={{ left: 187, top: 39, width: 221, height: 103 }}
        wPct={171.08} hPct={334.23} lPct={-18.9} tPct={0}
      />

      {/* ── Vector1 — ৬,০০০ ribbon ── */}
      <div style={{ position: "absolute", left: 173, top: 122, width: 270, height: 92 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/vector1-new.svg" alt="" style={{ width: "100%", height: "100%", display: "block" }} />
      </div>

      {/* ── Title ── */}
      <p style={{ ...S, left: 176, top: 122, fontSize: 28, fontWeight: 700, color: "#fff", whiteSpace: "nowrap" }}>
        মাতৃশক্তি ভরসা কার্ড
      </p>

      {/* ── Subtitle ── */}
      <p style={{ ...S, left: 265, top: 230, fontSize: 20, fontWeight: 700, color: "#fff", whiteSpace: "nowrap" }}>
        টাকার আর্থিক সহায়তা
      </p>

      {/* ── Green pill "প্রত্যেক মহিলাকে" (behind) ── */}
      <div style={{
        position: "absolute", left: 212.4, top: 264.61, height: 41.974, width: "fit-content",
        background: "#01a650", borderRadius: 58.297,
        boxShadow: "0px 4.664px 0px 0px rgba(0,0,0,0.25)",
        overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 10,
      }}>
        <span style={{ ...S, position: "relative", fontSize: 23.319, fontWeight: 700, color: "#fff", letterSpacing: "-0.9327px", whiteSpace: "nowrap", paddingLeft: 80, paddingRight: 30, }}>
          প্রত্যেক মহিলাকে
        </span>
      </div>

      {/* ── White pill "প্রতি মাসে" (front) ── */}
      <div style={{
        position: "absolute", left: 147.1, top: 264.61, height: 41.974, width: 127,
        background: "#fff", borderRadius: 58.297,
        boxShadow: "-3.498px 4.664px 0px 0px rgba(0,0,0,0.25)",
        overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 20,
      }}>
        <span style={{ ...S, position: "relative", fontSize: 23.319, fontWeight: 700, color: "#f66222", letterSpacing: "-0.9327px", whiteSpace: "nowrap", }}>
          প্রতি মাসে
        </span>
      </div>

      {/* ── group37319 (BJP + flag center) ── */}
      <div style={{ position: "absolute", left: 134, top: 150, width: 327, height: 100 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/group37319.svg" alt="" style={{ width: "100%", height: "100%", display: "block" }} />
      </div>

      {/* ── Modi right portrait ── */}
      <Crop
        src="/assets/image3.png"
        containerStyle={{ left: 256, top: 302, width: 286, height: 255 }}
        wPct={164.12} hPct={168.66} lPct={-64.12} tPct={-68.66}
      />

      {/* ── Left BJP group photo ── */}
      <Crop
        src="/assets/image10.png"
        containerStyle={{ left: 82, top: 364, width: 153, height: 178 }}
        wPct={344.14} hPct={369.74} lPct={0} tPct={-232.21}
      />

      {/* ── "বিজেপি" label ── */}
      <p style={{ ...S, left: 124, top: 471, fontSize: 23, fontWeight: 700, color: "#1d1c1c", letterSpacing: "-0.91px", whiteSpace: "nowrap" }}>
        বিজেপি
      </p>

      {/* ── group37312 (small BJP circle left) ── */}
      <div style={{ position: "absolute", left: 132, top: 407, width: 52, height: 56 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/group37312.svg" alt="" style={{ width: "100%", height: "100%", display: "block" }} />
      </div>

      {/* ── Green bar ── */}
      <div style={{ position: "absolute", left: 0, top: 545, width: 595, height: 4, background: "#00a750" }} />

      <div style={{
        position: "absolute", left: 0, top: 549, width: 595, height: 84,
        display: "flex", alignItems: "flex-end", gap: 15,
        paddingBottom: 23, boxSizing: "border-box", justifyContent: "space-evenly",
      }}>
        <p style={{
          fontFamily: "var(--font-noto-bengali), 'Noto Sans Bengali', sans-serif",
          fontSize: 23, fontWeight: 900, letterSpacing: "-1.33px",
          textTransform: "uppercase", whiteSpace: "nowrap", lineHeight: 1,
          margin: 0,
        }}>
          <span style={{ color: "#ef1923" }}>ভয় </span>
          <span style={{ color: "#000" }}>OUT </span>
          <span style={{ color: "#f9711c" }}>ভরসা </span>
          <span style={{ color: "#01a650" }}>IN</span>
        </p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/bjp-flag-btn2.svg" alt="" style={{ width: 104, height: 38, flexShrink: 0 }} />
        <p style={{
          fontFamily: "var(--font-noto-bengali), 'Noto Sans Bengali', sans-serif",
          fontSize: 23, fontWeight: 900, color: "#f57220", letterSpacing: "-1.33px",
          textTransform: "uppercase", whiteSpace: "nowrap", lineHeight: 1,
          margin: 0,
        }}>
          বিজেপিকে ভোট দিন
        </p>
      </div>

      {/* ── Peach section ── */}
      <div style={{ position: "absolute", left: 0, top: 634, width: 595, height: 207, background: "#fed3a0" }} />

      {/* ── Form fields ── */}
      {/* Row 1: ফর্ম সংখ্যা + তারিখ */}
      <p style={{ ...S, left: 30, top: 650, fontSize: 20, fontWeight: 600, color: "#231f1e", letterSpacing: "-0.21px" }}>ফর্ম সংখ্যা :</p>
      <p style={{ ...S, left: 132, top: 650, fontSize: 20, fontWeight: 700, color: "#f76223", letterSpacing: "-0.21px" }}>{data.form_no}</p>
      <div style={{ position: "absolute", left: 132, top: 673, width: 126, height: 0, borderBottom: "2px dashed #b0a090" }} />

      <p style={{ ...S, left: 284, top: 650, fontSize: 20, fontWeight: 600, color: "#231f1e", letterSpacing: "-0.21px" }}>তারিখ :</p>
      <p style={{ ...S, left: 349, top: 650, fontSize: 18, fontWeight: 600, color: "#231f1e" }}>{data.date}</p>
      <div style={{ position: "absolute", left: 349, top: 673, width: 213, height: 0, borderBottom: "2px dashed #b0a090" }} />

      {/* Row 2: নাম */}
      <p style={{ ...S, left: 30, top: 698, fontSize: 20, fontWeight: 600, color: "#231f1e", letterSpacing: "-0.21px" }}>নাম :</p>
      <p style={{ ...S, left: 95, top: 698, fontSize: 20, fontWeight: 600, color: "#231f1e" }}>{data.name}</p>
      <div style={{ position: "absolute", left: 95, top: 720, width: 468, height: 0, borderBottom: "2px dashed #b0a090" }} />

      {/* Row 3: মোবাইল নম্বর */}
      <p style={{ ...S, left: 30, top: 745, fontSize: 20, fontWeight: 600, color: "#231f1e", letterSpacing: "-0.21px" }}>মোবাইল নম্বর :</p>
      <p style={{ ...S, left: 156, top: 745, fontSize: 20, fontWeight: 600, color: "#231f1e" }}>{data.mobile}</p>
      <div style={{ position: "absolute", left: 156, top: 766, width: 407, height: 0, borderBottom: "2px dashed #b0a090" }} />

      {/* Row 4: ঠিকানা */}
      <p style={{ ...S, left: 30, top: 793, fontSize: 20, fontWeight: 600, color: "#231f1e", letterSpacing: "-0.21px" }}>ঠিকানা :</p>
      <p style={{ ...S, left: 105, top: 793, fontSize: 20, fontWeight: 600, color: "#231f1e" }}>{data.address || ""}</p>
      <div style={{ position: "absolute", left: 105, top: 815, width: 457, height: 0, borderBottom: "2px dashed #b0a090" }} />
    </div>
  );
}
