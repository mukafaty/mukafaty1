import logoAsset from "@/assets/mukafaty-logo.png.asset.json";
import {
  conversionRate,
  type PerformanceRow,
  type PlatformPerformance,
  type ProgramPerformance,
  type ReportMetric,
  type SourceKey,
} from "@/data/performanceReports";

/** مستند التقرير المخفي — يُلتقط لإنشاء ملف PDF فقط ولا يظهر في الصفحة */

const BAR_FILL: Record<SourceKey, string> = {
  whatsapp: "#25d366",
  telegram: "#229ed9",
  snapchat: "#ffeb00",
  tiktok: "linear-gradient(to top, #25f4ee, #fe2c55)",
  instagram: "linear-gradient(to top, #405de6, #833ab4 52%, #fd1d1d)",
  facebook: "#1877f2",
  x: "#000000",
  linkedin: "#0a66c2",
  google: "linear-gradient(to top, #4285f4 82%, #fbbc05)",
  email: "#ea4335",
  unknown: "#94a3b8",
};

const NAVY = "#081952";
const BRAND = "#006bfe";
const SOFT = "#e8f2ff";
const BORDER = "#dfe4ec";

const nf = (value: number) => value.toLocaleString("en-US");

function metricValue(metric: ReportMetric, row: PerformanceRow) {
  if (metric === "conversion") return conversionRate(row);
  return row[metric];
}

function metricText(metric: ReportMetric, value: number) {
  if (metric === "conversion") return `${value.toFixed(1)}%`;
  if (metric === "rewards") return `${nf(value)} ريال`;
  return nf(value);
}

const COLUMNS = ["عدد النقرات", "تسجيلات الاهتمام", "معدل التحويل إلى التسجيل", "عدد المتدربين", "إجمالي المكافآت"];

function chunk<T>(rows: T[], size: number): T[][] {
  if (rows.length === 0) return [];
  const out: T[][] = [];
  for (let i = 0; i < rows.length; i += size) out.push(rows.slice(i, i + size));
  return out;
}

function Cells({ row }: { row: PerformanceRow }) {
  return (
    <>
      <td style={cellStyle}>{nf(row.clicks)}</td>
      <td style={cellStyle}>{nf(row.interests)}</td>
      <td style={cellStyle}>{`${conversionRate(row).toLocaleString("en-US", { maximumFractionDigits: 1 })}%`}</td>
      <td style={cellStyle}>{nf(row.students)}</td>
      <td style={{ ...cellStyle, color: "#047857", fontWeight: 900 }}>{`${nf(row.rewards)} ريال`}</td>
    </>
  );
}

const cellStyle: React.CSSProperties = {
  border: `1px solid ${BORDER}`,
  padding: "7px 8px",
  textAlign: "center",
  fontWeight: 700,
  color: NAVY,
  fontSize: 13,
};

const headStyle: React.CSSProperties = {
  border: `1px solid ${BORDER}`,
  padding: "8px",
  background: SOFT,
  color: NAVY,
  fontWeight: 900,
  fontSize: 13,
};

const tableStyle: React.CSSProperties = { width: "100%", borderCollapse: "collapse", tableLayout: "fixed" };

function SectionHeading({ text }: { text: string }) {
  return <h2 style={{ margin: "0 0 8px", fontSize: 17, fontWeight: 900, color: NAVY }}>{text}</h2>;
}

function TableChunk({
  title,
  firstColumn,
  rows,
  total,
  continued,
}: {
  title?: string;
  firstColumn: string;
  rows: { key: string; name: string; row: PerformanceRow }[];
  total?: PerformanceRow;
  continued?: boolean;
}) {
  return (
    <div data-pdf-block style={{ background: "#ffffff" }}>
      {title ? <SectionHeading text={continued ? `${title} (تابع)` : title} /> : null}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={{ ...headStyle, textAlign: "right", width: "24%" }}>{firstColumn}</th>
            {COLUMNS.map((column) => (
              <th key={column} style={headStyle}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((item) => (
            <tr key={item.key}>
              <td style={{ ...cellStyle, textAlign: "right" }}>{item.name}</td>
              <Cells row={item.row} />
            </tr>
          ))}
          {total ? (
            <tr style={{ background: "#f1f4f9" }}>
              <td style={{ ...cellStyle, textAlign: "right", fontWeight: 900 }}>الإجمالي</td>
              <Cells row={total} />
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}

export type ReportDocumentProps = {
  marketerName: string;
  membership: string;
  generatedAt: string;
  periodLabel: string;
  rangeLabel: string;
  platformLabel: string;
  programLabel: string;
  metric: ReportMetric;
  metricLabel: string;
  totals: PerformanceRow;
  platforms: PlatformPerformance[];
  programs: ProgramPerformance[];
  hasData: boolean;
  emptyMessage: string;
  note: string;
};

export function PerformanceReportDocument(props: ReportDocumentProps) {
  const summary = [
    { label: "عدد النقرات", value: nf(props.totals.clicks) },
    { label: "تسجيلات الاهتمام", value: nf(props.totals.interests) },
    {
      label: "معدل التحويل إلى التسجيل",
      value: `${conversionRate(props.totals).toLocaleString("en-US", { maximumFractionDigits: 1 })}%`,
    },
    { label: "عدد المتدربين", value: nf(props.totals.students) },
    { label: "إجمالي المكافآت", value: `${nf(props.totals.rewards)} ريال` },
  ];

  const chartValues = props.platforms.map((platform) => ({
    key: platform.key,
    name: platform.name,
    value: metricValue(props.metric, platform),
  }));
  const maxValue = Math.max(...chartValues.map((item) => item.value), 0);
  const chartHasValues = maxValue > 0;

  const platformChunks = chunk(props.platforms, 8);
  const programChunks = chunk(props.programs, 9);

  return (
    <div
      dir="rtl"
      style={{
        width: 1040,
        background: "#ffffff",
        color: NAVY,
        fontFamily: '"Tajawal", sans-serif',
        padding: 4,
      }}
    >
      {/* الترويسة */}
      <div data-pdf-block style={{ background: "#ffffff" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: `3px solid ${BRAND}`,
            paddingBottom: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img src={logoAsset.url} alt="مكافآتي" style={{ height: 46 }} crossOrigin="anonymous" />
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: NAVY }}>تقرير الأداء</h1>
          </div>
          <span
            style={{
              background: SOFT,
              color: BRAND,
              borderRadius: 999,
              padding: "6px 14px",
              fontSize: 13,
              fontWeight: 800,
            }}
          >
            بيانات توضيحية
          </span>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 8,
            marginTop: 12,
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          <div>المسوّق: {props.marketerName}</div>
          <div>رقم العضوية: {props.membership}</div>
          <div>تاريخ الإصدار: {props.generatedAt}</div>
          <div>الفترة: {props.periodLabel}</div>
          <div>حدود الفترة: {props.rangeLabel}</div>
          <div>المنصة: {props.platformLabel}</div>
          <div>البرنامج التدريبي: {props.programLabel}</div>
        </div>
      </div>

      {/* ملخص المؤشرات */}
      <div data-pdf-block style={{ background: "#ffffff", marginTop: 14 }}>
        <SectionHeading text="ملخص المؤشرات" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
          {summary.map((item) => (
            <div
              key={item.label}
              style={{ border: `1px solid ${BORDER}`, borderRadius: 12, padding: 10, background: "#ffffff" }}
            >
              <div style={{ fontSize: 12, fontWeight: 800, color: "#5b6478", minHeight: 32 }}>{item.label}</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: NAVY, direction: "ltr", textAlign: "right" }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {!props.hasData ? (
        <div data-pdf-block style={{ background: "#ffffff", marginTop: 14 }}>
          <p style={{ textAlign: "center", fontWeight: 800, color: "#5b6478", padding: "24px 0", fontSize: 14 }}>
            {props.emptyMessage}
          </p>
        </div>
      ) : (
        <>
          {platformChunks.map((rows, index) => (
            <div key={`platform-${index}`} style={{ marginTop: 14 }}>
              <TableChunk
                title="أداء المنصات"
                continued={index > 0}
                firstColumn="المنصة"
                rows={rows.map((platform) => ({ key: platform.key, name: platform.name, row: platform }))}
                total={index === platformChunks.length - 1 ? props.totals : undefined}
              />
            </div>
          ))}

          <div data-pdf-block style={{ background: "#ffffff", marginTop: 14 }}>
            <SectionHeading text={`الأداء حسب المنصة — ${props.metricLabel}`} />
            {!chartHasValues ? (
              <p style={{ textAlign: "center", fontWeight: 800, color: "#5b6478", padding: "20px 0" }}>
                {props.emptyMessage}
              </p>
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: 10,
                  height: 240,
                  borderBottom: `1px solid ${BORDER}`,
                  padding: "0 4px",
                }}
              >
                {chartValues.map((item) => (
                  <div
                    key={item.key}
                    style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "flex-end" }}
                  >
                    <div style={{ fontSize: 11, fontWeight: 900, color: NAVY, marginBottom: 4 }}>
                      {metricText(props.metric, item.value)}
                    </div>
                    <div
                      style={{
                        width: "72%",
                        height: Math.max(3, Math.round((item.value / maxValue) * 170)),
                        background: BAR_FILL[item.key],
                        borderRadius: "7px 7px 0 0",
                      }}
                    />
                    <div style={{ fontSize: 11, fontWeight: 700, color: NAVY, marginTop: 6, minHeight: 30 }}>
                      {item.name}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {programChunks.map((rows, index) => (
            <div key={`program-${index}`} style={{ marginTop: 14 }}>
              <TableChunk
                title="أداء البرامج التدريبية"
                continued={index > 0}
                firstColumn="البرنامج التدريبي"
                rows={rows.map((program) => ({ key: program.id, name: program.name, row: program }))}
              />
            </div>
          ))}
        </>
      )}

      <div data-pdf-block style={{ background: "#ffffff", marginTop: 14 }}>
        <p
          style={{
            margin: 0,
            background: SOFT,
            borderRadius: 12,
            padding: "10px 12px",
            fontSize: 12,
            fontWeight: 700,
            color: NAVY,
          }}
        >
          ملاحظة: {props.note}
        </p>
      </div>
    </div>
  );
}
