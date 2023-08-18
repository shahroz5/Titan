export interface CutPieceTot {
  description: string;
  isActive: boolean;
  offerDetails: CutPieceTotConfigDetails;
  configDetails: CutPieceTotConfigDetails;
  isOfferEnabled: null;
  itemCode: string;
  startDate: null;
  endDate: null;
  customerMobileNos: any[];
  karat: number;
  configId: string;
  configType: string;
  createdDate: number;
}

export interface CutPieceTotConfigDetails {
  type: null | string;
  data: CutPieceTotConfigDetailsData | null;
}

export interface CutPieceTotConfigDetailsData {
  l3DeductionPercent: number;
}

export interface CutPieceTotFormData {
  l3DeductionPercent: string;
  configId: string;
}

export enum CutPieceTotEnum {
  TEP_CUT_PIECE_TOT_CONFIG = 'TEP_CUT_PIECE_TOT_CONFIG'
}
