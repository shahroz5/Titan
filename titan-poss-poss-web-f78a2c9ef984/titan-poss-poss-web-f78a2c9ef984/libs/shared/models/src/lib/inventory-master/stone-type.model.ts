export interface StoneTypeDetails {
  stoneTypeCode: string;
  description: string;
  configDetails: {
    karatageWeightPrint: string;
  };
  isActive: boolean;
}

export enum StoneTypeEnum {
  NEW = 'NEW',
  new = 'new',
  edit = 'edit'
}

export interface LoadStoneTypeListingPayload {
  pageIndex: number;
  pageSize: number;
}

export interface LoadStoneTypeListingSuccessPayload {
  stoneTypeListing: StoneTypeDetails[];
  totalElements: number;
}

export interface SaveStoneTypeFormDetailsPayload {
  stoneTypeCode: string;
  description: string;
  configDetails: {
    karatageWeightPrint: string;
  };
  isActive: boolean;
}
