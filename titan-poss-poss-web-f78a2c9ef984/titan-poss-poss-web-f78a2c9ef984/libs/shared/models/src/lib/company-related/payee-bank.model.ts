export interface PayeeBankDetails {
  bankName: string;
  bankCode: string;
  addressOne: string;
  addressTwo: string;
  townName: string;
  stateName: string;
  mailId: string;
  contactPerson: string;
  ownerType: string;
  isActive: boolean;
}
export interface PayeeBankMaster {
  bankName: string;
  townName: string;
  stateName: string;
  contactPerson: string;
  ownerType: string;
  isActive?: boolean;
}
export enum PayeeBankEnum {
  NEW = 'NEW',
  new = 'new',
  edit = 'edit',
  OK = 'OK',
  RETRY = 'RETRY'
}

export interface LoadPayeeBankListingPayload {
  description?: string;
  pageIndex: number;
  pageSize: number;
}

export interface LoadPayeeBankListingSuccessPayload {
  payeeBankListing: PayeeBankDetails[];
  totalElements: number;
}

export interface SavePayeeBankFormPayload {
  bankName: string;
  bankCode: string;
  address: string;
  // addressTwo: string;
  townName?: string;
  stateName?: string;
  mailId: string;
  ownerType: string;
  contactPerson: string;
  isActive: boolean;
}

export interface GlCodes {
  id: any;
  cashGlCode: string;
  cardGlCode: string;
  chequeGlCode: string;
  chequeReturnGlCode: string;
  ddGlCode: string;
}

export interface PayeeBankGLCodeDetails {
  id: string;
  bankName: string;
  locationCode: string;
  paymentCode: string;
  glCode: number;
  isDefault: boolean;
}

export interface PayeeGLCodeDetailsSuccessList {
  locationList: PayeeBankGLCodeDetails[];
  count: number;
}
export interface PayeeBankGLCodeDetailsRow {
  id: string;
  locationCode: string;
  description: string;
  isDefault: boolean;
  glCode: number;
  paymentCode: string;
}
export interface PayeeBankGLCodePayload {
  payloadData: {
    bankName: string;
    locationCode?: string[];
    paymentCode: string[];
  };
  pageEvent?: {
    pageIndex: number;
    pageSize: number;
  };
  isPageable?: boolean;
}

export interface SaveGLcodeDetails {
  bankName: string;
  addLocations: string[];
  addPaymentCodes: string[];
  removeLocations: string[];
  removePaymentCodes: string[];
  updateConfigs: string[];
}

export interface GlCodeDefaultsPayload {
  defaultList: [
    {
      locationCode: string;
      paymentCode: string;
    }
  ];
}
export interface GlSelectMappedLocations {
  id: string;
  description: string;
}
export interface PayeeLocations {
  locationCode: string;
  // cashIsDefault: boolean;
  // cashGlCode: string;
  // cardIsDefault: boolean;
  // cardGlCode: string;
  // chequeIsDefault: boolean;
  // chequeGlCode: string;
  // chequeReturnIsDefault: boolean;
  // chequeReturnGlCode: string;
  // ddIsDefault: boolean;
  // ddGlCode: string;
}
