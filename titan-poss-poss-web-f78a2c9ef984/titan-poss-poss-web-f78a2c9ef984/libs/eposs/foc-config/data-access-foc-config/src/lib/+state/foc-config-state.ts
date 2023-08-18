import {
  CustomErrors,
  SchemeDetails,
  ValueBasedVariantDetails,
  WeightBasedVariantDetails,
  ProductGroupMappingOption,
  FocLocationList,
  FOCItemCodes,
  FocTypeState
} from '@poss-web/shared/models';

export interface FocConfigurationState {
  focConfigList: SchemeDetails[];
  schemeDetails: SchemeDetails;
  schemeDetailsById: SchemeDetails;
  error: CustomErrors;
  hasSaved: boolean;
  hasUpdated: boolean;
  isLoading: boolean;
  totalElements: number;
  rangeWeight: string[];
  focItems: string[];
  productGroups: ProductGroupMappingOption[];
  locationList: FocLocationList[];
  isLocationUpdated: boolean;
  valueBasedVariantDetails: ValueBasedVariantDetails[];
  valueBasedVariantDetailsGoldStandard: ValueBasedVariantDetails[];
  valueBasedVariantDetailsGoldSlab: ValueBasedVariantDetails[];
  valueBasedVariantDetailsOthersStandard: ValueBasedVariantDetails[];
  valueBasedVariantDetailsOthersSlab: ValueBasedVariantDetails[];
  weightBasedVariantDetails: WeightBasedVariantDetails[];
  weightBasedVariantDetailsGoldStandard: WeightBasedVariantDetails[];
  weightBasedVariantDetailsGoldSlab: WeightBasedVariantDetails[];
  weightBasedVariantDetailsOthersStandard: WeightBasedVariantDetails[];
  weightBasedVariantDetailsOthersSlab: WeightBasedVariantDetails[];
  itemCodes: FOCItemCodes[];
  hasSavedFocItems: boolean;
  mappedFocItems: FOCItemCodes[];
  totalFocItems: number;
  hasProductsUpdated: boolean;
  loadMappedProdcutGroup: boolean;
  totalLocation: number;
  isPublished: boolean;
  allSelectedItemCodes: FOCItemCodes[];
  allSelectedLocationCodes: FocLocationList[];
  focTypeSate: FocTypeState;
}
