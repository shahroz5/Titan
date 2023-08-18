import {
  PriceGroupMaster,
  CustomErrors,
} from '@poss-web/shared/models';
import { PriceGroupEntity } from './price-group-entity';

export interface PriceGroupState {
  priceGroupList: PriceGroupEntity;
  priceGroup: PriceGroupMaster;
  isloading: boolean;
  error: CustomErrors;
  totalElements: number;
  hasSaved: boolean;
  hasUpdated: boolean;
}
