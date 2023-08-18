import { Action } from '@ngrx/store';
import {
  CustomErrors,
  FocConfigurationListPayload,
  FocConfigurationList,
  SchemeDetails,
  SaveVariantDetailsPayload,
  VariantDetails,
  LoadProductGroupPayload,
  SaveProductGroup,
  ProductGroupMappingOption,
  SaveLocationPayload,
  FOCItemCodesPayload,
  FOCItemCodes,
  FocItemsSavePayload,
  FocItemsPayload,
  FocItemsResponse,
  FocLocationListPayload,
  LocationListSuccessPayload,
  FocTypeRequestPaylaod
} from '@poss-web/shared/models';

export enum FocConfigurationActionTypes {
  LOAD_FOC_CONFIGURATION_LIST = '[foc-configuration] Load foc Configuration List',
  LOAD_FOC_CONFIGURATION_LIST_SUCCESS = '[foc-configuration] Load Foc Configuration List Success',
  LOAD_FOC_CONFIGURATION_LIST_FAILURE = '[foc-configuration] Load Foc Configuration List Failure',

  UPDATE_FOC_SCHEME_CONFIGURATION = '[foc-configuration] Update Foc Scheme Configuration ',
  UPDATE_FOC_SCHEME_CONFIGURATION_SUCCESS = '[foc-configuration] Update Foc Scheme Configuration Success ',
  UPDATE_FOC_SCHEME_CONFIGURATION_FAILURE = '[foc-configuration] Update Foc Scheme Configuration Failure ',

  SAVE_FOC_SCHEME_CONFIGURATION = '[foc-configuration] Save Foc Scheme Configuration ',
  SAVE_FOC_SCHEME_CONFIGURATION_SUCCESS = '[foc-configuration] Save Foc Scheme Configuration Success ',
  SAVE_FOC_SCHEME_CONFIGURATION_FAILURE = '[foc-configuration] Save Foc Scheme Configuration Failure ',

  SEARCH_CONFIG_BY_SCHEME_NAME = '[foc-configuration] Search Config by Scheme Name',
  SEARCH_CONFIG_BY_SCHEME_NAME_SUCCESS = '[foc-configuration] Search Config by Scheme Name Success',
  SEARCH_CONFIG_BY_SCHEME_NAME_FAILURE = '[foc-configuration] Search Config by Scheme Name Failure',

  LOAD_FOC_SCHEME_CONFIGURATION_BY_CONFIG_ID = '[foc-configuration] Load Foc Scheme Configuration By Config Id',
  LOAD_FOC_SCHEME_CONFIGURATION_BY_CONFIG_ID_SUCCESS = '[foc-configuration] Load Foc Scheme Configuration By Config Id Success',
  LOAD_FOC_SCHEME_CONFIGURATION_BY_CONFIG_ID_FAILURE = '[foc-configuration] Load Foc Scheme Configuration By Config Id Failure',

  LOAD_MAPPED_PRODUCT_GROUPS_BY_CONFIG_ID = '[foc-configuration] Load Mapped Product group By Config Id',
  LOAD_MAPPED_PRODUCT_GROUPS_BY_CONFIG_ID_SUCCESS = '[foc-configuration] Load Mapped Product group Mapping By Config Id  Success',
  LOAD_MAPPED_PRODUCT_GROUPS_BY_CONFIG_ID_FAILURE = '[foc-configuration] Load Mapped Product group By Confif Id Failure',

  UPDATE_PRODUCT_GROUPS_BY_CONFIG_ID = '[foc-configuration] Update Product Groups By Config Id',
  UPDATE_PRODUCT_GROUPS_BY_CONFIG_ID_SUCCESS = '[foc-configuration] Update Product Groups  By Config Id  Success',
  UPDATE_PRODUCT_GROUPS_BY_CONFIG_ID_FAILURE = '[foc-configuration] Update Product Groups By Confif Id Failure',

  SAVE_VARIANT_DETAILS = '[foc-configuration] Save Variant Details  ',
  SAVE_VARIANT_DETAILS_SUCCESS = '[foc-configuration] Save Variant Details Success ',
  SAVE_VARIANT_DETAILS_FAILURE = '[foc-configuration] Save Variant Details Failure ',

  LOAD_VARIANT_DEATAILS_BY_ID = '[foc-configuration] Load Variant Details By Id',
  LOAD_VARIANT_DEATAILS_BY_ID_SUCCESS = '[foc-configuration] Load Variant Details By Id Success',
  LOAD_VARIANT_DEATAILS_BY_ID_FAILURE = '[foc-configuration] Load Variant Details By Id Failure',

  LOAD_RANGE_WEIGHT = '[foc-configuration] Load Range Weight',
  LOAD_RANGE_WEIGHT_SUCCESS = '[foc-configuration] Load Range Weight Success',
  LOAD_RANGE_WEIGHT_FAILURE = '[foc-configuration] Load Range Weight Failre',

  LOAD_MAPPED_LOCATIONS_BY_ID = '[foc-configuration] Load Mapped Location By Id',
  LOAD_MAPPED_LOCATIONS_BY_ID_SUCCESS = '[foc-configuration]  Load Mapped Location By Id Success',
  LOAD_MAPPED_LOCATIONS_BY_ID_FAILURE = '[foc-configuration] Load Mapped Location By Id Failure',

  UPDATE_LOCATIONS_BY_ID = '[foc-configuration] Update Locations By Id',
  UPDATE_LOCATIONS_BY_ID_SUCCESS = '[foc-configuration] Update Locations By Id Success',
  UPDATE_LOCATIONS_BY_ID_FAILURE = '[foc-configuration] Update Locations By Id Failure',

  LOAD_RESET = '[foc-configuration] Load Reset',
  LOAD_FOC_TYPE_STATE = '[foc-configuration] Load Foc Type State',

  LOAD_FOC_ITEM_CODES = '[foc-configuration] Load Foc Item Codes',
  LOAD_FOC_ITEM_CODES_SUCCESS = '[foc-configuration] Load Foc Item Codes Success',
  LOAD_FOC_ITEM_CODES_FAILURE = '[foc-configuration] Load Foc Item Codes Failure',

  LOAD_MAPPED_FOC_ITEMS_BY_ID = '[foc-configuration] Load Mapped Foc Items By Id',
  LOAD_MAPPED_FOC_ITEMS_BY_ID_SUCCESS = '[foc-configuration] Load Load Mapped Foc Items By Id Success',
  LOAD_MAPPED_FOC_ITEMS_BY_ID_FAILURE = '[foc-configuration] Load Mapped Foc Items By Id Failure',

  SAVE_FOC_ITEMS = '[foc-configuration] Save Foc Items  ',
  SAVE_FOC_ITEMS_SUCCESS = '[foc-configuration]  Save Foc Items Success ',
  SAVE_FOC_ITEMS_FAILURE = '[foc-configuration]  Save Foc Items Failure ',

  SEARCH_FOC_ITEM = '[foc-configuration] Search Foc Item',
  SEARCH_FOC_ITEM_SUCCESS = '[foc-configuration] Search Foc Item Success',
  SEARCH_FOC_ITEM_FAILURE = '[foc-configuration]  Search Foc Item Failure',

  SEARCH_LOCATION_CODE = '[foc-configuration] Search Location Code',
  SEARCH_LOCATION_CODE_SUCCESS = '[foc-configuration] Search Location Code Success',
  SEARCH_LOCATION_CODE_FAILURE = '[foc-configuration]  Search Location Code Failure',

  PUBLISH_FOC_SCHEME = '[foc-configuration] Publish Foc Scheme',
  PUBLISH_FOC_SCHEME_SUCCESS = '[foc-configuration] Publish Foc Scheme Success',
  PUBLISH_FOC_SCHEME_FAILURE = '[foc-configuration]  Publish Foc Scheme Failure',

  //View specific
  LOAD_VARIANT_DEATAILS_VALUE_GOLD_STANDARD_BY_ID = '[foc-configuration] Load Variant Details Value Gold Standard By Id',
  LOAD_VARIANT_DEATAILS_VALUE_GOLD_STANDARD_BY_ID_SUCCESS = '[foc-configuration] Load Variant Details Value Gold Standard By Id Success',
  LOAD_VARIANT_DEATAILS_VALUE_GOLD_STANDARD_BY_ID_FAILURE = '[foc-configuration] Load Variant Details Value Gold Standard By Id Failure',
  LOAD_VARIANT_DEATAILS_VALUE_GOLD_SLAB_BY_ID = '[foc-configuration] Load Variant Details Value Gold Slab By Id',
  LOAD_VARIANT_DEATAILS_VALUE_GOLD_SLAB_BY_ID_SUCCESS = '[foc-configuration] Load Variant Details Value Gold Slab By Id Success',
  LOAD_VARIANT_DEATAILS_VALUE_GOLD_SLAB_BY_ID_FAILURE = '[foc-configuration] Load Variant Details Value Gold Slab By Id Failure',

  LOAD_VARIANT_DEATAILS_VALUE_OTHERS_STANDARD_BY_ID = '[foc-configuration] Load Variant Details Value Others Standard By Id',
  LOAD_VARIANT_DEATAILS_VALUE_OTHERS_STANDARD_BY_ID_SUCCESS = '[foc-configuration] Load Variant Details Value Others Standard By Id Success',
  LOAD_VARIANT_DEATAILS_VALUE_OTHERS_STANDARD_BY_ID_FAILURE = '[foc-configuration] Load Variant Details Value Others Standard By Id Failure',
  LOAD_VARIANT_DEATAILS_VALUE_OTHERS_SLAB_BY_ID = '[foc-configuration] Load Variant Details Value Others Slab By Id',
  LOAD_VARIANT_DEATAILS_VALUE_OTHERS_SLAB_BY_ID_SUCCESS = '[foc-configuration] Load Variant Details Value Others Slab By Id Success',
  LOAD_VARIANT_DEATAILS_VALUE_OTHERS_SLAB_BY_ID_FAILURE = '[foc-configuration] Load Variant Details Value Others Slab By Id Failure',

  LOAD_VARIANT_DEATAILS_WEIGHT_GOLD_STANDARD_BY_ID = '[foc-configuration] Load Variant Details Weight Gold Standard By Id',
  LOAD_VARIANT_DEATAILS_WEIGHT_GOLD_STANDARD_BY_ID_SUCCESS = '[foc-configuration] Load Variant Details Weight Gold Standard By Id Success',
  LOAD_VARIANT_DEATAILS_WEIGHT_GOLD_STANDARD_BY_ID_FAILURE = '[foc-configuration] Load Variant Details Weight Gold Standard By Id Failure',
  LOAD_VARIANT_DEATAILS_WEIGHT_GOLD_SLAB_BY_ID = '[foc-configuration] Load Variant Details Weight Gold Slab By Id',
  LOAD_VARIANT_DEATAILS_WEIGHT_GOLD_SLAB_BY_ID_SUCCESS = '[foc-configuration] Load Variant Details Weight Gold Slab By Id Success',
  LOAD_VARIANT_DEATAILS_WEIGHT_GOLD_SLAB_BY_ID_FAILURE = '[foc-configuration] Load Variant Details Weight Gold Slab By Id Failure',

  LOAD_VARIANT_DEATAILS_WEIGHT_OTHERS_STANDARD_BY_ID = '[foc-configuration] Load Variant Details Weight Others Standard By Id',
  LOAD_VARIANT_DEATAILS_WEIGHT_OTHERS_STANDARD_BY_ID_SUCCESS = '[foc-configuration] Load Variant Details Weight Others Standard By Id Success',
  LOAD_VARIANT_DEATAILS_WEIGHT_OTHERS_STANDARD_BY_ID_FAILURE = '[foc-configuration] Load Variant Details Weight Others Standard By Id Failure',
  LOAD_VARIANT_DEATAILS_WEIGHT_OTHERS_SLAB_BY_ID = '[foc-configuration] Load Variant Details Weight Others Slab By Id',
  LOAD_VARIANT_DEATAILS_WEIGHT_OTHERS_SLAB_BY_ID_SUCCESS = '[foc-configuration] Load Variant Details Weight Others Slab By Id Success',
  LOAD_VARIANT_DEATAILS_WEIGHT_OTHERS_SLAB_BY_ID_FAILURE = '[foc-configuration] Load Variant Details Weight Others Slab By Id Failure',

  LOAD_ALL_SELECTED_ITEM_CODES = '[foc-configuration] Load All Selected Item Codes',
  LOAD_ALL_SELECTED_ITEM_CODES_SUCCESS = '[foc-configuration] Load All Selected Item Codes Success',
  LOAD_ALL_SELECTED_ITEM_CODES_FAILURE = '[foc-configuration] Load All Selected Item Codes Failure',

  LOAD_ALL_SELECTED_LOCATION_CODES = '[foc-configuration] Load All Selected LocationCodes',
  LOAD_ALL_SELECTED_LOCATION_CODES_SUCCESS = '[foc-configuration] Load All Selected LocationCodes Success',
  LOAD_ALL_SELECTED_LOCATION_CODES_FAILURE = '[foc-configuration] Load All Selected LocationCodes Failure'
  //View specific ends
}

export class PublishFocScheme implements Action {
  readonly type = FocConfigurationActionTypes.PUBLISH_FOC_SCHEME;
  constructor(public payload: string) {}
}

export class PublishFocSchemeSuccesss implements Action {
  readonly type = FocConfigurationActionTypes.PUBLISH_FOC_SCHEME_SUCCESS;
}
export class PublishFocSchemeFailure implements Action {
  readonly type = FocConfigurationActionTypes.PUBLISH_FOC_SCHEME_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadRangeWeight implements Action {
  readonly type = FocConfigurationActionTypes.LOAD_RANGE_WEIGHT;
}

export class LoadRangeWeightSuccesss implements Action {
  readonly type = FocConfigurationActionTypes.LOAD_RANGE_WEIGHT_SUCCESS;
  constructor(public payload: string[]) {}
}
export class LoadRangeWeightFailure implements Action {
  readonly type = FocConfigurationActionTypes.LOAD_RANGE_WEIGHT_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadLocationById implements Action {
  readonly type = FocConfigurationActionTypes.LOAD_MAPPED_LOCATIONS_BY_ID;
  constructor(public payload: FocLocationListPayload) {}
}
export class LoadLocationByIdSuccess implements Action {
  readonly type =
    FocConfigurationActionTypes.LOAD_MAPPED_LOCATIONS_BY_ID_SUCCESS;
  constructor(public payload: LocationListSuccessPayload) {}
}

export class LoadLocationByIdFailure implements Action {
  readonly type =
    FocConfigurationActionTypes.LOAD_MAPPED_LOCATIONS_BY_ID_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class UpdateLocationById implements Action {
  readonly type = FocConfigurationActionTypes.UPDATE_LOCATIONS_BY_ID;
  constructor(public payload: SaveLocationPayload) {}
}
export class UpdateLocationByIdSuccess implements Action {
  readonly type = FocConfigurationActionTypes.UPDATE_LOCATIONS_BY_ID_SUCCESS;
}

export class UpdateLocationByIdFailure implements Action {
  readonly type = FocConfigurationActionTypes.UPDATE_LOCATIONS_BY_ID_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadFocConfigurationList implements Action {
  readonly type = FocConfigurationActionTypes.LOAD_FOC_CONFIGURATION_LIST;
  constructor(
    public payload: FocConfigurationListPayload,
    public searchValue?: string
  ) {}
}
export class LoadFocConfigurationListSuccess implements Action {
  readonly type =
    FocConfigurationActionTypes.LOAD_FOC_CONFIGURATION_LIST_SUCCESS;
  constructor(public payload: FocConfigurationList) {}
}

export class LoadFocConfigurationListFailure implements Action {
  readonly type =
    FocConfigurationActionTypes.LOAD_FOC_CONFIGURATION_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SaveFocSchemeConfiguration implements Action {
  readonly type = FocConfigurationActionTypes.SAVE_FOC_SCHEME_CONFIGURATION;
  constructor(public payload: SchemeDetails) {}
}

export class SaveFocSchemeConfigurationSuccess implements Action {
  readonly type =
    FocConfigurationActionTypes.SAVE_FOC_SCHEME_CONFIGURATION_SUCCESS;
  constructor(public payload: SchemeDetails) {}
}
export class SaveFocSchemeConfigurationFailure implements Action {
  readonly type =
    FocConfigurationActionTypes.SAVE_FOC_SCHEME_CONFIGURATION_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class UpdateFocSchemeConfiguration implements Action {
  readonly type = FocConfigurationActionTypes.UPDATE_FOC_SCHEME_CONFIGURATION;
  constructor(public payload: SchemeDetails) {}
}
export class UpdateFocSchemeConfigurationSuccess implements Action {
  readonly type =
    FocConfigurationActionTypes.UPDATE_FOC_SCHEME_CONFIGURATION_SUCCESS;
  constructor(public payload: SchemeDetails) {}
}
export class UpdateFocSchemeConfigurationFailure implements Action {
  readonly type =
    FocConfigurationActionTypes.UPDATE_FOC_SCHEME_CONFIGURATION_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SearchConfigBySchemeName implements Action {
  readonly type = FocConfigurationActionTypes.SEARCH_CONFIG_BY_SCHEME_NAME;
  constructor(public payload: string) {}
}
export class SearchConfigBySchemeNameSuccess implements Action {
  readonly type =
    FocConfigurationActionTypes.SEARCH_CONFIG_BY_SCHEME_NAME_SUCCESS;
  constructor(public payload: FocConfigurationList) {}
}
export class SearchConfigBySchemeNameFailure implements Action {
  readonly type =
    FocConfigurationActionTypes.SEARCH_CONFIG_BY_SCHEME_NAME_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadFocSchemeConfigurationByConfigId implements Action {
  readonly type =
    FocConfigurationActionTypes.LOAD_FOC_SCHEME_CONFIGURATION_BY_CONFIG_ID;
  constructor(public payload: string) {}
}
export class LoadFocSchemeConfigurationByConfigIdSuccess implements Action {
  readonly type =
    FocConfigurationActionTypes.LOAD_FOC_SCHEME_CONFIGURATION_BY_CONFIG_ID_SUCCESS;
  constructor(public payload: SchemeDetails) {}
}
export class LoadFocSchemeConfigurationByConfigIdFailure implements Action {
  readonly type =
    FocConfigurationActionTypes.LOAD_FOC_SCHEME_CONFIGURATION_BY_CONFIG_ID_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadMappedProductGroupsByConfigId implements Action {
  readonly type =
    FocConfigurationActionTypes.LOAD_MAPPED_PRODUCT_GROUPS_BY_CONFIG_ID;
  constructor(public payload: LoadProductGroupPayload) {}
}
export class LoadMappedProductGroupsByConfigIdSuccess implements Action {
  readonly type =
    FocConfigurationActionTypes.LOAD_MAPPED_PRODUCT_GROUPS_BY_CONFIG_ID_SUCCESS;
  constructor(public payload: ProductGroupMappingOption[]) {}
}
export class LoadMappedProductGroupsByConfigIdFailure implements Action {
  readonly type =
    FocConfigurationActionTypes.LOAD_MAPPED_PRODUCT_GROUPS_BY_CONFIG_ID_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class UpdateProductGroupByConfigId implements Action {
  readonly type =
    FocConfigurationActionTypes.UPDATE_PRODUCT_GROUPS_BY_CONFIG_ID;
  constructor(public payload: SaveProductGroup) {}
}
export class UpdateProductGroupByConfigIdSuccess implements Action {
  readonly type =
    FocConfigurationActionTypes.UPDATE_PRODUCT_GROUPS_BY_CONFIG_ID_SUCCESS;
  constructor(public payload: ProductGroupMappingOption[]) {}
}
export class UpdateProductGroupByConfigIdFailure implements Action {
  readonly type =
    FocConfigurationActionTypes.UPDATE_PRODUCT_GROUPS_BY_CONFIG_ID_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SaveVariantDetails implements Action {
  readonly type = FocConfigurationActionTypes.SAVE_VARIANT_DETAILS;
  constructor(public payload: SaveVariantDetailsPayload) {}
}
export class SaveVariantDetailsSuccess implements Action {
  readonly type = FocConfigurationActionTypes.SAVE_VARIANT_DETAILS_SUCCESS;
  constructor(public payload: VariantDetails) {}
}
export class SaveVariantDetailsFailure implements Action {
  readonly type = FocConfigurationActionTypes.SAVE_VARIANT_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadVariantDetailsById implements Action {
  readonly type = FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_BY_ID;
  constructor(public payload: any) {}
}
export class LoadVariantDetailsByIdSuccess implements Action {
  readonly type =
    FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_BY_ID_SUCCESS;
  constructor(public payload: VariantDetails) {}
}
export class LoadVariantDetailsByIdFailure implements Action {
  readonly type =
    FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_BY_ID_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadReset implements Action {
  readonly type = FocConfigurationActionTypes.LOAD_RESET;
}

export class LoadFocTypeState implements Action {
  readonly type = FocConfigurationActionTypes.LOAD_FOC_TYPE_STATE;
  constructor(public payload: FocTypeRequestPaylaod) {}
}

export class LoadFocItemCodes implements Action {
  readonly type = FocConfigurationActionTypes.LOAD_FOC_ITEM_CODES;
  constructor(public payload: FOCItemCodesPayload) {}
}

export class LoadFocItemCodesSuccess implements Action {
  readonly type = FocConfigurationActionTypes.LOAD_FOC_ITEM_CODES_SUCCESS;
  constructor(public payload: FOCItemCodes[]) {}
}
export class LoadFocItemCodesFailure implements Action {
  readonly type = FocConfigurationActionTypes.LOAD_FOC_ITEM_CODES_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class SaveFocItems implements Action {
  readonly type = FocConfigurationActionTypes.SAVE_FOC_ITEMS;
  constructor(public payload: FocItemsSavePayload) {}
}
export class SaveFocItemsSuccess implements Action {
  readonly type = FocConfigurationActionTypes.SAVE_FOC_ITEMS_SUCCESS;
}
export class SaveFocItemsFailure implements Action {
  readonly type = FocConfigurationActionTypes.SAVE_FOC_ITEMS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadMappedFocItemsById implements Action {
  readonly type = FocConfigurationActionTypes.LOAD_MAPPED_FOC_ITEMS_BY_ID;
  constructor(public payload: FocItemsPayload) {}
}
export class LoadMappedFocItemsByIdSuccess implements Action {
  readonly type =
    FocConfigurationActionTypes.LOAD_MAPPED_FOC_ITEMS_BY_ID_SUCCESS;
  constructor(public payload: FocItemsResponse) {}
}
export class LoadMappedFocItemsByIdFailure implements Action {
  readonly type =
    FocConfigurationActionTypes.LOAD_MAPPED_FOC_ITEMS_BY_ID_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class SearchFocItem implements Action {
  readonly type = FocConfigurationActionTypes.SEARCH_FOC_ITEM;
  constructor(public payload: { configId: string; itemCode: string }) {}
}
export class SearchFocItemSuccess implements Action {
  readonly type = FocConfigurationActionTypes.SEARCH_FOC_ITEM_SUCCESS;
  constructor(public payload: FOCItemCodes[]) {}
}
export class SearchFocItemFailure implements Action {
  readonly type = FocConfigurationActionTypes.SEARCH_FOC_ITEM_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SearchLocationCode implements Action {
  readonly type = FocConfigurationActionTypes.SEARCH_LOCATION_CODE;
  constructor(public payload: { configId: string; locationCode: string }) {}
}
export class SearchLocationCodeSuccess implements Action {
  readonly type = FocConfigurationActionTypes.SEARCH_LOCATION_CODE_SUCCESS;
  constructor(public payload: LocationListSuccessPayload) {}
}
export class SearchLocationCodeFailure implements Action {
  readonly type = FocConfigurationActionTypes.SEARCH_LOCATION_CODE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

// View Specific
export class LoadVariantDetailsValueGoldStandardById implements Action {
  readonly type =
    FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_VALUE_GOLD_STANDARD_BY_ID;
  constructor(public payload: any) {}
}
export class LoadVariantDetailsValueGoldStandardByIdSuccess implements Action {
  readonly type =
    FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_VALUE_GOLD_STANDARD_BY_ID_SUCCESS;
  constructor(public payload: VariantDetails) {}
}
export class LoadVariantDetailsValueGoldStandardByIdFailure implements Action {
  readonly type =
    FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_VALUE_GOLD_STANDARD_BY_ID_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadVariantDetailsValueGoldSlabById implements Action {
  readonly type =
    FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_VALUE_GOLD_SLAB_BY_ID;
  constructor(public payload: any) {}
}
export class LoadVariantDetailsValueGoldSlabByIdSuccess implements Action {
  readonly type =
    FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_VALUE_GOLD_SLAB_BY_ID_SUCCESS;
  constructor(public payload: VariantDetails) {}
}
export class LoadVariantDetailsValueGoldSlabByIdFailure implements Action {
  readonly type =
    FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_VALUE_GOLD_SLAB_BY_ID_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadVariantDetailsValueOthersStandardById implements Action {
  readonly type =
    FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_VALUE_OTHERS_STANDARD_BY_ID;
  constructor(public payload: any) {}
}
export class LoadVariantDetailsValueOthersStandardByIdSuccess
  implements Action {
  readonly type =
    FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_VALUE_OTHERS_STANDARD_BY_ID_SUCCESS;
  constructor(public payload: VariantDetails) {}
}
export class LoadVariantDetailsValueOthersStandardByIdFailure
  implements Action {
  readonly type =
    FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_VALUE_OTHERS_STANDARD_BY_ID_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadVariantDetailsValueOthersSlabById implements Action {
  readonly type =
    FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_VALUE_OTHERS_SLAB_BY_ID;
  constructor(public payload: any) {}
}
export class LoadVariantDetailsValueOthersSlabByIdSuccess implements Action {
  readonly type =
    FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_VALUE_OTHERS_SLAB_BY_ID_SUCCESS;
  constructor(public payload: VariantDetails) {}
}
export class LoadVariantDetailsValueOthersSlabByIdFailure implements Action {
  readonly type =
    FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_VALUE_OTHERS_SLAB_BY_ID_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadVariantDetailsWeightGoldStandardById implements Action {
  readonly type =
    FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_WEIGHT_GOLD_STANDARD_BY_ID;
  constructor(public payload: any) {}
}
export class LoadVariantDetailsWeightGoldStandardByIdSuccess implements Action {
  readonly type =
    FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_WEIGHT_GOLD_STANDARD_BY_ID_SUCCESS;
  constructor(public payload: VariantDetails) {}
}
export class LoadVariantDetailsWeightGoldStandardByIdFailure implements Action {
  readonly type =
    FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_WEIGHT_GOLD_STANDARD_BY_ID_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadVariantDetailsWeightGoldSlabById implements Action {
  readonly type =
    FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_WEIGHT_GOLD_SLAB_BY_ID;
  constructor(public payload: any) {}
}
export class LoadVariantDetailsWeightGoldSlabByIdSuccess implements Action {
  readonly type =
    FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_WEIGHT_GOLD_SLAB_BY_ID_SUCCESS;
  constructor(public payload: VariantDetails) {}
}
export class LoadVariantDetailsWeightGoldSlabByIdFailure implements Action {
  readonly type =
    FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_WEIGHT_GOLD_SLAB_BY_ID_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadVariantDetailsWeightOthersStandardById implements Action {
  readonly type =
    FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_WEIGHT_OTHERS_STANDARD_BY_ID;
  constructor(public payload: any) {}
}
export class LoadVariantDetailsWeightOthersStandardByIdSuccess
  implements Action {
  readonly type =
    FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_WEIGHT_OTHERS_STANDARD_BY_ID_SUCCESS;
  constructor(public payload: VariantDetails) {}
}
export class LoadVariantDetailsWeightOthersStandardByIdFailure
  implements Action {
  readonly type =
    FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_WEIGHT_OTHERS_STANDARD_BY_ID_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadVariantDetailsWeightOthersSlabById implements Action {
  readonly type =
    FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_WEIGHT_OTHERS_SLAB_BY_ID;
  constructor(public payload: any) {}
}
export class LoadVariantDetailsWeightOthersSlabByIdSuccess implements Action {
  readonly type =
    FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_WEIGHT_OTHERS_SLAB_BY_ID_SUCCESS;
  constructor(public payload: VariantDetails) {}
}
export class LoadVariantDetailsWeightOthersSlabByIdFailure implements Action {
  readonly type =
    FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_WEIGHT_OTHERS_SLAB_BY_ID_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadAllSelectedItemCodes implements Action {
  readonly type = FocConfigurationActionTypes.LOAD_ALL_SELECTED_ITEM_CODES;
  constructor(public payload: FocItemsPayload) {}
}
export class LoadAllSelectedItemCodesSuccess implements Action {
  readonly type =
    FocConfigurationActionTypes.LOAD_ALL_SELECTED_ITEM_CODES_SUCCESS;
  constructor(public payload: FOCItemCodes[]) {}
}
export class LoadAllSelectedItemCodesFailure implements Action {
  readonly type =
    FocConfigurationActionTypes.LOAD_ALL_SELECTED_ITEM_CODES_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadAllSelectedLocationCodes implements Action {
  readonly type = FocConfigurationActionTypes.LOAD_ALL_SELECTED_LOCATION_CODES;
  constructor(public payload: FocLocationListPayload) {}
}
export class LoadAllSelectedLocationCodesSuccess implements Action {
  readonly type =
    FocConfigurationActionTypes.LOAD_ALL_SELECTED_LOCATION_CODES_SUCCESS;
  constructor(public payload: LocationListSuccessPayload) {}
}

export class LoadAllSelectedLocationCodesFailure implements Action {
  readonly type =
    FocConfigurationActionTypes.LOAD_ALL_SELECTED_LOCATION_CODES_FAILURE;
  constructor(public payload: CustomErrors) {}
}
// View Specific ends

export type FocConfigurationActions =
  | LoadLocationById
  | LoadLocationByIdFailure
  | LoadLocationByIdSuccess
  | UpdateLocationById
  | UpdateLocationByIdFailure
  | UpdateLocationByIdSuccess
  | LoadFocConfigurationList
  | LoadFocConfigurationListSuccess
  | LoadFocConfigurationListFailure
  | LoadFocSchemeConfigurationByConfigId
  | LoadFocSchemeConfigurationByConfigIdFailure
  | LoadFocSchemeConfigurationByConfigIdSuccess
  | LoadMappedProductGroupsByConfigId
  | LoadMappedProductGroupsByConfigIdSuccess
  | LoadMappedProductGroupsByConfigIdFailure
  | UpdateFocSchemeConfiguration
  | UpdateFocSchemeConfigurationFailure
  | UpdateFocSchemeConfigurationSuccess
  | SearchConfigBySchemeName
  | SearchConfigBySchemeNameSuccess
  | SearchConfigBySchemeNameFailure
  | SaveFocSchemeConfigurationFailure
  | SaveFocSchemeConfigurationSuccess
  | SaveFocSchemeConfiguration
  | UpdateProductGroupByConfigId
  | UpdateProductGroupByConfigIdSuccess
  | UpdateProductGroupByConfigIdFailure
  | SaveVariantDetails
  | SaveVariantDetailsSuccess
  | SaveVariantDetailsFailure
  | LoadVariantDetailsById
  | LoadVariantDetailsByIdFailure
  | LoadVariantDetailsByIdSuccess
  | LoadMappedFocItemsById
  | LoadMappedFocItemsByIdFailure
  | LoadMappedFocItemsByIdSuccess
  | SaveFocItems
  | SaveFocItemsFailure
  | SaveFocItemsSuccess
  | LoadRangeWeight
  | LoadRangeWeightSuccesss
  | LoadRangeWeightFailure
  | LoadReset
  | LoadFocItemCodes
  | LoadFocItemCodesSuccess
  | LoadFocItemCodesFailure
  | SearchFocItem
  | SearchFocItemSuccess
  | SearchFocItemFailure
  | SearchLocationCode
  | SearchLocationCodeSuccess
  | SearchLocationCodeFailure
  | PublishFocScheme
  | PublishFocSchemeSuccesss
  | PublishFocSchemeFailure
  | LoadVariantDetailsValueGoldStandardById
  | LoadVariantDetailsValueGoldStandardByIdSuccess
  | LoadVariantDetailsValueGoldStandardByIdFailure
  | LoadVariantDetailsValueOthersStandardById
  | LoadVariantDetailsValueOthersStandardByIdSuccess
  | LoadVariantDetailsValueOthersStandardByIdFailure
  | LoadVariantDetailsValueGoldSlabById
  | LoadVariantDetailsValueGoldSlabByIdSuccess
  | LoadVariantDetailsValueGoldSlabByIdFailure
  | LoadVariantDetailsValueOthersSlabById
  | LoadVariantDetailsValueOthersSlabByIdSuccess
  | LoadVariantDetailsValueOthersSlabByIdFailure
  | LoadVariantDetailsWeightGoldStandardById
  | LoadVariantDetailsWeightGoldStandardByIdSuccess
  | LoadVariantDetailsWeightGoldStandardByIdFailure
  | LoadVariantDetailsWeightOthersStandardById
  | LoadVariantDetailsWeightOthersStandardByIdSuccess
  | LoadVariantDetailsWeightOthersStandardByIdFailure
  | LoadVariantDetailsWeightGoldSlabById
  | LoadVariantDetailsWeightGoldSlabByIdSuccess
  | LoadVariantDetailsWeightGoldSlabByIdFailure
  | LoadVariantDetailsWeightOthersSlabById
  | LoadVariantDetailsWeightOthersSlabByIdSuccess
  | LoadVariantDetailsWeightOthersSlabByIdFailure
  | LoadAllSelectedItemCodes
  | LoadAllSelectedItemCodesSuccess
  | LoadAllSelectedItemCodesFailure
  | LoadAllSelectedLocationCodes
  | LoadAllSelectedLocationCodesSuccess
  | LoadAllSelectedLocationCodesFailure
  | LoadFocTypeState;
