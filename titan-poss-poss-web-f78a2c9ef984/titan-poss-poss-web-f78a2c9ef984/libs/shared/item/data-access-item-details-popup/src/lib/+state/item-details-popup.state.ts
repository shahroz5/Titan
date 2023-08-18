import { CustomErrors, ItemStoneDetails } from '@poss-web/shared/models';

export interface ItemDetailsPopupState {
  stoneDetails: ItemStoneDetails[];
  error: CustomErrors;
  isLoading: boolean;
  productCategoryDesc: {};
  productGroupDesc: {};
  isDescLoaded: boolean;
  COStoneDetails: ItemStoneDetails[];
}
