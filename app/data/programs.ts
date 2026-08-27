export interface Program {
  slug: string;
  track: "Foundational" | "Undergraduate" | "Graduate";
  credential: string;
  name: string;
  teaser: string;
  description: string;
  courses: string[];
  length: string;
  meets: string;
  campuses: string;
  featured?: boolean;
}

export const programs: Program[] = [
  {
    slug: "adult-bible-studies",
    track: "Foundational",
    credential: "No prerequisites",
    name: "Adult Bible Studies",
    teaser:
      "For church members who want to read Scripture with confidence. No prior study required.",
    description:
      "For the church member who wants to read Scripture with confidence — Sunday school teachers, deacons, anyone asked to teach and unsure where to start.",
    courses: [
      "Survey of the Old Testament",
      "Survey of the New Testament",
      "How to study a book",
    ],
    length: "3 terms",
    meets: "Tue & Thu, 7pm",
    campuses: "All four",
  },
  {
    slug: "biblical-studies",
    track: "Undergraduate",
    credential: "Diploma / B.A.",
    name: "Biblical Studies",
    teaser:
      "Book-by-book work in the Old and New Testaments, with hermeneutics and exegesis.",
    description:
      "Book-by-book work through both testaments with the tools that make the reading honest: hermeneutics, exegesis, and the historical setting of the text.",
    courses: [
      "Hermeneutics I & II",
      "Pentateuch",
      "Pauline Epistles",
      "Biblical Greek (elective)",
    ],
    length: "2–4 years",
    meets: "Evenings",
    campuses: "Lakeland, Jacksonville",
  },
  {
    slug: "christian-education",
    track: "Undergraduate",
    credential: "Diploma / B.A.",
    name: "Christian Education",
    teaser:
      "For superintendents, youth directors, and anyone who carries a teaching ministry.",
    description:
      "For superintendents, youth directors, and anyone carrying a teaching ministry. Curriculum design, age-level instruction, and the administration of a Sunday school that actually runs.",
    courses: ["Teaching children", "Youth ministry", "Church administration"],
    length: "2–4 years",
    meets: "Sat mornings",
    campuses: "All four",
  },
  {
    slug: "theology",
    track: "Undergraduate",
    credential: "Licensed ministers",
    name: "Theology",
    teaser:
      "Doctrine, church history, and homiletics for licensed ministers preparing to preach.",
    description:
      "Doctrine, church history, and homiletics for the licensed minister preparing to preach weekly. You will write sermons, deliver them to faculty, and be told the truth about them.",
    courses: [
      "Systematic Theology I–III",
      "Homiletics",
      "Baptist history & polity",
      "Pastoral care",
    ],
    length: "3–4 years",
    meets: "Evenings",
    campuses: "Lakeland, Lake City",
  },
  {
    slug: "masters-doctorate",
    track: "Graduate",
    credential: "By interview",
    name: "Master’s & Doctorate",
    teaser:
      "Advanced study for credentialed ministers already leading a congregation or ministry.",
    description:
      "Advanced study for credentialed ministers already leading a congregation. Cohort of twelve, one Saturday a month, a project rooted in the church you serve.",
    courses: [
      "Advanced homiletics",
      "Leadership in the black church",
      "Ministry project",
    ],
    length: "2–3 years",
    meets: "Monthly Sat",
    campuses: "Lakeland",
    featured: true,
  },
];
