
export interface SkinIssue {
  issue: string;
  description: string;
  food_recommendations: string[];
  medicine_recommendations: string[];
}

export type SkinAnalysis = SkinIssue[];

export interface JournalEntry {
  id: number;
  title: string;
  date: string;
  imageDataUrl: string;
  analysis: SkinAnalysis;
  notes: string;
}
