export interface LoadCatchmentListingPayload {
  pageIndex?: number;
  pageSize?: number;
}

export interface LoadCatchmentListingSuccessPayload {
  catchmentListing: CatchmentDetails[];
  totalElements: number;
}

export interface CatchmentDetails {
  catchmentCode: string;
  description: string;
  isActive: boolean;
  isEditable?: boolean;
  mode?: string;
}

export enum CatchmentEnum {
  NEW = 'NEW',
  new = 'new',
  edit = 'edit'
}
