import {
  CustomErrors,
  MappedLocDetails,
  ProductCategory,
  ProductGroup,
  ProductGroupMappingOption,
  RivaahConfigurationResponse,
  RivaahEligibilityConfig,
  RivaahLocationList
} from '@poss-web/shared/models';

export interface RivaahConfigurationState {
  isLoading: boolean;
  hasUpdated: boolean;
  error: CustomErrors;
  isCouponSaved: boolean;
  couponConfig: RivaahConfigurationResponse;
  totalElements: number;
  rivaahEligibilityRes: RivaahEligibilityConfig[];
  isRivaElibilityCreated: boolean;
  isRivaElibilityUpdated: boolean;
  isRivaElibilityDeleted: boolean;
  isRivaElibilityToggled: boolean;
  productGroups: ProductGroupMappingOption[];
  hasProductsUpdated: boolean;
  loadMappedProductGroup: boolean;
  productCategory: ProductCategory[];
  mappedProductCategory: ProductCategory[];
  rivaahLocations: RivaahLocationList[],
  locationCount: number,
  savedLocations: boolean,
  updatedLocations: boolean,
  deletedLocations: boolean,
  selectedLocations: MappedLocDetails[],
}
