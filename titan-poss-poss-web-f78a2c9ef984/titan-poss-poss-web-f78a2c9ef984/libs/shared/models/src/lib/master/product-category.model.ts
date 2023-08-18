export interface ProductCategory {
  description: string;
  productCategoryCode: string;
  isActive?: boolean;
}

export interface ProductCategoryMaster {
  configDetails: {};
  description: string;
  isActive: boolean;
  orgCode: string;
  productCategoryCode: string;
}
