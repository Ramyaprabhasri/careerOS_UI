import type { JobMatchInsight } from "@/types/job-discovery";

export type MatchProfileContext = {
  headline?: string | null;
  location?: string | null;
  skills?: string[];
};

export type MatchJobInput = {
  title: string;
  location: string;
  workMode: string;
  skills: string[];
  categories: string[];
  baseMatchScore: number;
};

function tokenize(value: string): string[] {
  return value
    .toLowerCase()
    .split(/[^a-z0-9+#.]/i)
    .map((part) => part.trim())
    .filter((part) => part.length > 1);
}

function uniqueNormalized(values: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of values) {
    const key = value.toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    result.push(value);
  }
  return result;
}

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

/**
 * Deterministic match scoring — not AI-generated.
 * Uses profile headline/location/skills overlap with the job.
 */
export function computeJobMatch(
  job: MatchJobInput,
  profile?: MatchProfileContext | null,
): JobMatchInsight {
  const profileSkills = uniqueNormalized([
    ...(profile?.skills ?? []),
    ...tokenize(profile?.headline ?? ""),
  ]);
  const jobSkills = uniqueNormalized(job.skills);
  const jobSkillKeys = new Set(jobSkills.map((skill) => skill.toLowerCase()));

  const matchingSkills = profileSkills.filter((skill) =>
    jobSkillKeys.has(skill.toLowerCase()),
  );
  const underrepresentedSkills = jobSkills.filter(
    (skill) =>
      !matchingSkills.some(
        (matched) => matched.toLowerCase() === skill.toLowerCase(),
      ),
  );

  const skillsScore =
    jobSkills.length === 0
      ? job.baseMatchScore
      : clamp((matchingSkills.length / jobSkills.length) * 100);

  const headlineTokens = tokenize(profile?.headline ?? "");
  const titleTokens = tokenize(job.title);
  const categoryTokens = job.categories.flatMap((category) =>
    tokenize(category),
  );
  const roleHits = [...titleTokens, ...categoryTokens].filter((token) =>
    headlineTokens.includes(token),
  ).length;
  const roleAlignment = clamp(
    job.baseMatchScore * 0.55 + Math.min(roleHits * 8, 40),
  );

  const profileLocation = (profile?.location ?? "").toLowerCase().trim();
  const jobLocation = job.location.toLowerCase();
  let locationScore = job.baseMatchScore * 0.7;
  if (job.workMode === "Remote") {
    locationScore = 90;
  } else if (
    profileLocation &&
    (jobLocation.includes(profileLocation) ||
      profileLocation.includes(jobLocation.split(",")[0]?.trim() ?? ""))
  ) {
    locationScore = 88;
  } else if (!profileLocation) {
    locationScore = job.baseMatchScore;
  } else {
    locationScore = 55;
  }
  const experience = clamp(locationScore);

  const keywordPool = uniqueNormalized([
    ...headlineTokens,
    ...profileSkills.map((skill) => skill.toLowerCase()),
  ]);
  const jobKeywords = uniqueNormalized([
    ...titleTokens,
    ...job.skills.map((skill) => skill.toLowerCase()),
    ...categoryTokens,
  ]);
  const keywordHits = jobKeywords.filter((keyword) =>
    keywordPool.includes(keyword),
  ).length;
  const keywordAlignment =
    jobKeywords.length === 0
      ? job.baseMatchScore
      : clamp((keywordHits / jobKeywords.length) * 100);

  const score = clamp(
    skillsScore * 0.35 +
      experience * 0.15 +
      roleAlignment * 0.3 +
      keywordAlignment * 0.2,
  );

  const summary =
    matchingSkills.length > 0
      ? `Deterministic fit based on ${matchingSkills.length} overlapping skill${matchingSkills.length === 1 ? "" : "s"} and role/location signals.`
      : `Deterministic baseline fit (${job.baseMatchScore}% stored score) with limited profile skill overlap.`;

  const nextSteps = [
    matchingSkills.length > 0
      ? "Emphasize overlapping skills on your resume and application notes"
      : "Add more skills to your profile to improve match specificity",
    underrepresentedSkills[0]
      ? `Consider preparing evidence for ${underrepresentedSkills[0]} if relevant`
      : "Review the job description for role-specific keywords",
    "Use Add to Applications to track this role on your board",
  ];

  return {
    score,
    summary,
    breakdown: {
      skills: skillsScore,
      experience,
      roleAlignment,
      keywordAlignment,
    },
    matchingSkills: matchingSkills.slice(0, 8),
    underrepresentedSkills: underrepresentedSkills.slice(0, 6),
    nextSteps,
  };
}
