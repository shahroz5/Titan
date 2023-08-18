export interface UcpMarketCode {
  id: string;
  marketCode: string;
  ucpFactor: string;
  ucpCfa: string;
}
export interface UcpMarketCodeListPayload {
  pageIndex: number;
  pageSize: number;
}

export interface UcpMarketCodeListing {
  results: UcpMarketCode[];
  totalElements: number;
}

export interface UpdateUcpMarketCodePayload {
  id: string;
  data: any;
}
export interface SaveUcpMarketCodePayload {
  marketCode: string;
  markupFactor: number;
  productGroupCode: string;
}

// export interface DialogDataPriceGroup {
//   priceGroupDetail: PriceGroupMaster;
// }
export enum ucpMarketCodeEnum {
  new = 'new',
  edit = 'edit'
}

export interface MarketCode {
  id: string;
  name: string;
}
export interface UcpProductGroup {
  id: string;
  name: string;
}
