export interface Token {
  scp: [];
  loc: string;
  apiKey: boolean;
  iss: string;
  aud: string;
  upn: string;
  unique_name: string;
  nbf: string;
  name: string;
  exp: string;
  iat: string;
  type: string;
  email: string;
  status: string;
  acl: string[];
  host: string;
  isSso: boolean;
}
