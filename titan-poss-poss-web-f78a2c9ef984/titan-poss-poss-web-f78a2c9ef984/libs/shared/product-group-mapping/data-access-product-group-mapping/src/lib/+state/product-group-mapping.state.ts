import { ProductGroup, CustomErrors } from '@poss-web/shared/models';

export interface ProductGroupMappingState {
  productGroups: ProductGroup[];
  error: CustomErrors;
  isLoading: boolean;
}
