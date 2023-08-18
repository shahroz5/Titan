export interface TEPExceptionConfig {
  description?: string;
  isActive: boolean;
  offerDetails?: TEPExceptionConOfferDetails;
  configDetails?: TEPExceptionConfigDetails;
  isOfferEnabled?: any;
  itemCode?: string;
  startDate?: number;
  endDate?: number;
  customerMobileNos?: string[];
  configId: string;
  configType?: string;
  createdDate?: number;
}

export interface TEPExceptionConfigFilter {
  configName: string;
  variantCode: string;
}
export interface TEPExceptionConfigDetails {
  type?: any;
  data?: any;
}

export interface TEPExceptionConOfferDetails {
  type: string;
  data: TEPExceptionConfigOfferDetailsData;
}

export interface TEPExceptionConfigOfferDetailsData {
  deductionPercent: number;
  flatTepExchangeValue: number;
  isWeightToleranceAllowed: boolean;
  approvedBy: string;
  reasonForException: string;
}

export interface TEPExceptionConfigListingPayload {
  pageIndex: number;
  pageSize: number;
}

export interface TEPExceptiononfigListing {
  results: TEPExceptionConfig[];
  totalElements: number;
}

export interface TEPGlobalConfigListing {
  results: TEPGlobalConfigResult[];
}
export interface TEPGlobalConfigResult {
  configDetails: {
    data: {
      maxFlatTepExchangeValue: number;
    };
  };
}
export enum TEPExceptionTypeEnum {
  DEDUCTIONPERCENTAGE = '1',
  FLATTEPEXCHANGEVALUE = '2'
}

export enum TEPExceptionConfigEnum {
  NEW = 'NEW',
  new = 'new',
  edit = 'edit'
}
