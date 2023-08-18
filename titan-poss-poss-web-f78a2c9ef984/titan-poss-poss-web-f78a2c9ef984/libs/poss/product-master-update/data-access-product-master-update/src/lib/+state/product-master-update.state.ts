import { CustomErrors } from '@poss-web/shared/models';

export const ProductMasterUpdateKey = 'product-master-update';

export class ProductMasterUpdateState {
  updateResponse: any;
  errors?: CustomErrors;
  isLoading?: boolean;
}
