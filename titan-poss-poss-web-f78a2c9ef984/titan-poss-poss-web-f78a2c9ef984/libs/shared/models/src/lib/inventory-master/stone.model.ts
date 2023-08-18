export interface LoadStoneListingPayload {
  pageIndex: number;
  pageSize: number;
}
export interface LoadStoneTypeDataListingPayload {
  pageIndex: number;
  pageSize: number;
}

export interface LoadStoneListingSuccessPayload {
  stoneListing: StoneDetails[];
  totalElements: number;
}

export interface StoneDetails {
  stoneCode: string;
  stoneTypeCode: string;
  stdWeight: string;
  color: string;
  stdValue: string;
  quality: string;
  configDetails: { StoneTEPDiscount: number };
  ratePerCarat: number;
  isActive: boolean;
}
export interface StoneFilter {
  payloadData: {
    color: string;
    fromStdValue: number;
    quality: string;
    ratePerCarat: number;
    stoneCode: string;
    stoneTypeCode: string;
    toStdValue: number;
  };
  pageIndex?: number;
  pageSize?: number;
}
