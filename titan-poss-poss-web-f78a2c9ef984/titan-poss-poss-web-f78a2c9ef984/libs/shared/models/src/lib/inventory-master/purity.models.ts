import { MaterialType } from './metal-type';

export interface Purity {
  id?: string;
  description: string;
  karat?: string;
  materialCode: string;
  offset: string;
  purity: string;
  isActive?: boolean;
  isDisplayed?: boolean;
}

export interface PurityListPayload {
  pageIndex: number;
  pageSize: number;
  length: number;
}
export interface PurityListResult {
  purityList: Purity[];
  totalElements: number;
}
export interface CreatePurityPayload {
  description: string;
  karat: string;
  itemTypeCode: string;
  offset: string;
  purity: string;
  isActive: boolean;
  isDisplayed?: boolean;
}

export interface UpdatePurityPayload {
  id: number;
  data: any;
}

export interface DialogDataPurity {
  purity: Purity;
  materialTypes: MaterialType[];
}
export enum purityEnum {
  NEW = 'NEW',
  new = 'new',
  edit = 'edit'
}
