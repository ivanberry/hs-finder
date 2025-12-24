
export interface HSResult {
  hsCode: string;
  description: string;
  section?: string;
  subheading?: string;
  generalNotes?: string;
  typicalDutyRate?: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface SearchResponse {
  results: HSResult[];
  summary: string;
  sources: GroundingSource[];
}

export enum AppView {
  HOME = 'HOME',
  RESULTS = 'RESULTS'
}
