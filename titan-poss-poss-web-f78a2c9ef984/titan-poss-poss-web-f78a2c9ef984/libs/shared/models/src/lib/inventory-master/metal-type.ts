import { ProductGroup } from '../master/product-group.model';

export enum materialTypeEnum {
  NEW = 'NEW',
  new = 'new',
  edit = 'edit'
}

export interface MaterialType {
  materialCode?: string;
  description?: string;
  isActive?: boolean;
}
export interface DialogDataMaterialType {
  materialType: MaterialType;
}
export interface CFAProduct {
  id: string;
  description: string;
}

export interface ProductCodeListPayload {
  productGroup: ProductGroup[];
  totalProductGroup: number;
}
export interface UpdateMetalTypePayload {
  materialTypeCode: string;
  data: any;
}
export interface CreateMetalTypePayload {
  materialTypeCode: string;
  description: string;
  isActive: true;
  orgCode: string;
}
export interface MetalTypePayload {
  pageIndex: number;
  pageSize: number;
}

export interface MetalTypeListing {
  results: MaterialType[];
  totalElements: number;
}

export interface MaterialTypelov {
  code: string;
  value: string;
}
