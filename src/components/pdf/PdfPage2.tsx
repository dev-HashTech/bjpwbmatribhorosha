import React from "react";

const BULLETS = [
  { img: "/assets/checkmark.svg", text: "৭৫ লক্ষ মহিলা হবেন লাভপ্রাপ্ত দিদি" },
  { img: "/assets/checkmark.svg", text: "সরকারি চাকরিতে মহিলাদের জন্য ৩৩% সংরক্ষণ নিশ্চিত" },
  { img: "/assets/checkmark.svg", text: "রাজ্যের সব সরকারি বাসে মহিলাদের যাতায়াত সম্পূর্ণ বিনামূল্যে" },
  { img: "/assets/checkmark.svg", text: "গর্ভবতী মহিলাদের জন্য ২১,০০০ টাকা ও ৬টি পুষ্টি কিট" },
  { img: "/assets/checkmark.svg", text: "বিধবা মহিলাদের আর্থিক সহায়তা দ্বিগুণ করা হবে" },
];

export default function PdfPage2() {
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

      {/* ── "পশ্চিমবঙ্গে বিজেপি | সরকার আসলেই" pills ── */}
      {/* Green pill (behind, right) */}
      <div style={{
        position: "absolute", left: 175.7, top: 23.62, height: 45.769,  width: "fit-content",
        background: "#01a650", borderRadius: 73.821,
        boxShadow: "0px 5.906px 0px 0px rgba(0,0,0,0.25)",
        overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 10,
      }}>
        <span style={{ fontFamily: "var(--font-noto-bengali), 'Noto Sans Bengali', sans-serif", fontSize: 23.623, fontWeight: 700, color: "#fff", letterSpacing: "-0.9449px", whiteSpace: "nowrap", paddingLeft: 80, paddingRight: 35, }}>
          সরকার আসলেই
        </span>
      </div>
      {/* White pill (front, left) */}
      <div style={{
        position: "absolute", left: 31, top: 23.62, width: 214.082, height: 45.769,
        background: "#fff", borderRadius: 73.821,
        boxShadow: "-4.429px 5.906px 0px 0px rgba(0,0,0,0.25)",
        overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 20,
      }}>
        <span style={{ fontFamily: "var(--font-noto-bengali), 'Noto Sans Bengali', sans-serif", fontSize: 23.623, fontWeight: 700, color: "#f66222", letterSpacing: "-0.9449px", whiteSpace: "nowrap" }}>
          পশ্চিমবঙ্গে বিজেপি
        </span>
      </div>

      {/* ── Bullet list ── */}
      {BULLETS.map((b, i) => (
        <div key={i} style={{ position: "absolute", left: 30, top: 90 + i * 62, display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div style={{ width: 25, height: 25, flexShrink: 0, marginTop: 2 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={b.img} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </div>
          <p style={{
            fontFamily: "var(--font-noto-bengali), 'Noto Sans Bengali', sans-serif",
            fontSize: 21,
            fontWeight: 800,
            color: "#fff",
            lineHeight: 1.15,
            margin: 0,
            maxWidth: 480,
          }}>
            {b.text}
          </p>
        </div>
      ))}

      {/* ── Left BJP circle + "বিজেপি" ── */}
      <div style={{ position: "absolute", left: 31, top: 422, width: 100, height: 117, overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/image10.png"
          alt=""
          style={{
            position: "absolute",
            width: (344.14 / 100) * 100,
            height: (369.74 / 100) * 117,
            left: 0,
            top: (-232.21 / 100) * 117,
            maxWidth: "none",
          }}
        />
      </div>
      <p style={{ ...S, left: 58.54, top: 492.24, fontSize: 14.914, fontWeight: 700, color: "#1d1c1c", letterSpacing: "-0.5965px" }}>
        বিজেপি
      </p>
      <div style={{ position: "absolute", left: 64.26, top: 450.44, width: 34.27, height: 36.47 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/group37312.svg" alt="" style={{ width: "100%", height: "100%", display: "block" }} />
      </div>

      {/* ── Woman photo (right) ── */}
      <div style={{ position: "absolute", left: 382, top: 396, width: 186, height: 149, overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/pdf/woman.png"
          alt=""
          style={{
            position: "absolute",
            width: (195.1 / 100) * 186,
            height: (105.84 / 100) * 149,
            left: (-95.1 / 100) * 186,
            top: 0,
            maxWidth: "none",
          }}
        />
      </div>

      {/* ── Green bar ── */}
      <div style={{ position: "absolute", left: 0, top: 545, width: 595, height: 4, background: "#00a750" }} />

      {/* ── Banner strip ── */}
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

      {/* ── Dashed cut line ── */}
      <div style={{
        position: "absolute", left: 0, top: 633, width: 595, height: 0,
        borderTop: "2px dashed #999",
      }} />

      {/* ── Bottom half (white, empty — for cutting) ── */}
    </div>
  );
}
