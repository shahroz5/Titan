import { AddressData } from '@poss-web/shared/models';

export interface ProfileData {
  empName: string;
  email: string;
  userType: string;
  boutiqueType: string;
  boutiqueCode: string;
  boutiqueDesc: string;
  isBTQUser: boolean;
  isCorpUser: boolean;
  isRegUser: boolean;
  regionCode: string;
  isL1Boutique: boolean;
  isL2Boutique: boolean;
  isL3Boutique: boolean;
  orgCode: string;
  address: AddressData;
  roles: string[];
}
