interface OpenLibraryDoc {
  key: string;
  title: string;
  author_name?: string[];
  author_key?: string[];
  cover_i?: number;
  first_publish_year?: number;
}

export interface OpenLibraryResponse {
  numFound: number;
  start: number;
  numFoundExact?: boolean;
  num_found?: number;
  documentation_url?: string;
  q?: string;
  offset?: number | null;
  docs: OpenLibraryDoc[];
}


export interface Token {
  token: string;
  type: string;
  expiresInMS: number;
}