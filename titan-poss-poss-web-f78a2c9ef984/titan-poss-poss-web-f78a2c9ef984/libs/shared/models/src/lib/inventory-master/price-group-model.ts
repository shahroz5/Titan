export interface PriceGroupMaster {
  description: string;
  isActive?: boolean;
  priceGroup: string;
}
export interface PriceGroupListPayload {
  pageIndex: number;
  pageSize: number;
}

export interface PriceGroupListing {
  results: PriceGroupMaster[];
  totalElements: number;
}

export interface UpdatePriceGroupMasterPayload {
  priceGroup: string;
  data: any;
}
export interface SavePriceGroupMasterPayload {
  priceGroup: string;
  description: string;
  isActive: boolean;
}

export interface DialogDataPriceGroup {
  priceGroupDetail: PriceGroupMaster;
}
export enum priceGroupEnum {
  NEW = 'NEW',
  new = 'new',
  edit = 'edit'
}
