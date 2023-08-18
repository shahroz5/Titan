import {
  CustomErrors,
  LocationPriceGroupMappingList,
  LocationSummaryList,
  Lov
} from '@poss-web/shared/models';
import { PriceGroupMasterEntity } from './price-group-mapping.entity';

export interface PriceGroupMappingState {
  priceGrouplist: PriceGroupMasterEntity;
  priceGroupTotalElements: number;
  priceGroupTypelist: Lov[];
  locationList: LocationSummaryList[];
  locationPriceGroupMappingList: LocationPriceGroupMappingList[];
  error: CustomErrors;
  isLoading: boolean;
  hasSaved: boolean;
}
