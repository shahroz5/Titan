import {
  AddressData,
  CustomErrors,
  EmployeeSignatureDetailsResponse
} from '@poss-web/shared/models';

export interface ProfileDataState {
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
  error: CustomErrors;
  orgCode: string;
  address: AddressData;
  roles: string[];
  cashierSignatureDetails: EmployeeSignatureDetailsResponse;
  uploadEmployeeSignatureResponse: any;
  isLoading: boolean;
  signatureError: CustomErrors;
}
