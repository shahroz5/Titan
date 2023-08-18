export interface CnMasterListResponse {
  cnMasterList: CnMasterDetail[];
  totalElements: number;
}

export interface CnMasterDetail {
  creditNoteType: string;
  description: string;
  isActive: boolean;
  IsAllowedForGHSGrammageAccount: boolean;
  IsAllowedforEghs: boolean;
}

export interface CnMasterDetails {
  description: string;
  isActive: boolean;
  configDetails: {
    data: {
      IsAllowedForGHSGrammageAccount: boolean;
      IsAllowedforEghs: boolean;
    };
  };
}

export interface CnMasterRequestPayload {
  pageIndex: number;
  pageSize: number;
}

export interface UpdateCreditNoteMasterPayload {
  cnType: string;
  cnDetail: CnMasterDetails;
}
