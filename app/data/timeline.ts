export type TimelineKind = "normal" | "fire" | "now";

export interface TimelineEvent {
  year: string;
  kind: TimelineKind;
  /** Plain text with **bold** spans marked by asterisks. */
  body: string;
  /** Optional labelled placeholder for an archival image. */
  imagePlaceholder?: string;
}

export const timeline: TimelineEvent[] = [
  {
    year: "1901",
    kind: "normal",
    body: "Organized in October at **Providence Baptist Church** in Bartow, under the South Florida Association, as Florida Baptist Seminary. Nine students, three teachers, no building.",
  },
  {
    year: "1902",
    kind: "normal",
    body: "Moved to **Lakeland** for a more central location, meeting in local churches while a campus was raised.",
  },
  {
    year: "1903–04",
    kind: "normal",
    body: "The **dormitory and academic buildings** are erected. The seminary has a home of its own.",
    imagePlaceholder: "Archival photo — original campus, c. 1904",
  },
  {
    year: "1921",
    kind: "fire",
    body: "The **dormitory burns down** in November. Classes move into the sanctuaries of Harmony Baptist and St. Paul Baptist within the week.",
  },
  {
    year: "1925",
    kind: "normal",
    body: "The State of Florida issues a **charter of incorporation** under the name Florida Seminary.",
  },
  {
    year: "1927–28",
    kind: "fire",
    body: "The **academic building burns**. Teaching continues uninterrupted in borrowed pews.",
  },
  {
    year: "1932",
    kind: "normal",
    body: "A **new building rises** and the seminary returns to its own property after eleven years in borrowed sanctuaries.",
  },
  {
    year: "Today",
    kind: "normal",
    body: "Campuses in Lakeland, **Dunedin, Lake City, and Jacksonville**. Alumni pastor churches across the South.",
  },
  {
    year: "2026",
    kind: "now",
    body: "**Accreditation granted.** One hundred and twenty-five years of teaching, formally recognized.",
  },
];

/** Split a `**bold**`-marked string into React-ready segments. */
export function markBold(text: string): { text: string; bold: boolean }[] {
  return text.split(/(\*\*[^*]+\*\*)/).map((part) =>
    part.startsWith("**") && part.endsWith("**")
      ? { text: part.slice(2, -2), bold: true }
      : { text: part, bold: false },
  );
}
