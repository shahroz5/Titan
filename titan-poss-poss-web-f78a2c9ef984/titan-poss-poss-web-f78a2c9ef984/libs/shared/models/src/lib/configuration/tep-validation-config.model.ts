export interface TEPValidationConfigListingPayload {
  pageIndex: number;
  pageSize: number;
}

export interface TEPValidationConfigListing {
  results: TEPValidationConfigResult[];
  totalElements: number;
}

export interface TEPValidationConfigResult {
  description: string;
  isActive: boolean;
  offerDetails: null;
  configDetails: TEPValidationConfigDetails;
  isOfferEnabled?: any;
  itemCode?: any;
  startDate?: any;
  endDate?: any;
  configId: string;
  configType: string;
}

interface TEPValidationConfigDetails {
  type: string;
  data: TEPValidationConfigDetailsData;
}

interface TEPValidationConfigDetailsData {
  isFVTCNCancellationAllowed: boolean;
  fvtCNCancellationDeductionPercent: number;
  isAnnexurePrintingAllowed: boolean;
  tepCancellationDays: number;
  isInterBrandCashRefundAllowed: boolean;
}

export enum TEPValidationConfigEnum {
  NEW = 'NEW',
  new = 'new',
  edit = 'edit',
  TEP_VALIDATION_CONFIG = 'TEP_VALIDATION_CONFIG',
  TEP_VALIDATION = 'TEP_VALIDATION'
}
