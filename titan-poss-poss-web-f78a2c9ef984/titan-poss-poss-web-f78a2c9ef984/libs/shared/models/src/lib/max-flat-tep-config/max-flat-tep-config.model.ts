export interface GetMaxFlatTepConfigResponse {
  description: string;
  isActive: boolean;
  offerDetails: {
    type: string;
    data: {};
  };
  configDetails: MaxFlatTepConfigDetails;
  isOfferEnabled: boolean;
  itemCode: string;
  startDate: string;
  endDate: string;
  customerMobileNos: string[];
  configId: string;
  configType: string;
  createdDate: string;
}

export interface MaxFlatTepConfigResults {
  results: GetMaxFlatTepConfigResponse[];
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
}

export interface MaxFlatTepConfigDetails {
  type: string;
  data: {
    maxFlatTepExchangeValue: string;
  };
  configId?: string;
}

export interface MaxFlatValuePatchPayload {
  configDetails: MaxFlatTepConfigDetails;
}
