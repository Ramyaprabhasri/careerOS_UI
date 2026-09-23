import { createId } from "@/lib/utils";
import type {
  AnalyzerMetrics,
  ResumeAnalysis,
  UploadedResumeMeta,
} from "@/types/resume-analyzer";

export const RESUME_STORAGE_KEY = "careeros-resume-analyses";
export const MAX_RESUME_BYTES = 5 * 1024 * 1024;
export const ACCEPTED_RESUME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
];

export const ACCEPTED_EXTENSIONS = [".pdf", ".docx", ".doc"];

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function isAcceptedResume(file: File) {
  const lower = file.name.toLowerCase();
  const byExt = ACCEPTED_EXTENSIONS.some((ext) => lower.endsWith(ext));
  const byType =
    ACCEPTED_RESUME_TYPES.includes(file.type) || file.type === "";
  return byExt && byType && file.size > 0 && file.size <= MAX_RESUME_BYTES;
}

export function validateResumeFile(file: File): string | null {
  const lower = file.name.toLowerCase();
  const byExt = ACCEPTED_EXTENSIONS.some((ext) => lower.endsWith(ext));
  if (!byExt) {
    return "Please upload a PDF or DOCX file.";
  }
  if (file.size > MAX_RESUME_BYTES) {
    return "File is too large. Maximum size is 5 MB.";
  }
  return null;
}

const FRONTEND_KEYWORDS = [
  "React",
  "TypeScript",
  "JavaScript",
  "Next.js",
  "Redux",
  "CSS",
  "HTML",
  "accessibility",
  "performance",
  "CI/CD",
  "testing",
  "design systems",
];

function hashSeed(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function pickScore(seed: number, min: number, max: number) {
  return min + (seed % (max - min + 1));
}

export function buildDemoAnalysis(input: {
  resume: UploadedResumeMeta;
  targetRole: string;
  company?: string;
  jobDescription?: string;
  jobUrl?: string;
}): ResumeAnalysis {
  const role = input.targetRole.trim() || "General career review";
  const jd = (input.jobDescription ?? "").toLowerCase();
  const seed = hashSeed(`${input.resume.name}-${role}-${jd.slice(0, 80)}`);

  const overallScore = pickScore(seed, 74, 88);
  const hasJob = Boolean(input.jobDescription?.trim());

  const matched = ["React", "TypeScript", "JavaScript", "Redux"].filter(
    (skill) => !jd || jd.includes(skill.toLowerCase()) || seed % 3 !== 0,
  );

  const suggestedKeywords = FRONTEND_KEYWORDS.filter((skill) => {
    if (!hasJob) return ["accessibility", "performance", "CI/CD"].includes(skill);
    return (
      jd.includes(skill.toLowerCase()) &&
      !matched.map((m) => m.toLowerCase()).includes(skill.toLowerCase())
    );
  }).slice(0, 4);

  const missingKeywords =
    suggestedKeywords.length > 0
      ? suggestedKeywords
      : ["accessibility", "performance optimization"];

  const jobMatchScore = hasJob ? pickScore(seed >> 2, 68, 84) : null;

  return {
    id: createId("analysis"),
    createdAt: new Date().toISOString(),
    isDemo: true,
    resume: input.resume,
    targetRole: role,
    company: input.company?.trim() || undefined,
    jobDescription: input.jobDescription?.trim() || undefined,
    jobUrl: input.jobUrl?.trim() || undefined,
    overallScore,
    summary: hasJob
      ? `Demo result: Your resume shows solid alignment with ${role}${input.company ? ` at ${input.company}` : ""}, with opportunities to strengthen impact statements and keyword coverage.`
      : "Demo result: Your resume demonstrates strong frontend experience, with opportunities to improve impact and keyword alignment.",
    categoryScores: [
      {
        id: "ats",
        label: "ATS Readability",
        score: pickScore(seed, 78, 92),
        note: "Demo estimate based on structure heuristics.",
      },
      {
        id: "skills",
        label: "Skills Relevance",
        score: pickScore(seed >> 1, 72, 90),
        note: "Demo estimate of skill visibility.",
      },
      {
        id: "experience",
        label: "Experience Quality",
        score: pickScore(seed >> 2, 70, 88),
        note: "Demo estimate of bullet clarity and impact.",
      },
      {
        id: "structure",
        label: "Resume Structure",
        score: pickScore(seed >> 3, 76, 94),
        note: "Demo estimate of formatting consistency.",
      },
    ],
    jobMatch: hasJob
      ? {
          score: jobMatchScore!,
          matchingSkills: matched.length
            ? matched
            : ["React", "TypeScript", "JavaScript"],
          missingKeywords,
          relevantExperience: [
            "Frontend feature delivery",
            "Component-driven UI development",
            "Collaboration with design and product",
          ],
          keywordAlignmentNote:
            "Missing keywords mean the phrase is underrepresented in the uploaded resume text — not that you lack the skill.",
        }
      : null,
    skills: {
      matched: matched.length ? matched : ["React", "TypeScript", "JavaScript"],
      suggestedKeywords: missingKeywords,
      skillsToHighlight: [
        "Design systems collaboration",
        "Cross-functional delivery",
        "UI performance awareness",
      ],
    },
    strengths: [
      {
        id: "s1",
        title: "Strong frontend technology alignment",
        description:
          "Core stack keywords appear clearly and support a frontend-focused narrative.",
      },
      {
        id: "s2",
        title: "Relevant professional experience",
        description:
          "Work history reads as product-oriented and role-appropriate for modern web teams.",
      },
      {
        id: "s3",
        title: "Clear technical skill coverage",
        description:
          "Skills section is scannable and covers foundational frontend competencies.",
      },
    ],
    recommendations: [
      {
        id: "r1",
        issue: "Experience bullets could show clearer measurable outcomes.",
        whyItMatters:
          "Quantified impact helps recruiters and hiring managers understand scope quickly.",
        suggestedImprovement:
          "Rewrite 2–3 bullets with metrics such as latency, conversion, or delivery speed — only where accurate.",
        priority: "High",
        originalSnippet:
          "Worked on frontend features and collaborated with the product team.",
        suggestedRewrite:
          "Shipped 8+ frontend features with product and design, improving task completion time by ~18% across key workflows.",
      },
      {
        id: "r2",
        issue: "Relevant technologies may be under-emphasized.",
        whyItMatters:
          "Role-specific keywords improve scannability for both humans and automated screens.",
        suggestedImprovement:
          "Surface tools already used in projects within role bullets, without inventing experience.",
        priority: "Medium",
        originalSnippet: "Built reusable UI components for the design system.",
        suggestedRewrite:
          "Built reusable React/TypeScript UI components for the design system, reducing duplicate UI work across 3 product squads.",
      },
      {
        id: "r3",
        issue: "Formatting consistency can be tightened.",
        whyItMatters:
          "Consistent structure improves ATS parsing and first-pass readability.",
        suggestedImprovement:
          "Align date formats, section spacing, and bullet punctuation throughout.",
        priority: "Low",
        originalSnippet: "Mixed date styles and uneven section spacing.",
        suggestedRewrite:
          "Use one date format (e.g. Mar 2024 – Present) and consistent section spacing across the document.",
      },
      {
        id: "r4",
        issue: "Some role keywords are missing from the resume text.",
        whyItMatters:
          "If you already have the experience, reflecting those keywords can improve match visibility.",
        suggestedImprovement:
          "Add truthful mentions of missing keywords where they reflect real work.",
        priority: "Medium",
        originalSnippet: "Resume does not mention accessibility or CI/CD.",
        suggestedRewrite:
          "Partnered with design on accessible UI states and contributed to CI checks for frontend pull requests.",
      },
    ],
  };
}

export function computeAnalyzerMetrics(
  analyses: ResumeAnalysis[],
): AnalyzerMetrics {
  if (analyses.length === 0) {
    return {
      resumesAnalyzed: 0,
      averageScore: 0,
      analysesThisMonth: 0,
    };
  }

  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  const analysesThisMonth = analyses.filter((item) => {
    const date = new Date(item.createdAt);
    return date.getMonth() === month && date.getFullYear() === year;
  }).length;

  const averageScore = Math.round(
    analyses.reduce((sum, item) => sum + item.overallScore, 0) /
      analyses.length,
  );

  const uniqueResumes = new Set(analyses.map((item) => item.resume.name)).size;

  return {
    resumesAnalyzed: uniqueResumes,
    averageScore,
    analysesThisMonth,
  };
}

export function loadAnalysesFromStorage(): ResumeAnalysis[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(RESUME_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ResumeAnalysis[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveAnalysesToStorage(analyses: ResumeAnalysis[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(analyses));
}

export const ANALYSIS_STEPS = [
  "Reading resume",
  "Identifying skills and experience",
  "Evaluating resume structure",
  "Matching job requirements",
  "Generating recommendations",
] as const;

export const ANALYSIS_MESSAGES = [
  "Identifying your strongest skills...",
  "Reviewing your experience against the target role...",
  "Finding opportunities to strengthen your resume...",
  "Checking structure and scannability...",
  "Preparing demo recommendations...",
] as const;
