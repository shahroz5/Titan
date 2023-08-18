export type StoreType = 'L1' | 'L3' | 'ORG' | 'NONE';

export interface User {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  locationCode: string;
  storeType: string;
  exptime: Date;
  accessToken?: string;
  refreshToken: string;
  refreshTokenExp: Date;
  acl: Map<string, string[]>;
  isSso: boolean;
}
