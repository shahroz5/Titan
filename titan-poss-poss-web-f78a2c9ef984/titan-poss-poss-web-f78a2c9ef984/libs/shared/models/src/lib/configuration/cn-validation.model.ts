export interface CnValidation {
  ruleId?: string;
  ruleType?: string;
  description?: string;
  isActive?: boolean;
  ruleDetails?: {
    data: {};
    type: string;
  };
}

export interface CnValidationList {
  cnValidationList: CnValidation[];
  totalElements: number;
}

export interface CnValidationResponse {
  ruleId: string;
  ruleType: string;
  description: string;
  isActive: boolean;
  isCancellationAllowed: boolean;
  deductionRate: string;
  criteriaRateForDeduction: string;
  residentialValueAmount: string;
  isBrandWiseTransferAllowed: boolean;
  isBoutiqueWiseTransferAllowed: boolean;
  GHSUtilizationTransferPercent: string;
  GHSMaxAmountTransfer: string;
  isMergingGRFCNAllowed?: boolean;
  gRFResidualValueAmount?: string;
  isPercent?: boolean;
  gRFResidentialClosure?: string;
  isOnlyCNCustomerAllowedForMergeGRF?: boolean;
}

export interface CnValidationListPayload {
  pageIndex: number;
  pageSize: number;
  length: number;
  searchDescription?: any;
}

export interface CnTypeList {
  id: string;
  description: string;
}
