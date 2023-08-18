import {
  CustomErrors, ExcludeItemCodes, ExcludeThemeCodes, FileResponse, GepDetails, GEPPurityConfig, Lov, MetalType, ProductGroup, ProductGroupMappingOption, ProductGroupsDeduction, PurityDetailsResponse, Ranges
} from '@poss-web/shared/models';

export interface GEPPurityConfigState {
  totalElements: number;
  GEPPurityConfigList: GEPPurityConfig[];
  isLoading: boolean;
  hasGEPDetailsSaved: boolean;
  error: CustomErrors;
  metalType: MetalType[];
  itemType: Lov[];
  hasPurityDetailsSaved: boolean;
  excludeThemeCodes: ExcludeThemeCodes[];
  excludeItemCodes: ExcludeItemCodes[];
  productGroups: ProductGroup[];
  hasSearched: boolean;
  configId: string;
  hasGroupsSaved: boolean;
  hasGroupsDataUpdated: boolean;
  gepDetails: GepDetails;
  purityDetails: PurityDetailsResponse[];
  productGroupsDeduction: ProductGroupsDeduction[];
  hasThemeCodeSaved: boolean;
  hasThemeCodeRemoved: boolean;
  hasProductGroupRemoved: boolean;
  errorLog: any;
  fileResponse: FileResponse;
  productGroupsCount: number;
  hasUpdateToggleButton: boolean;
  goldRanges: Ranges[];
  silverRanges: Ranges[];
  platinumRanges: Ranges[];
  location: Location[];
  allSelectedGroups: ProductGroupMappingOption[];
}
