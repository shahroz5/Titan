import {
  CustomErrors,
  ProductCategory,
  ProductCategoryMappingList
} from '@poss-web/shared/models';

export interface CutPieceConfigState {
  error: CustomErrors;
  isLoading: boolean;
  configId: string;
  hasSaved: boolean;
  cutPieceConfigList: ProductCategoryMappingList[];
  totalElements: number;
  productCategories: ProductCategory[];
  allSelectedCategories: ProductCategoryMappingList[];
}
