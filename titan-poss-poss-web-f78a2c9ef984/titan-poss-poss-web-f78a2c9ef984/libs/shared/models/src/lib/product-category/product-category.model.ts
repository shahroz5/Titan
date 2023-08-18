export interface ProductCategoryDetails {
  productCategoryCode: string;
  description: string;
  isActive: boolean;
  orgCode: string;
  hallmarkDetails: ProductCategoryHallmarkDetails;
  isConversionEnabled: boolean;
  hallmarkQuantity?: number;
}

export interface ProductCategory2 {
  productCategoryCode: string;
  description: string;
}

export enum ProductCategoryEnum {
  NEW = 'NEW',
  new = 'new',
  edit = 'edit'
}

// Action interface
export interface LoadProductCategoryListingPayload {
  pageIndex: number;
  pageSize: number;
}

export interface LoadProductCategoryListingSuccessPayload {
  productCategoryListing: ProductCategory2[];
  totalElements: number;
}

export interface SaveProductCategoryFormDetailsPayload {
  productCategoryCode: string;
  description: string;
  orgCode: string;
  isActive: boolean;
  hallmarkDetails: ProductCategoryHallmarkDetails;
  isConversionEnabled: boolean;
  hallmarkQuantity?: number;
}

export interface ProductCategoryHallmarkDetails {
  type: string;
  data: ProductCategoryHallmarkDetailsData;
}

export interface ProductCategoryHallmarkDetailsData {
  isAllowedForHallmarking: boolean;
  hallmarkingCharges: string;
  isFOCForHallmarkingCharges: boolean;
}
