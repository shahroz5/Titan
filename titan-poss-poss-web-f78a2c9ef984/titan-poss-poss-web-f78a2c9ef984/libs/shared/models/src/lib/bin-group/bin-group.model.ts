
export interface LoadBinGroupDetailsListingPayload {
  pageIndex: number;
  pageSize: number;
}
export interface LoadBinGroupDetailsListingSuccessPayload {
  binGroupDetailsListing: BinGroupDetails[];
  totalElements: number;
}


export interface SearchBinGroupListingSuccessPayload {
  searchBinGroupListing: BinGroupDetails[];
}

export interface SaveBinGroupFormDetailsPayload {
  binGroupCode: string;
  description: string;
  isActive: boolean;
}

export interface SaveBinGroupFormDetailsPayload {
  description: string;
  isActive: boolean;
}

export interface BinGroupDetails {
  binGroupCode: string;
  description: string;
  isActive: boolean
}

export interface BinGroups{
  binGroupCode: string,
  isActive: boolean
}

export enum BinGroupEnum{
  NEW = 'NEW',
  new = 'new',
  edit = 'edit'
}

