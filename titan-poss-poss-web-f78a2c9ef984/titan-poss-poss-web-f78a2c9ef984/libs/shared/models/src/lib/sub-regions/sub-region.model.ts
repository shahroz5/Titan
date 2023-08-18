export interface SubRegion {
  regionCode: string;
  description: string;
  orgCode: string;
  configDetails: {};
  parentRegionCode: string;
  isActive: boolean;
}

export interface LoadSubRegionDetailsListingPayload {
  parentRegionCode: string;
  pageIndex: number;
  pageSize: number;
}

export interface LoadSubRegionListingSuccessPayload {
  subRegionDetailsListing: SubRegion[];
  totalElements: number;
}

export interface SaveSubRegionDetailsPayload {
  regionCode: string;
  description: string;
  orgCode: string;
  configDetails: {};
  parentRegionCode: string;
  isActive: boolean;
}

export interface SearchSubRegionPayload {
  regionCode: string;
  parentRegionCode?: string;
}

export interface EditSubRegionDetailsPayload {
  regionCode: string;
  description: string;
  configDetails: {};
  isActive: boolean;
}

export enum SubRegionEnum {
  NEW = 'NEW',
  new = 'new',
  edit = 'edit'
}
