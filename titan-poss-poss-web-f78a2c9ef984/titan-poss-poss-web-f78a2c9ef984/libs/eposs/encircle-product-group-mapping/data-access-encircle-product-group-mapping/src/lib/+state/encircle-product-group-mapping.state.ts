import {
  CustomErrors,
  ProductGroupMappingOption,
  ProductGroup
} from '@poss-web/shared/models';

export interface EncircleProductGroupMappingState {
  error: CustomErrors;
  isLoading: boolean;
  hasSaved: boolean;
  selectedProductGroups: ProductGroupMappingOption[];
  hasRemoved: boolean;
  productGroups: ProductGroup[];
  totalElements: number;
  allSelectedGroups: ProductGroupMappingOption[];
}
