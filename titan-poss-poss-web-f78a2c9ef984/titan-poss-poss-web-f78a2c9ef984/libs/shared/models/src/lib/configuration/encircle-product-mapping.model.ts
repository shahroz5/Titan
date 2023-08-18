export interface EncircleProductGroupMappingSavePayload {
  savePayload: {
    addProductGroupCode: string[];
    removeProductMappingIds: string[];
  };
  paymentCategoryName: string;
}
export interface EncircleProductGroupMappings {
  id: string;
  paymentCategoryName: string;
  productGroupCode: string;
}
export interface ProductGroupResponse {
  productGroupCode: string;
  description: string;
}
