import path from "node:path";
import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

const fontPath = (file: string) =>
  path.join(process.cwd(), "assets", "fonts", file);

Font.register({
  family: "Geist",
  fonts: [
    { src: fontPath("Geist-Regular.ttf"), fontWeight: 400 },
    { src: fontPath("Geist-Medium.ttf"), fontWeight: 500 },
    { src: fontPath("Geist-SemiBold.ttf"), fontWeight: 600 },
    {
      src: fontPath("Geist-Italic.ttf"),
      fontWeight: 400,
      fontStyle: "italic",
    },
  ],
});

Font.register({
  family: "InstrumentSerif",
  fonts: [
    {
      src: fontPath("InstrumentSerif-Italic.ttf"),
      fontStyle: "italic",
      fontWeight: 400,
    },
  ],
});

// French copy breaks badly with the default hyphenation dictionary.
Font.registerHyphenationCallback((word) => [word]);

const ink = "#101828";
const muted = "#4b5563";
const faint = "#8a93a3";
const amber = "#b45309";
const rule = "#d9dde3";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Geist",
    fontSize: 9,
    lineHeight: 1.42,
    color: ink,
    paddingTop: 34,
    paddingBottom: 36,
    paddingHorizontal: 44,
  },

  /* Header */
  identity: { flexDirection: "row", alignItems: "center", gap: 13 },
  photo: { width: 50, height: 50, borderRadius: 25, objectFit: "cover" },
  name: {
    fontFamily: "InstrumentSerif",
    fontStyle: "italic",
    fontSize: 25,
    // Instrument Serif reports tight metrics; without this the next line
    // is drawn straight through the descenders.
    lineHeight: 1.25,
    color: ink,
  },
  role: { fontSize: 10, color: muted, marginTop: 2 },
  contact: {
    marginTop: 9,
    flexDirection: "row",
    flexWrap: "wrap",
    fontSize: 8.5,
  },
  contactItem: { marginRight: 10, color: ink },
  contactLabel: { color: faint },

  /* Sections */
  section: { marginTop: 10 },
  sectionRule: { borderTopWidth: 0.6, borderTopColor: rule, marginBottom: 5 },
  sectionTitle: {
    fontFamily: "InstrumentSerif",
    fontStyle: "italic",
    fontSize: 13.5,
    lineHeight: 1.25,
    color: ink,
    marginBottom: 4,
  },

  /* Common text */
  body: { color: muted },
  strong: { fontWeight: 600, color: ink },
  quote: {
    borderLeftWidth: 1.5,
    borderLeftColor: amber,
    paddingLeft: 9,
    marginTop: 9,
    fontFamily: "InstrumentSerif",
    fontStyle: "italic",
    fontSize: 10.5,
    color: ink,
  },
  metrics: { marginTop: 9, fontSize: 9, color: muted },

  /* Entries */
  entry: { marginTop: 7 },
  entryFirst: { marginTop: 0 },
  edge: {
    borderLeftWidth: 1.5,
    borderLeftColor: amber,
    paddingLeft: 9,
    marginTop: 4,
    fontStyle: "italic",
    fontSize: 8.6,
    color: muted,
  },
  entryTitle: { fontSize: 10, fontWeight: 600, color: ink },
  entryMeta: { fontSize: 8.8, color: muted, marginTop: 1 },
  entrySummary: { fontStyle: "italic", color: muted, marginTop: 3 },

  bulletRow: { flexDirection: "row", marginTop: 2.5 },
  bulletMark: { width: 9, color: faint },
  bulletText: { flex: 1, color: muted },

  stack: { fontSize: 8.2, color: faint, marginTop: 4 },

  /* Skills */
  skillLabel: { fontWeight: 600, color: ink },
  skillList: { color: muted },

  /* Footer — each line is positioned and `fixed` on its own so it repeats */
  footerName: {
    position: "absolute",
    bottom: 22,
    left: 44,
    fontSize: 7.5,
    color: faint,
  },
  footerPage: {
    position: "absolute",
    bottom: 22,
    right: 44,
    fontSize: 7.5,
    color: faint,
  },
});

export interface CvPdfData {
  name: string;
  role: string;
  contact: { label: string; value: string }[];
  summary: { title: string; body: string; quote: string };
  metrics: { value: string; label: string }[];
  expertise: { title: string; areas: { title: string; body: string }[] };
  skills: { title: string; groups: { label: string; items: string[] }[] };
  experience: {
    title: string;
    stackLabel: string;
    items: {
      role: string;
      company: string;
      type: string;
      period: string;
      location: string;
      summary: string;
      bullets: string[];
      stack: string;
    }[];
  };
  projects: {
    title: string;
    resultLabel: string;
    items: { name: string; context: string; body: string; result: string }[];
  };
  education: {
    title: string;
    items: {
      degree: string;
      school: string;
      location: string;
      detail: string;
      edge?: string;
    }[];
  };
  certifications: {
    title: string;
    items: { name: string; issuer: string; date: string }[];
  };
  languages: { title: string; items: { name: string; level: string }[] };
  soft: { title: string; items: string[] };
  photo: string;
  pageLabel: string;
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionRule} />
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Bullet({ children }: { children: string }) {
  return (
    <View style={styles.bulletRow}>
      <Text style={styles.bulletMark}>•</Text>
      <Text style={styles.bulletText}>{children}</Text>
    </View>
  );
}

export function CvPdfDocument({ data }: { data: CvPdfData }) {
  return (
    <Document
      title={`${data.name} — ${data.role}`}
      author={data.name}
      subject={data.role}
      keywords={data.skills.groups.flatMap((group) => group.items).join(", ")}
    >
      <Page size="A4" style={styles.page}>
        {/* ---------- Identity ---------- */}
        <View style={styles.identity}>
          {/* React PDF's Image, not next/image — it takes no alt text */}
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image src={data.photo} style={styles.photo} />
          <View>
            <Text style={styles.name}>{data.name}</Text>
            <Text style={styles.role}>{data.role}</Text>
          </View>
        </View>

        <View style={styles.contact}>
          {data.contact.map((item) => (
            <Text key={item.label} style={styles.contactItem}>
              <Text style={styles.contactLabel}>{item.label} : </Text>
              {item.value}
            </Text>
          ))}
        </View>

        {/* ---------- Profile ---------- */}
        <Section title={data.summary.title}>
          <Text style={styles.body}>{data.summary.body}</Text>
          <Text style={styles.quote}>{data.summary.quote}</Text>
          <Text style={styles.metrics}>
            {data.metrics.map((metric, index) => (
              <Text key={metric.label}>
                {index > 0 ? "   " : ""}
                <Text style={styles.strong}>{metric.value}</Text>{" "}
                {metric.label}
              </Text>
            ))}
          </Text>
        </Section>

        {/* ---------- Areas of expertise ---------- */}
        <Section title={data.expertise.title}>
          {data.expertise.areas.map((area, index) => (
            <Text
              key={area.title}
              style={[styles.body, index > 0 ? { marginTop: 4 } : {}]}
            >
              <Text style={styles.strong}>{area.title} : </Text>
              {area.body}
            </Text>
          ))}
        </Section>

        {/* ---------- Technical skills ---------- */}
        <Section title={data.skills.title}>
          {data.skills.groups.map((group, index) => (
            <Text
              key={group.label}
              style={[styles.skillList, index > 0 ? { marginTop: 4 } : {}]}
            >
              <Text style={styles.skillLabel}>{group.label} : </Text>
              {group.items.join("  ·  ")}
            </Text>
          ))}
        </Section>

        {/* ---------- Professional experience ---------- */}
        <Section title={data.experience.title}>
          {data.experience.items.map((item, index) => (
            <View
              key={`${item.company}-${item.period}`}
              style={index === 0 ? styles.entryFirst : styles.entry}
            >
              <Text style={styles.entryTitle}>{item.role}</Text>
              <Text style={styles.entryMeta}>
                {[item.company, item.type, item.period, item.location]
                  .filter(Boolean)
                  .join("  ·  ")}
              </Text>
              <Text style={styles.entrySummary}>{item.summary}</Text>
              {item.bullets.map((bullet) => (
                <Bullet key={bullet}>{bullet}</Bullet>
              ))}
              {item.stack ? (
                <Text style={styles.stack}>
                  {data.experience.stackLabel} : {item.stack}
                </Text>
              ) : null}
            </View>
          ))}
        </Section>

        {/* ---------- Selected work ---------- */}
        <Section title={data.projects.title}>
          {data.projects.items.map((item, index) => (
            <View
              key={item.name}
              style={index === 0 ? styles.entryFirst : styles.entry}
              wrap={false}
            >
              <Text style={styles.entryTitle}>{item.name}</Text>
              <Text style={styles.entryMeta}>{item.context}</Text>
              <Text style={[styles.body, { marginTop: 2 }]}>{item.body}</Text>
              <Text style={[styles.body, { marginTop: 2 }]}>
                {data.projects.resultLabel} :{" "}
                <Text style={styles.strong}>{item.result}</Text>
              </Text>
            </View>
          ))}
        </Section>

        {/* ---------- Education ---------- */}
        <Section title={data.education.title}>
          {data.education.items.map((item, index) => (
            <View
              key={item.degree}
              style={index === 0 ? styles.entryFirst : styles.entry}
              wrap={false}
            >
              <Text style={styles.entryTitle}>{item.degree}</Text>
              <Text style={styles.entryMeta}>
                {[item.school, item.location].filter(Boolean).join("  ·  ")}
              </Text>
              <Text style={styles.entrySummary}>{item.detail}</Text>
              {item.edge ? <Text style={styles.edge}>{item.edge}</Text> : null}
            </View>
          ))}
        </Section>

        {/* ---------- Certifications ---------- */}
        <Section title={data.certifications.title}>
          {data.certifications.items.map((item, index) => (
            <View
              key={item.name}
              style={index === 0 ? styles.entryFirst : { marginTop: 5 }}
              wrap={false}
            >
              <Text style={{ fontWeight: 500 }}>{item.name}</Text>
              <Text style={styles.entryMeta}>
                {item.issuer}  ·  {item.date}
              </Text>
            </View>
          ))}
        </Section>

        {/* ---------- Languages ---------- */}
        <Section title={data.languages.title}>
          {data.languages.items.map((item, index) => (
            <Text
              key={item.name}
              style={[styles.body, index > 0 ? { marginTop: 2 } : {}]}
            >
              <Text style={styles.strong}>{item.name}</Text>  ·  {item.level}
            </Text>
          ))}
        </Section>

        {/* ---------- Ways of working ---------- */}
        <Section title={data.soft.title}>
          <Text style={styles.body}>{data.soft.items.join("  ·  ")}</Text>
        </Section>

        <Text style={styles.footerName} fixed>
          {data.name}
        </Text>
        <Text
          style={styles.footerPage}
          fixed
          render={({ pageNumber, totalPages }) =>
            `${data.pageLabel} ${pageNumber}/${totalPages}`
          }
        />
      </Page>
    </Document>
  );
}
