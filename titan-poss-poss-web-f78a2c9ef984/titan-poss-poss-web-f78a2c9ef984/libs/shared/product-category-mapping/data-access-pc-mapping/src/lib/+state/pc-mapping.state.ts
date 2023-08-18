import { CustomErrors, ProductCategory } from '@poss-web/shared/models';

export interface ProductCategoryMappingState {
  productCategory: ProductCategory[];
  error: CustomErrors;
  isLoading: boolean;
}
