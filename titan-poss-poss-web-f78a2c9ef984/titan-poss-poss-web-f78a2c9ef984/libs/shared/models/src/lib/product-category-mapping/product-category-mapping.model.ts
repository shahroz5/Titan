import { EventEmitter } from '@angular/core';

export interface ProductCategoryMappingConfig {
  selectedProductCategory: ProductCategoryMappingOption[];
}

export interface ProductCategoryMappingOption {
  id: string;
  uuid?: string;
  description?: string;
}

export interface ProductCategoryMappingResponse {
  response: ProductCategoryMappingOption[];
  totalElements: number;
}

export interface SelectableProductCategory {
  id: string;
  description?: string;
  isSelected?: boolean;
}
export interface ProductCategoryMappingApplyResponse {
  selectedProductCategories: ProductCategoryMappingOption[];
  addedProductCategories: ProductCategoryMappingOption[];
  removeProductCategories: ProductCategoryMappingOption[];
}

export interface ProductCategoryMappingServiceConfig {
  selectedProductCategory: ProductCategoryMappingOption[];
}

export abstract class ProductCategoryMappingServiceAbstraction {
  public abstract open(
    serviceConfig: ProductCategoryMappingServiceConfig
  ): EventEmitter<ProductCategoryServiceResponse>;

  public abstract openProductCategoryMappingWithForm(
    serviceConfig: ProductCategoryMappingWithFormConfig
  ): EventEmitter<ProductCategoryWithFormServiceResponse>;
}

export interface ProductCategoryWithFormServiceResponse {
  type: string;
  data?: ProductCategoryMappingWithFromApplyResponse;
}
export interface ProductCategoryMappingWithFromApplyResponse {
  productCategories: ProductCategoryMappingApplyResponse;
  config: any;
}

export interface ProductCategoryServiceResponse {
  type: string;
  data?: ProductCategoryMappingApplyResponse;
}
export interface ProductCategoryMappingWithFormConfig {
  selectedProductCategories?: ProductCategoryMappingOption[];
  formType: ProductCategoryMappingFormType;
  formData?: any;
  publishTabEnable?: boolean;
  publishedProductCategory?: PublishedProductCategoryMappingOption[];
}

export interface PublishedProductCategoryMappingOption {
  id: string;
  uuid?: string;
  description?: string;
  isActive?: boolean;
}

export enum ProductCategoryMappingFormType {
  CUT_PIECE = 'CUT_PIECE',
  PUBLISH_TAB = 'PUBLISH_TAB'
}
