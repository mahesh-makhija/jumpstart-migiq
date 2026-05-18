export type SourceType = "paper" | "article" | "youtube" | "tweet" | "other";
export type Status = "inbox" | "reading" | "finished";

export interface ItemFrontmatter {
  id: string;
  url: string;
  title: string;
  source_type: SourceType;
  author?: string;
  date_published?: string;
  date_added: string;
  created_at?: string;
  status: Status;
  tags: string[];
  local_content: boolean;
}

export interface Item extends ItemFrontmatter {
  body: string;
  sha?: string;
  path: string;
}

export interface ExtractResult {
  title: string;
  author?: string;
  date_published?: string;
  source_type: SourceType;
  body: string;
  local_content: boolean;
  resolved_url?: string;
}

export interface TagSuggestion {
  suggested_existing: string[];
  suggested_new: string[];
  overlap_warnings: { new: string; similar_existing: string[]; note: string }[];
}
