export interface ProductCategoryMappingList {
  cutPieceTepPercent: number;
  productCategoryCode: string;
  id: string;
  description?: string;
}

export interface ProductCategoryMapping {
  payload: {
    addProductCategories: any;
    updateProductCategories: any;
    removeProductCategories: string[];
  };
  configId: string;
}
