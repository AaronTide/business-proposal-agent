export type SimilarProject = {
  name: string;
  industry: string;
};

export type Requirements = {
  raw_analysis: string;
  industry?: string;
  company_size?: string;
  pain_points?: string[];
  timeline?: string;
  budget?: string;
};

export type ProposalResult = {
  transcript: string;
  requirements: Requirements;
  similar_projects: SimilarProject[];
  proposal: string;
};

export type PipelineStep = {
  id: "analyze" | "research" | "proposal";
  label: string;
  description: string;
};

export type ApiError = {
  error: string;
};
