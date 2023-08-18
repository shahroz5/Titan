import { EventEmitter } from '@angular/core';

export interface ProductGroupMappingConfig {
  selectedProductGroup: ProductGroupMappingOption[];
  allProductGroup: { id: string; description: string }[];
  isViewMode?: boolean;
  viewModeLabel?: string;
}

export interface ProductGroupMappingWithFormConfig {
  selectedProductGroup?: ProductGroupMappingOption[];
  formType: ProductGroupMappingFormType;
  formData?: any;
  publishTabEnable?: boolean;
  publishedProductGroup?: PublishedProductGroupMappingOption[];
}

export interface ProductGroupMappingOption {
  id: string;
  uuid?: string;
  description?: string;
  isActive?: boolean;
  isDeletable?: boolean;
}

export interface PublishedProductGroupMappingOption {
  id: string;
  uuid?: string;
  description?: string;
  isActive?: boolean;
}

export interface ProductGroupMappingResponse {
  response: ProductGroupMappingOption[];
  totalElements: number;
}

export interface SelectableProductGroup {
  id: string;
  description?: string;
  isSelected?: boolean;
}
export interface ProductGroupMappingApplyResponse {
  selectedProductGroups: ProductGroupMappingOption[];
  addedProductGroups: ProductGroupMappingOption[];
  removeProductGroups: ProductGroupMappingOption[];
}
export interface RivaahExchangeConfig {
  rivaahAdditionalDiscount?: any;
}
export interface ProductGroupMappingWithFromApplyResponse {
  prouctGroups: ProductGroupMappingApplyResponse;
  config: any;
}

export interface ProductGroupMappingServiceConfig {
  selectedProductGroup?: ProductGroupMappingOption[];
  isViewMode?: boolean;
  viewModeLabel?: string;
  formType?: ProductGroupMappingFormType;
}

export abstract class ProductGroupMappingServiceAbstraction {
  public abstract open(
    serviceConfig: ProductGroupMappingServiceConfig
  ): EventEmitter<ProductGroupServiceResponse>;
  public abstract openProductGroupMappingWithForm(
    serviceConfig: ProductGroupMappingWithFormConfig
  ): EventEmitter<ProductGroupWithFormServiceResponse>;
}

export interface ProductGroupServiceResponse {
  type: string;
  data?: ProductGroupMappingApplyResponse;
}

export interface ProductGroupWithFormServiceResponse {
  type: string;
  data?: ProductGroupMappingWithFromApplyResponse;
}

export enum ProductGroupMappingFormType {
  DISCOUNT = 'DISCOUNT',
  ADD_DEDUCTION = 'DEDUCTION',
  EXCHANGE_OFFER_DISCOUNT = 'EXCHANGEOFFERDISCOUNT',
  TEP_PRODUCT_GROUP_CONFIG_MAPPING = 'TEPPRODUCTGROUPCONFIGMAPPING',
  WEIGHT_TOLERANCE = 'WEIGHT_TOLERANCE',
  AB_ORDER_PAYMENT_CONFIG = 'AB_ORDER_PAYMENT_CONFIG',
  CO_ORDER_PAYMENT_CONFIG = 'CO_ORDER_PAYMENT_CONFIG',
  PUBLISH_TAB = 'PUBLISH_TAB'
}
