import { BrandMaster } from './brand-model';


export interface SubBrandListingPayload {
  pageEvent: any;
  parentBrandCode: string;
}

export interface SubBrandMaster {
  brandCode: string;
  description: string;
  configDetails: any;
}
export enum subBrandEnum {
  NEW = 'NEW',
  new = 'new',
  edit = 'edit'
}

export interface SearchPayload {
  brandCode: string,
  parentBrandCode: string
}
export interface DialogDataSubbrand {
  subBrandDetails: BrandMaster
  parentBrandDetails: BrandMaster[]
}