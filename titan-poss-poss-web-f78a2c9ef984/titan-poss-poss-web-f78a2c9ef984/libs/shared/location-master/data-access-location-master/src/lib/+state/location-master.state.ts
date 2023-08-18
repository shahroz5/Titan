import {
  BaseCurrencyTypes,
  BrandSummary,
  CurrencyTypes,
  CustomErrors,
  LocationCFAType,
  LocationMasterDetails,
  LocationMasterDropdownList,
  LocationTypes,
  MarketCodeTypes,
  OwnerTypes,
  RegionSummary,
  StateTypes,
  Towns
} from '@poss-web/shared/models';

import { LocationListingEntity } from './location-master.entity';

export interface LocationMasterState {
  locationListing: LocationListingEntity;
  locationDetails: LocationMasterDetails;
  locationTypes: LocationTypes;
  towns: Towns[];
  stateTypes: StateTypes[];
  locationSize: StateTypes[];
  invoicetype: StateTypes[];
  refundMode: StateTypes[];
  ownerInfo: OwnerTypes;
  regions: LocationMasterDropdownList[];
  subRegions: RegionSummary[];
  brands: LocationMasterDropdownList[];
  subBrands: BrandSummary[];
  marketTypes: MarketCodeTypes;
  baseCurrencyTypes: BaseCurrencyTypes[];
  currencyTypes: CurrencyTypes[];
  LocationCFATypes: LocationCFAType[];
  isSaved: boolean;
  error: CustomErrors;
  isCopySuccess: boolean;
  isLoading: boolean;
  totalCount: number;
  countryCode: { id: string; name: string }[];
}
