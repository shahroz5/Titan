export interface LoadRegionListingPayload {
  pageIndex: number;
  pageSize: number;
}

export interface LoadRegionDetailsListingSuccessPayload {
  regionDetailsListing: RegionsData[];
  totalElements: number;
}

export interface SaveRegionDetailsPayload {
  regionCode: string;
  description: string;
  orgCode: string;
  configDetails: {};
  parentRegionCode: string;
  isActive: boolean;
}

export interface EditRegionDetailsPayload {
  regionCode: string;
  description: string;
  configDetails: {};
  isActive: boolean;
}
export interface RegionsData {
  regionCode: string;
  description: string;
  orgCode: string;
  configDetails: {};
  parentRegionCode: string;
  isActive: boolean;
}

export enum RegionEnum {
  NEW = 'NEW',
  new = 'new',
  edit = 'edit'
}
