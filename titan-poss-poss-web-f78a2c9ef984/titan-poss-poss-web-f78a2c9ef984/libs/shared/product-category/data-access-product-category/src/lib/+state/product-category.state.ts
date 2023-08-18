import { CustomErrors, ProductCategory, ProductCategoryDetails } from '@poss-web/shared/models';



export interface ProductCategoryState {
    error: CustomErrors;
    productCategoryListing: ProductCategory[];
    productCategoryDetails: ProductCategoryDetails;
    totalProductCategoryDetails: number;
    isLoading: boolean;
    saveProductCategoryResponses: ProductCategory;
    editProductCategoryResponses: ProductCategory;

}
