export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Organization {
  id: string;
  name: string;
  plan_tier: string | null;
  created_at: string;
}

export interface Role {
  id: string;
  name: string;
  slug: string;
  is_system: boolean;
  created_at: string;
}

export interface Profile {
  id: string;
  org_id: string | null;
  role_id: string;
  email: string;
  display_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface BRSRQuestionVisibility {
  id: string;
  org_id: string | null;
  role_id: string;
  section: string;
  principle_no: string;
  question_code: string;
  created_at: string;
}

export type RoleSlug = "master" | "admin" | "user";
