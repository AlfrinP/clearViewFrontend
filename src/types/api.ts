// API Types based on OpenAPI spec

export interface Token {
  access_token: string;
  token_type: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface SourceRef {
  title: string | null;
  url: string | null;
  snippet: string | null;
  domain: string | null;
  trust_score: number | null;
}

export interface VerificationRequest {
  claim: string;
}

export interface VerificationResponse {
  claim: string;
  verdict: string; // TRUE | FALSE | PARTIALLY_TRUE | UNVERIFIABLE
  confidence: number; // 0-1
  policy_sources: SourceRef[];
  external_sources: SourceRef[];
  reasoning: string;
  conflicts_found: boolean;
}

export interface IngestRequest {
  file_path: string;
}

export interface IngestResponse {
  status: string; // success | error
  documents_ingested: number;
  message: string;
}

export interface HealthResponse {
  status: string;
  mongodb: string;
  serper_key_set: boolean;
}

export interface HTTPValidationError {
  detail: ValidationError[];
}

export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
  input?: any;
  ctx?: Record<string, any>;
}
