"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { validateForm, type FormData, type FormErrors } from "@/lib/validations/formSchema";
import SuccessScreen, { type SuccessData } from "./SuccessScreen";

// ─── Analytics (Google Analytics 4 via gtag) ────────────────────────────────
interface WindowWithGtag extends Window {
  gtag?: (...args: unknown[]) => void;
}
const GA_EVENT_PREFIX = "wb_mgc_";
function captureEvent(event: string, props?: Record<string, unknown>) {
  try {
    if (typeof window !== "undefined" && (window as WindowWithGtag).gtag) {
      (window as WindowWithGtag).gtag!("event", `${GA_EVENT_PREFIX}${event}`, props ?? {});
    }
  } catch { /* analytics must never break the form */ }
}

// ─── Benefits ───────────────────────────────────────────────────────────────
const BENEFITS = [
  "৭৫ লক্ষ মহিলা হবেন লাভপ্রাপ্ত দিদি",
  "সরকারি চাকরিতে মহিলাদের জন্য ৩৩% সংরক্ষণ নিশ্চিত",
  "রাজ্যের সব সরকারি বাসে মহিলাদের যাতায়াত সম্পূর্ণ বিনামূল্যে",
  "গর্ভবতী মহিলাদের জন্য ২১,০০০ টাকা ও ৬টি পুষ্টি কিট",
  "বিধবা মহিলাদের আর্থিক সহায়তা দ্বিগুণ করা হবে",
];

// ─── Figma image-crop helper ─────────────────────────────────────────────────
// Replicates Figma's overflow-hidden + % positioning pattern
type CropProps = {
  src: string; alt?: string;
  containerStyle: React.CSSProperties;
  imgWidthPct: number; imgHeightPct: number;
  imgLeftPct: number; imgTopPct: number;
  containerW: number; containerH: number;
  clipStyle?: React.CSSProperties;
};
function FigmaCrop({ src, alt = "", containerStyle, imgWidthPct, imgHeightPct, imgLeftPct, imgTopPct, containerW, containerH, clipStyle = {}, }: CropProps) {
  const imgW = (imgWidthPct / 100) * containerW;
  const imgH = (imgHeightPct / 100) * containerH;
  const imgL = (imgLeftPct / 100) * containerW;
  const imgT = (imgTopPct / 100) * containerH;
  return (
    <div style={{ position: "absolute", overflow: "hidden", pointerEvents: "none", ...clipStyle ,...containerStyle }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src} alt={alt}
        style={{ position: "absolute", width: imgW, height: imgH, left: imgL, top: imgT, maxWidth: "none", display: "block" }}
      />
    </div>
  );
}

export default function FormCard() {
  const [form, setForm] = useState<FormData>({ name: "", mobile: "", address: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<SuccessData | null>(null);
  const [formNo, setFormNo] = useState<number | null>(null);
  const [formNoReady, setFormNoReady] = useState(false);
  const tracked = useRef<Record<string, boolean>>({});
  const fetchStarted = useRef(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const formTopRef = useRef<HTMLDivElement>(null);
  const [headerScale, setHeaderScale] = useState(1);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const obs = new ResizeObserver(([entry]) => {
      setHeaderScale(Math.min(1, entry.contentRect.width / 402));
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Fetch form number once — ref guard prevents React StrictMode double-invoke
  // from calling nextval twice and wasting a sequence number
  useEffect(() => {
    if (fetchStarted.current) return;
    fetchStarted.current = true;
    fetch("/api/form-number")
      .then((r) => r.json())
      .then((d: { form_no?: number }) => {
        if (d.form_no) setFormNo(d.form_no);
      })
      .catch(() => {})
      .finally(() => setFormNoReady(true));
  }, []);

  const handleChange = useCallback(
    (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
      setSubmitError(null);
    }, []
  );

  const handleBlur = useCallback(
    (field: keyof FormData) => (e: React.FocusEvent<HTMLInputElement>) => {
      const val = e.target.value.trim();
      if (!val || tracked.current[field]) return;
      tracked.current[field] = true;
      if (field === "name") captureEvent("name_filled", { name: val });
      if (field === "mobile") captureEvent("number_filled");
      if (field === "address") captureEvent("address_filled");
    }, []
  );

  const scrollToForm = useCallback(() => {
    formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleSubmit = useCallback(async (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    captureEvent("submit_clicked");
    setSubmitError(null);
    const errs = validateForm(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setSubmitError("অনুগ্রহ করে সব তথ্য ঠিকভাবে পূরণ করুন।");
      scrollToForm();
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, form_no: formNo }),
      });
      const data = await res.json().catch(() => ({})) as {
        error?: string;
        errors?: FormErrors;
      };

      if (!res.ok) {
        if (data.errors) {
          setErrors(data.errors);
        }
        setSubmitError(data.error ?? "সমস্যা হয়েছে, আবার চেষ্টা করুন।");
        captureEvent("submit_error", {
          status: res.status,
          message: data.error ?? "failed",
        });
        scrollToForm();
        return;
      }

      captureEvent("form_submitted");
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, "0");
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const yyyy = today.getFullYear();
      setSubmitted({
        form_no: formNo!,
        name: form.name,
        mobile: form.mobile,
        address: form.address,
        date: `${dd}/${mm}/${yyyy}`,
      });
    } catch (err) {
      captureEvent("submit_error", { message: String(err) });
      setSubmitError("নেটওয়ার্ক সমস্যার জন্য জমা নেওয়া যায়নি। আবার চেষ্টা করুন।");
      scrollToForm();
    } finally { setSubmitting(false); }
  }, [form, formNo, scrollToForm]);

  if (submitted) return <SuccessScreen data={submitted} />;

  // Block render until form number is ready — shows header + spinner
  if (!formNoReady) {
    return (
      <div
        ref={cardRef}
        className="relative flex min-h-screen w-full max-w-[402px] flex-col mx-auto bg-white overflow-x-hidden shadow-[0_10px_30px_rgba(0,0,0,0.12)]"
      >
        {/* Header (same as main render so layout doesn't jump) */}
        <div className="relative w-full overflow-hidden" style={{ height: 194 * headerScale }}>
          <div style={{ width: 402, height: 194, transformOrigin: "top left", transform: `scale(${headerScale})` }}>
            <div className="absolute inset-0 bg-gradient-to-b from-[#f76223] to-[#f34f22]" />
          </div>
        </div>
        <div className="w-full bg-[#00a750]" style={{ height: 3 }} />
        <div className="flex flex-1 items-center justify-center bg-[#fed3a0] py-16">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 rounded-full border-4 border-[#f76223] border-t-transparent animate-spin" />
            <span className="text-[13px] font-noto-bengali text-[#6b4c2a]">অপেক্ষা করুন…</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={cardRef}
      className="relative flex min-h-screen w-full max-w-[402px] flex-col mx-auto bg-white overflow-x-hidden shadow-[0_10px_30px_rgba(0,0,0,0.12)]"
    >
      <form id="outreach-form" className="flex-1 pb-[112px]" onSubmit={handleSubmit}>

      {/* ══════════════════════════════════════════════════════
          HEADER — pixel-perfect Figma translation (402×194px)
      ══════════════════════════════════════════════════════ */}
      <div className="relative w-full overflow-hidden" style={{ height: 194 * headerScale }}>
        <div style={{ width: 402, height: 194, transformOrigin: "top left", transform: `scale(${headerScale})` }}>

        {/* Orange gradient background (h=300 intentional — fills header) */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#f76223] to-[#f34f22]" />


        {/* Glow ellipse (centred, two layers) */}
        <div
        style={{
          position: "absolute",
           left: "calc(40% - 117px)", 
           top: 53,                   
           width: 280,               
           height: 119,               
           pointerEvents: "none",
           borderRadius: "50%",
           background:
           "radial-gradient(ellipse at center, #FFD54F 0%, #FFB300 40%, rgba(255,179,0,0) 70%)",
           filter: "blur(25px)",
           opacity: 0.9,
           }}
           />
    

        {/* image71 — top-right flag/decoration (left=322 top=-1 w=80 h=75) */}
        <div style={{ position: "absolute", right: 0, top: 0, width: 80, height: 75 , overflow: "hidden", pointerEvents: "none", opacity: 1 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/image_71.png" alt="" aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
        </div>

        {/* image3 — right side portrait (left=269 top=74 w=143 h=128) */}
        <FigmaCrop
          src="/assets/image3.png"
          containerStyle={{ left: 269, top: 74, width: 143, height: 128 }}
          containerW={143} containerH={128}
          imgWidthPct={164.12} imgHeightPct={168.66} imgLeftPct={-64.12} imgTopPct={-68.66}
        />

        {/* image3 — centre top crop (women group) w=125 h=58 */}
        <FigmaCrop
          src="/assets/image3.png"
          containerStyle={{ left: "calc(34% - 16.06px)", top: 30, width: 125, height: 58 }}
          containerW={125} containerH={58}
          imgWidthPct={171.08} imgHeightPct={334.23} imgLeftPct={-18.9} imgTopPct={0}
        />

        {/* Vector1 — orange ribbon shape (left=115 top=77 w=141 h=51) */}
        <div style={{ position: "absolute", left: 115, top: 77.17, width: 141, height: 51.63 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/vector1.svg" alt="" aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", maxWidth: "none", display: "block" }} />
        </div>

        {/* Title text */}
        <p
          className="absolute font-bold font-noto-bengali text-white whitespace-nowrap"
          style={{ left: "calc(50% - 84.51px)", top: 76.8, fontSize: 16, lineHeight: "normal" }}
        >
          মাতৃশক্তি ভরসা কার্ড
        </p>

        {/* Subtitle */}
        <p
          className="absolute font-bold font-noto-bengali text-white whitespace-nowrap"
          style={{ left: "calc(50% - 37px)", top: 136.46, fontSize: 10, lineHeight: "normal" }}
        >
          টাকার আর্থিক সহায়তা
        </p>

        {/* Green pill "প্রত্যেক মহিলাকে" (right) */}
        <div
          className="absolute overflow-hidden rounded-[37px] bg-[#01a650]"
          style={{ left: "calc(38% + 4.5px)", top: 155, width: 115, height: 23, boxShadow: "0px 2.971px 0px 0px rgba(0,0,0,0.25)" }}
        >
          <p className="absolute font-bold font-noto-bengali text-white whitespace-nowrap"
            style={{ left: "calc(40% - 26.76px)", top: 3.71, fontSize: 12, letterSpacing: "-0.48px", lineHeight: "normal" }}>
            প্রত্যেক মহিলাকে
          </p>
        </div>

        {/* White pill "প্রতি মাসে" (left) */}
        <div
          className="absolute overflow-hidden rounded-[37px] bg-white"
          style={{ left: "calc(40% - 64px)", top: 155, width: 74, height: 23, boxShadow: "-2.229px 2.971px 0px 0px rgba(0,0,0,0.25)" }}
        >
          <p className="absolute font-bold font-noto-bengali whitespace-nowrap"
            style={{ color: "#f66222", left: "calc(50% - 23px)", top: 4.46, fontSize: 12, letterSpacing: "-0.48px", lineHeight: "normal" }}>
            প্রতি মাসে
          </p>
        </div>

        {/* Group37319 — BJP lotus centre bottom
            inset: top=52.58% right=35.8% bottom=24.3% left=27.86% of 402×194 */}
        <div style={{ position: "absolute", top: "52.58%", right: "35.8%", bottom: "24.3%", left: "27.86%" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/group37319.svg" alt="" aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", maxWidth: "none", display: "block" }} />
        </div>

        {/* image10 — left BJP leader photo (left=17 top=105 w=67 h=78) */}
        <FigmaCrop
          src="/assets/image10.png"
          containerStyle={{ left: 17, top: 105.52, width: 67, height: 78.09 }}
          containerW={67} containerH={78.09}
          imgWidthPct={344.14} imgHeightPct={369.74} imgLeftPct={0} imgTopPct={-232.21}
        />

        {/* "বিজেপি" label */}
        <p
          className="absolute font-bold font-noto-bengali whitespace-nowrap"
          style={{ color: "#1d1c1c", left: "calc(50% - 165.63px)", top: 152.22, fontSize: 9.953, letterSpacing: "-0.398px", lineHeight: "normal" }}
        >
          বিজেপি
        </p>

        {/* Group37312 — small BJP lotus left
            inset: top=64.26% right=84.56% bottom=23.11% left=9.75% of 402×194 */}
        <div style={{ position: "absolute", top: "64.26%", right: "84.56%", bottom: "23.11%", left: "9.75%" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/group37312.svg" alt="" aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", maxWidth: "none", display: "block" }} />
        </div>
        </div>{/* end scaled inner */}
      </div>

      {/* ── GREEN DIVIDER ── */}
      <div className="w-full bg-[#00a750]" style={{ height: 3 }} />

      {/* ══════════════════════════════════════════════════════
          FORM SECTION
      ══════════════════════════════════════════════════════ */}
      <div ref={formTopRef} className="relative w-full bg-[#fed3a0] px-5 pt-5 pb-4">

        {/* Form No badge — top-right of peach section */}
        {formNo && (
          <div className="absolute top-2 right-5">
            <span className="text-[11px] font-inter font-semibold text-[#f76223] tracking-wide whitespace-nowrap">
              Form No: {formNo}
            </span>
          </div>
        )}

        <div className="flex flex-col gap-4 pb">
            {/* Name */}
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center justify-between">
                <label htmlFor="field-name" className="text-[#374151] text-[14px] font-semibold font-noto-bengali tracking-[-0.14px]">নাম</label>
              </div>
              <input id="field-name" type="text" placeholder="নাম" value={form.name}
                onChange={handleChange("name")} onBlur={handleBlur("name")}
                aria-invalid={!!errors.name}
                className={`h-12 rounded-[8px] border px-[15px] text-[14px] font-noto-bengali w-full bg-white text-[#374151] placeholder:text-[#727272] ${errors.name ? "border-red-500" : "border-[#c67c25]"}`}
              />
              {errors.name && <p role="alert" className="text-red-500 text-xs font-noto-bengali">{errors.name}</p>}
            </div>

            {/* Mobile */}
            <div className="flex flex-col gap-0.5">
              <label htmlFor="field-mobile" className="text-[#374151] text-[14px] font-semibold font-noto-bengali tracking-[-0.14px]">মোবাইল নম্বর</label>
              <input id="field-mobile" type="tel" inputMode="numeric" placeholder="মোবাইল নম্বর" value={form.mobile}
                onChange={handleChange("mobile")} onBlur={handleBlur("mobile")} maxLength={10}
                aria-invalid={!!errors.mobile}
                className={`h-12 rounded-[8px] border px-[15px] text-[14px] font-noto-bengali w-full bg-white text-[#374151] placeholder:text-[#727272] ${errors.mobile ? "border-red-500" : "border-[#c67c25]"}`}
              />
              {errors.mobile && <p role="alert" className="text-red-500 text-xs font-noto-bengali">{errors.mobile}</p>}
            </div>

            {/* Address */}
            <div className="flex flex-col gap-0.5">
              <label htmlFor="field-address" className="text-[#374151] text-[14px] font-semibold font-noto-bengali tracking-[-0.14px]">
                ঠিকানা <span className="font-normal text-[#9ca3af] text-[12px]">(ঐচ্ছিক)</span>
              </label>
              <input id="field-address" type="text" placeholder="ঠিকানা" value={form.address}
                onChange={handleChange("address")} onBlur={handleBlur("address")}
                aria-invalid={!!errors.address}
                className={`h-12 rounded-[8px] border px-[15px] text-[14px] font-noto-bengali w-full bg-white text-[#374151] placeholder:text-[#727272] ${errors.address ? "border-red-500" : "border-[#c67c25]"}`}
              />
              {errors.address && <p role="alert" className="text-red-500 text-xs font-noto-bengali">{errors.address}</p>}
            </div>
          </div>

        {/* CTA strip */}
        <div className="mt-5 w-full rounded-[40px] overflow-hidden relative" style={{ height: 50, boxShadow: "inset 0px 0px 4px 0px rgba(0,0,0,0.25)" }}>
          <div className="absolute inset-0 bg-gradient-to-r from-[#e25216] to-[#f37720]" />
          <div className="absolute inset-0 flex items-center justify-between px-4">
            <p className="text-white font-extrabold font-noto-bengali uppercase" style={{ fontSize: 14, letterSpacing: "-0.48px", lineHeight: 1.2 }}>
              ভয় OUT ভরসা IN বিজেপিকে ভোট দিন
            </p>
            <div style={{ width: 62, height: 27, flexShrink: 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/bjp-flag-btn.svg" alt="BJP" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          BENEFITS SECTION
      ══════════════════════════════════════════════════════ */}
      <div className="w-full px-5 pt-4 pb-5 relative overflow-hidden bg-gradient-to-b from-[#f76223] to-[#f34f22]">
        {/* Modi ghost top-right */}
        <div style={{ position: "absolute", right: 0, top: 0, width: 80, height: 75 , overflow: "hidden", pointerEvents: "none", opacity: 1 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/image_71.png" alt="" aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
        </div>

        {/* Badges */}
        <div className="flex items-center mb-4 relative">
  
  {/* First pill (front) */}
  <div
    className="bg-white rounded-[50px] h-[31px] px-4 flex items-center z-10 relative"
    style={{ boxShadow: "-3px 4px 0px rgba(0,0,0,0.25)" }}
  >
    <span
      className="text-[#f66222] font-bold font-noto-bengali whitespace-nowrap"
      style={{ fontSize: 15, letterSpacing: "-0.6px" }}
    >
      পশ্চিমবঙ্গে বিজেপি
    </span>
  </div>

  {/* Second pill (behind + shifted) */}
  <div
    className="bg-[#01a650] rounded-[50px] w-fit h-[31px] px-4 flex items-center relative z-0 -ml-6 pl-8"
    style={{ boxShadow: "0px 4px 0px rgba(0,0,0,0.25)" }}
  >
    <span
      className="text-white font-bold font-noto-bengali whitespace-nowrap"
      style={{ fontSize: 15, letterSpacing: "-0.6px" }}
    >
      সরকার আসলেই
    </span>
  </div>

</div>

        {/* Bullet list */}
        <div className="flex flex-col gap-3">
          {BENEFITS.map((benefit, i) => (
            <div key={i} className="flex items-start gap-2">
              <div style={{ width: 16, height: 17, flexShrink: 0, marginTop: 2 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/checkmark.svg" alt="✓" style={{ width: "100%", height: "100%" }} />
              </div>
              <p className="text-white font-bold font-noto-bengali" style={{ fontSize: 14, lineHeight: 1 }}>
                {benefit}
              </p>
            </div>
          ))}
        </div>
      </div>
      </form>

      {/* ══════════════════════════════════════════════════════
          SUBMIT FOOTER — fixed in front of the mobile screen
      ══════════════════════════════════════════════════════ */}
      <div className="fixed inset-x-0 bottom-0 z-[9999] flex justify-center">
        <div
          className="w-full max-w-[402px] bg-white/95 backdrop-blur-[6px]"
          style={{
            boxShadow: "0px -1px 14px rgba(0,0,0,0.09)",
            padding: "15px 40px",
            paddingBottom: "calc(20px + env(safe-area-inset-bottom))",
          }}
        >
          <button
            type="submit"
            form="outreach-form"
            disabled={submitting}
            className="w-full rounded-[40px] bg-[#f76223] flex items-center justify-center disabled:opacity-70"
            style={{ height: 50 }}
          >
            <span className="text-white font-bold font-noto-bengali">
              {submitting ? "জমা হচ্ছে… / Submitting…" : "Submit / জমা দিন"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
