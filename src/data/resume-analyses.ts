import type { ResumeAnalysis } from "@/types/resume-analyzer";

/** Seed history so the module feels inhabited on first visit. */
export const seedResumeAnalyses: ResumeAnalysis[] = [
  {
    id: "analysis-seed-1",
    createdAt: "2026-03-10T14:20:00.000Z",
    isDemo: true,
    resume: {
      id: "file-seed-1",
      name: "Ramya_Frontend_Resume.pdf",
      size: 248320,
      type: "application/pdf",
      uploadedAt: "2026-03-10T14:18:00.000Z",
    },
    targetRole: "Frontend Engineer",
    company: "Atlas Systems",
    jobDescription:
      "We are hiring a Frontend Engineer with React, TypeScript, and design systems experience.",
    overallScore: 84,
    summary:
      "Demo result: Strong frontend alignment with room to quantify impact in recent roles.",
    categoryScores: [
      {
        id: "ats",
        label: "ATS Readability",
        score: 88,
        note: "Demo estimate based on structure heuristics.",
      },
      {
        id: "skills",
        label: "Skills Relevance",
        score: 86,
        note: "Demo estimate of skill visibility.",
      },
      {
        id: "experience",
        label: "Experience Quality",
        score: 79,
        note: "Demo estimate of bullet clarity and impact.",
      },
      {
        id: "structure",
        label: "Resume Structure",
        score: 90,
        note: "Demo estimate of formatting consistency.",
      },
    ],
    jobMatch: {
      score: 78,
      matchingSkills: ["React", "TypeScript", "JavaScript"],
      missingKeywords: ["accessibility", "CI/CD"],
      relevantExperience: [
        "Component-driven UI development",
        "Design systems collaboration",
      ],
      keywordAlignmentNote:
        "Missing keywords mean the phrase is underrepresented — not proof of missing skill.",
    },
    skills: {
      matched: ["React", "TypeScript", "JavaScript", "Redux"],
      suggestedKeywords: ["accessibility", "CI/CD"],
      skillsToHighlight: ["Design systems collaboration"],
    },
    strengths: [
      {
        id: "s1",
        title: "Strong frontend technology alignment",
        description: "Core stack keywords are visible and role-appropriate.",
      },
      {
        id: "s2",
        title: "Relevant professional experience",
        description: "Work history supports a modern product-engineering path.",
      },
    ],
    recommendations: [
      {
        id: "r1",
        issue: "Experience bullets could show clearer measurable outcomes.",
        whyItMatters: "Quantified impact improves scanability for hiring teams.",
        suggestedImprovement:
          "Add accurate metrics to 2–3 bullets in your latest role.",
        priority: "High",
        originalSnippet:
          "Worked on frontend features and collaborated with the product team.",
        suggestedRewrite:
          "Shipped frontend features with product and design, improving key workflow completion time by ~18%.",
      },
    ],
  },
];
