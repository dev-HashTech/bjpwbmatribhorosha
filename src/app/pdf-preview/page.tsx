import PdfPage1 from "@/components/pdf/PdfPage1";
import PdfPage2 from "@/components/pdf/PdfPage2";

const SAMPLE = {
  form_no: 1234,
  name: "সুমিত্রা দেবী",
  mobile: "9876543210",
  address: "১২ রাজপথ, কলকাতা ৭০০০০১",
  date: "19/04/2026",
};

export default async function PdfPreviewPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;

  const data = params.form_no
    ? {
        form_no: Number(params.form_no),
        name: params.name ?? "",
        mobile: params.mobile ?? "",
        address: params.address ?? "",
        date: params.date ?? "",
      }
    : SAMPLE;

  return (
    <div style={{ background: "#ccc", minHeight: "100vh", padding: "40px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 32 }}>
      <div style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>
        <PdfPage1 data={data} />
      </div>
      <div style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>
        <PdfPage2 />
      </div>
    </div>
  );
}
