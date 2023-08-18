export interface ComplexityListPayload {
  pageIndex: number;
  pageSize: number;
}
export interface ComplexityListing {
  results: ComplexityCode[];
  totalElements: number;
}

export interface ComplexityCode {
  complexityCode: string;
  description: string;
  isActive?: boolean;
}

export enum complexityCodeEnum {
  NEW = 'NEW',
  new = 'new',
  edit = 'edit'
}
