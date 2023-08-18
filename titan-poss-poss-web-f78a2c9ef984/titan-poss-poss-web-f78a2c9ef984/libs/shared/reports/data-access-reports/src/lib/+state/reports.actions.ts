import {
  CustomErrors,
  BrandSummary,
  RegionSummary,
  CountrySummary,
  TownSummary,
  StateSummary,
  Lov,
  LocationSummaryList,
  ProductGroup,
  ProductCategory,
  BinGroup,
  BinCode,
  ReportBTQCodePayload,
  PaymentCodeList,
  GenerateReportRequest,
  ReportName,
  ReportReponse,
  LoadReportPayload,
  CheckBoxSelectedOption,
  SaveReportPayload,
  ReportField,
  ReportGroupLov,
  ReportRoleSetting,
  SaveReportRolePayload,
  LoadAutoReportPayload,
  LoadAutoReportResponse,
  AutoReportList,
  SaveAutoReportPayload,
  SaveSearchParametersPayload,
  SearchParameter,
  LoadSearchParameterPayload,
  UpdateSearchParametersPayload,
  UpdateIndividualReportSetting,
  SaveIndividualReportSetting,
  LoadExcludedSettingPayload,
  LoadExcludedSettingRequestPayload,
  ComplexityCode,
  Karatage
} from '@poss-web/shared/models';
import { Action } from '@ngrx/store';

export enum ReportsActionTypes {
  LOAD_REPORT_GROUPS = '[ Reports ] Load Report Groups',
  LOAD_REPORT_GROUPS_SUCCESS = '[ Reports ] Load Report Groups Success',
  LOAD_REPORT_GROUPS_FAILURE = '[ Reports ] Load Report Groups Failure',

  LOAD_SUB_BRANDS = '[Reports] Load Sub Brands',
  LOAD_SUB_BRANDS_SUCCESS = '[Reports] Load Sub Brands Success',
  LOAD_SUB_BRANDS_FAILURE = '[Reports] Load Sub Brands Failure',

  LOAD_REPORT_NAMES = '[ Reports ] Load Report Names',
  LOAD_REPORT_NAMES_SUCCESS = '[ Reports ] Load Report Names Success',
  LOAD_REPORT_NAMES_FAILURE = '[ Reports ] Load Report Names Failure',

  LOAD_REPORT_ROLES = '[ Reports ] Load Report Roles',
  LOAD_REPORT_ROLES_SUCCESS = '[ Reports ] Load Report Roles Success',
  LOAD_REPORT_ROLES_FAILURE = '[ Reports ] Load Report Roles Failure',

  LOAD_REPORT_FIELDS = '[ Reports ] Load Report Fields',
  LOAD_REPORT_FIELDS_SUCCESS = '[ Reports ] Load Report Fields Success',
  LOAD_REPORT_FIELDS_FAILURE = '[ Reports ] Load Report Fields Failure',

  LOAD_REPORT_SETTINGS = '[ Reports ] Load Report Settings',
  LOAD_REPORT_SETTINGS_SUCCESS = '[ Reports ] Load Report Settings Success',
  LOAD_REPORT_SETTINGS_FAILURE = '[ Reports ] Load Report Settings Failure',

  SAVE_REPORT_SETTINGS = '[ Reports ] Save Report Settings',
  SAVE_REPORT_SETTINGS_SUCCESS = '[ Reports ] Save Report Settings Success',
  SAVE_REPORT_SETTINGS_FAILURE = '[ Reports ] Save Report Settings Failure',

  SAVE_REPORT_ROLE_SETTINGS = '[ Reports ] Save Report Role Settings',
  SAVE_REPORT_ROLE_SETTINGS_SUCCESS = '[ Reports ] Save Report Role Settings Success',
  SAVE_REPORT_ROLE_SETTINGS_FAILURE = '[ Reports ] Save Report Role Settings Failure',

  GENERATE_REPORT = '[ Reports ] Generate Report',
  GENERATE_REPORT_SUCCESS = '[ Reports ] Generate Report Success',
  GENERATE_REPORT_FAILURE = '[ Reports ] Generate Report Failure',

  LOAD_REPORTS = '[ Reports ] Load Reports',
  LOAD_REPORTS_SUCCESS = '[ Reports ] Load Reports Success',
  LOAD_REPORTS_FAILURE = '[ Reports ] Load Reports Failure',

  DOWNLOAD_REPORT = '[ Reports ] Download Report',
  DOWNLOAD_REPORT_SUCCESS = '[ Reports ] Download Report Success',
  DOWNLOAD_REPORT_FAILURE = '[ Reports ] Download Report Failure',

  CLEAR_REPORTS_DATA = '[ Reports ] Clear Report Data',

  LOAD_BRANDS = '[Reports] Load Brands',
  LOAD_BRANDS_SUCCESS = '[Reports] Load Brands Success',
  LOAD_BRANDS_FAILURE = '[Reports] Load Brands Failure',

  LOAD_REGIONS = '[Reports] Load Region',
  LOAD_REGIONS_SUCCESS = '[Reports] Load Region Success',
  LOAD_REGIONS_FAILURE = '[Reports] Load Region Failure',

  LOAD_LEVELS = '[Reports] Load Levels',
  LOAD_LEVELS_SUCCESS = '[Reports] Load Levels Success',
  LOAD_LEVELS_FAILURE = '[Reports]Load Levels Failure',

  LOAD_COUNTRIES = '[Reports] Load Countries',
  LOAD_COUNTRIES_SUCCESS = '[Reports] Load Countries Success',
  LOAD_COUNTRIES_FAILURE = '[Reports] Load Countries Failure',

  LOAD_STATES = '[Reports] Load States',
  LOAD_STATES_SUCCESS = '[Reports] Load States Success',
  LOAD_STATES_FAILURE = '[Reports] Load States Failure',

  LOAD_TOWNS = '[Reports] Load towns',
  LOAD_TOWNS_SUCCESS = '[Reports] Load Towns Success',
  LOAD_TOWNS_FAILURE = '[Reports] Load Towns Failure',

  LOAD_LOCAITONS = '[ Reports ] Load locations',
  LOAD_LOCAITONS_SUCCESS = '[ Reports ] Load locations Success',
  LOAD_LOCAITONS_FAILURE = '[ Reports ] Load locations Failure',

  LOAD_PRODUCT_GROUPS = '[ Reports]  Load Product Groups ',
  LOAD_PRODUCT_GROUPS_SUCCESS = '[ Reports]  Load Product Groups Success ',
  LOAD_PRODUCT_GROUPS_FAILURE = '[ Reports]  Load Product Groups Failure ',

  LOAD_PRODUCT_CATEGORIES = '[ Reports]  Load Product Categories ',
  LOAD_PRODUCT_CATEGORIES_SUCCESS = '[ Reports]  Load Product Categories  Success ',
  LOAD_PRODUCT_CATEGORIES_FAILURE = '[ Reports]  Load Product Categories  Failure ',

  LOAD_BIN_GROUPS = '[ Reports]  Load Bin Groups ',
  LOAD_BIN_GROUPS_SUCCESS = '[ Reports]  Load Bin Groups Success ',
  LOAD_BIN_GROUPS_FAILURE = '[ Reports]  Load Bin Groups Failure ',

  LOAD_BIN_CODES = '[ Reports]  Load Bin Codes ',
  LOAD_BIN_CODES_SUCCESS = '[ Reports]  Load Bin Codes Success ',
  LOAD_BIN_CODES_FAILURE = '[ Reports]  Load Bin Codes Failure ',

  LOAD_PAYMENT_TYPES = '[ Reports]  Load Payment Types ',
  LOAD_PAYMENT_TYPES_SUCCESS = '[ Reports]  Load Payment Types Success ',
  LOAD_PAYMENT_TYPES_FAILURE = '[ Reports]  Load Payment Types Failure ',

  LOAD_ROLES = '[ Reports ] Load User Roles',
  LOAD_ROLES_SUCCESS = '[ Reports ] Load User Roles Success',
  LOAD_ROLES_FAILURE = '[ Reports ]  Load User Roles Failure',

  LOAD_TRANSFER_TYPES = '[ Reports ] Load Transfer Types',
  LOAD_TRANSFER_TYPES_SUCCESS = '[ Reports ] Load Transfer Types Success',
  LOAD_TRANSFER_TYPES_FAILURE = '[ Reports ]  Load Transfer Types Failure',

  LOAD_AUTO_REPORT_LIST = '[ Reports ] Load Auto Report List',
  LOAD_AUTO_REPORT_LIST_SUCCESS = '[ Reports ] Load Auto Report List Success',
  LOAD_AUTO_REPORT_LIST_FAILURE = '[ Reports ]  Load Auto Report List Failure',

  SAVE_AUTO_REPORT_SETTINGS = '[ Reports ] Save Auto Report Settings',
  SAVE_AUTO_REPORT_SETTINGS_SUCCESS = '[ Reports ] Save Auto Report Settings Success',
  SAVE_AUTO_REPORT_SETTINGS_FAILURE = '[ Reports ] Save Auto Report Settings Failure',

  SAVE_SEARCH_PARAMETERS = '[ Reports ] Save search parameters',
  SAVE_SEARCH_PARAMETERS_SUCCESS = '[ Reports ] Save search parameters Success',
  SAVE_SEARCH_PARAMETERS_FAILURE = '[ Reports ] Save search parameters Failure',

  UPDATE_SEARCH_PARAMETERS = '[ Reports ] Update search parameters',
  UPDATE_SEARCH_PARAMETERS_SUCCESS = '[ Reports ] Update search parameters Success',
  UPDATE_SEARCH_PARAMETERS_FAILURE = '[ Reports ] Update search parameters Failure',

  LOAD_SEARCH_PARAMETERS = '[ Reports ] Load search parameters',
  LOAD_SEARCH_PARAMETERS_SUCCESS = '[ Reports ] Load search parameters Success',
  LOAD_SEARCH_PARAMETERS_FAILURE = '[ Reports ] Load search parameters Failure',

  LOAD_INDIVIDUAL_SETTINGS = '[ Reports ] Load individual settings',
  LOAD_INDIVIDUAL_SETTINGS_SUCCESS = '[ Reports ] Load individual settings Success',
  LOAD_INDIVIDUAL_SETTINGS_FAILURE = '[ Reports ] Load individual settings Failure',

  LOAD_EXCLUDED_INDIVIDUAL_SETTINGS = '[ Reports ] Load  Excluded individual settings',
  LOAD_EXCLUDED_INDIVIDUAL_SETTINGS_SUCCESS = '[ Reports ] Load Excluded individual settings Success',
  LOAD_EXCLUDED_INDIVIDUAL_SETTINGS_FAILURE = '[ Reports ] Load Excluded individual settings Failure',

  SAVE_INDIVIDUAL_SETTINGS = '[ Reports ] save individual settings',
  SAVE_INDIVIDUAL_SETTINGS_SUCCESS = '[ Reports ] save individual settings Success',
  SAVE_INDIVIDUAL_SETTINGS_FAILURE = '[ Reports ] save individual settings Failure',

  UPDATE_INDIVIDUAL_SETTINGS = '[ Reports ] Update individual settings',
  UPDATE_INDIVIDUAL_SETTINGS_SUCCESS = '[ Reports ] Update individual settings Success',
  UPDATE_INDIVIDUAL_SETTINGS_FAILURE = '[ Reports ] Update individual settings Failure',

  LOAD_CN_TYPES = '[ Reports ] Load CN types',
  LOAD_CN_TYPES_SUCCESS = '[ Reports ] Load CN types Success',
  LOAD_CN_TYPES_FAILURE = '[ Reports ] Load CN types Failure',

  LOAD_CN_STATUS = '[ Reports ] Load CN Status',
  LOAD_CN_STATUS_SUCCESS = '[ Reports ] Load CN Status Success',
  LOAD_CN_STATUS_FAILURE = '[ Reports ] Load CN Status Failure',

  LOAD_COMPLEXITY = '[Reports] Load Complexity',
  LOAD_COMPLEXITY_SUCCESS = '[Report] Load Complexity Success',
  LOAD_COMPLEXITY_FAILURE = '[Report] Load Complexity Failure',

  LOAD_KARATAGE = '[Reports] Load Karatage',
  LOAD_KARATAGE_SUCCESS = '[Reports] Load Karatage Success',
  LOAD_KARATAGE_FAILURE = '[Reports] Load Karatage Failure',

  LOAD_RSO = '[Reports] Load RSO',
  LOAD_RSO_SUCCESS = '[Reports] Load RSO Success',
  LOAD_RSO_FAILURE = '[Reports] Load RSO Failure'
}

export class LoadComplexity implements Action {
  readonly type = ReportsActionTypes.LOAD_COMPLEXITY;
}

export class LoadComplexitySuccess implements Action {
  readonly type = ReportsActionTypes.LOAD_COMPLEXITY_SUCCESS;
  constructor(public payload: ComplexityCode[]) {}
}

export class LoadComplexityFailure implements Action {
  readonly type = ReportsActionTypes.LOAD_COMPLEXITY_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadKaratage implements Action {
  readonly type = ReportsActionTypes.LOAD_KARATAGE;
}

export class LoadKaratageSuccess implements Action {
  readonly type = ReportsActionTypes.LOAD_KARATAGE_SUCCESS;
  constructor(public payload: Karatage[]) {}
}

export class LoadKaratageFailure implements Action {
  readonly type = ReportsActionTypes.LOAD_KARATAGE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadRso implements Action {
  readonly type = ReportsActionTypes.LOAD_RSO;
  constructor(
    public payload: { locationCodes?: string[]; roleCodes?: string[] }
  ) {}
}

export class LoadRsoSuccess implements Action {
  readonly type = ReportsActionTypes.LOAD_RSO_SUCCESS;
  constructor(public payload: string[]) {}
}

export class LoadRsoFailure implements Action {
  readonly type = ReportsActionTypes.LOAD_RSO_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadCnType implements Action {
  readonly type = ReportsActionTypes.LOAD_CN_TYPES;
}

export class LoadCnTypeSuccess implements Action {
  readonly type = ReportsActionTypes.LOAD_CN_TYPES_SUCCESS;
  constructor(public payload: any) {}
}

export class LoadCnTypeFailure implements Action {
  readonly type = ReportsActionTypes.LOAD_CN_TYPES_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadCnStatus implements Action {
  readonly type = ReportsActionTypes.LOAD_CN_STATUS;
}

export class LoadCnStatusSuccess implements Action {
  readonly type = ReportsActionTypes.LOAD_CN_STATUS_SUCCESS;
  constructor(public payload: any) {}
}

export class LoadCnStatusFailure implements Action {
  readonly type = ReportsActionTypes.LOAD_CN_STATUS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SaveIndividualSetting implements Action {
  readonly type = ReportsActionTypes.SAVE_INDIVIDUAL_SETTINGS;
  constructor(public payload: SaveIndividualReportSetting) {}
}

export class SaveIndividualSettingSuccess implements Action {
  readonly type = ReportsActionTypes.SAVE_INDIVIDUAL_SETTINGS_SUCCESS;
}

export class SaveIndividualSettingFailure implements Action {
  readonly type = ReportsActionTypes.SAVE_INDIVIDUAL_SETTINGS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadExcludedIndividualSetting implements Action {
  readonly type = ReportsActionTypes.LOAD_EXCLUDED_INDIVIDUAL_SETTINGS;
  constructor(public payload: LoadExcludedSettingRequestPayload) {}
}

export class LoadExcludedIndividualSettingSuccess implements Action {
  readonly type = ReportsActionTypes.LOAD_EXCLUDED_INDIVIDUAL_SETTINGS_SUCCESS;
  constructor(public readonly payload: LoadExcludedSettingPayload) {}
}

export class LoadExcludedIndividualSettingFailure implements Action {
  readonly type = ReportsActionTypes.LOAD_EXCLUDED_INDIVIDUAL_SETTINGS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class UpdateIndividualSetting implements Action {
  readonly type = ReportsActionTypes.UPDATE_INDIVIDUAL_SETTINGS;
  constructor(public payload: UpdateIndividualReportSetting) {}
}

export class UpdateIndividualSettingSuccess implements Action {
  readonly type = ReportsActionTypes.UPDATE_INDIVIDUAL_SETTINGS_SUCCESS;
}

export class UpdateIndividualSettingFailure implements Action {
  readonly type = ReportsActionTypes.UPDATE_INDIVIDUAL_SETTINGS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadIndividualSetting implements Action {
  readonly type = ReportsActionTypes.LOAD_INDIVIDUAL_SETTINGS;
  constructor(public payload: string) {}
}

export class LoadIndividualSettingSuccess implements Action {
  readonly type = ReportsActionTypes.LOAD_INDIVIDUAL_SETTINGS_SUCCESS;
  constructor(public readonly payload: ReportField[]) {}
}

export class LoadIndividualSettingFailure implements Action {
  readonly type = ReportsActionTypes.LOAD_INDIVIDUAL_SETTINGS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class UpdateSearchParameter implements Action {
  readonly type = ReportsActionTypes.UPDATE_SEARCH_PARAMETERS;
  constructor(public payload: UpdateSearchParametersPayload) {}
}

export class UpdateSearchParameterSuccess implements Action {
  readonly type = ReportsActionTypes.UPDATE_SEARCH_PARAMETERS_SUCCESS;
  constructor(public payload: SearchParameter) {}
}

export class UpdateSearchParameterFailure implements Action {
  readonly type = ReportsActionTypes.UPDATE_SEARCH_PARAMETERS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SaveSearchParameter implements Action {
  readonly type = ReportsActionTypes.SAVE_SEARCH_PARAMETERS;
  constructor(public payload: SaveSearchParametersPayload) {}
}

export class SaveSearchParameterSuccess implements Action {
  readonly type = ReportsActionTypes.SAVE_SEARCH_PARAMETERS_SUCCESS;
  constructor(public readonly payload: SearchParameter) {}
}

export class SaveSearchParameterFailure implements Action {
  readonly type = ReportsActionTypes.SAVE_SEARCH_PARAMETERS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadSearchParameter implements Action {
  readonly type = ReportsActionTypes.LOAD_SEARCH_PARAMETERS;
  constructor(public payload: LoadSearchParameterPayload) {}
}

export class LoadSearchParameterSuccess implements Action {
  readonly type = ReportsActionTypes.LOAD_SEARCH_PARAMETERS_SUCCESS;
  constructor(public payload: SearchParameter) {}
}

export class LoadSearchParameterFailure implements Action {
  readonly type = ReportsActionTypes.LOAD_SEARCH_PARAMETERS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadAutoReportList implements Action {
  readonly type = ReportsActionTypes.LOAD_AUTO_REPORT_LIST;
  constructor(public payload: LoadAutoReportPayload) {}
}

export class LoadAutoReportListSuccess implements Action {
  readonly type = ReportsActionTypes.LOAD_AUTO_REPORT_LIST_SUCCESS;
  constructor(public readonly payload: LoadAutoReportResponse) {}
}

export class LoadAutoReportListFailures implements Action {
  readonly type = ReportsActionTypes.LOAD_AUTO_REPORT_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SaveAutoReportSettings implements Action {
  readonly type = ReportsActionTypes.SAVE_AUTO_REPORT_SETTINGS;
  constructor(public payload: SaveAutoReportPayload) {}
}
export class SaveAutoReportSettingsSuccess implements Action {
  readonly type = ReportsActionTypes.SAVE_AUTO_REPORT_SETTINGS_SUCCESS;
  constructor(public payload: AutoReportList) {}
}
export class SaveAutoReportSettingsFailure implements Action {
  readonly type = ReportsActionTypes.SAVE_AUTO_REPORT_SETTINGS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadRoles implements Action {
  readonly type = ReportsActionTypes.LOAD_ROLES;
}

export class LoadRolesSuccess implements Action {
  readonly type = ReportsActionTypes.LOAD_ROLES_SUCCESS;
  constructor(public readonly payload: any) {}
}

export class LoadRolesFailure implements Action {
  readonly type = ReportsActionTypes.LOAD_ROLES_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadTransferTypes implements Action {
  readonly type = ReportsActionTypes.LOAD_TRANSFER_TYPES;
}

export class LoadTransferTypesSuccess implements Action {
  readonly type = ReportsActionTypes.LOAD_TRANSFER_TYPES_SUCCESS;
  constructor(public readonly payload: any) {}
}

export class LoadTransferTypesFailure implements Action {
  readonly type = ReportsActionTypes.LOAD_TRANSFER_TYPES_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadPaymentType implements Action {
  readonly type = ReportsActionTypes.LOAD_PAYMENT_TYPES;
}
export class LoadPaymentTypeSuccess implements Action {
  readonly type = ReportsActionTypes.LOAD_PAYMENT_TYPES_SUCCESS;
  constructor(public payload: PaymentCodeList[]) {}
}
export class LoadPaymentTypeFailure implements Action {
  readonly type = ReportsActionTypes.LOAD_PAYMENT_TYPES_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadReportGroups implements Action {
  readonly type = ReportsActionTypes.LOAD_REPORT_GROUPS;
}

export class LoadReportGroupsSuccess implements Action {
  readonly type = ReportsActionTypes.LOAD_REPORT_GROUPS_SUCCESS;
  constructor(public readonly payload: ReportGroupLov[]) {}
}

export class LoadReportGroupsFailure implements Action {
  readonly type = ReportsActionTypes.LOAD_REPORT_GROUPS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadReportNames implements Action {
  readonly type = ReportsActionTypes.LOAD_REPORT_NAMES;
  constructor(public readonly payload: string) {}
}

export class LoadReportNamesSuccess implements Action {
  readonly type = ReportsActionTypes.LOAD_REPORT_NAMES_SUCCESS;
  constructor(public readonly payload: ReportName[]) {}
}

export class LoadReportNamesFailure implements Action {
  readonly type = ReportsActionTypes.LOAD_REPORT_NAMES_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadReportRoles implements Action {
  readonly type = ReportsActionTypes.LOAD_REPORT_ROLES;
  constructor(
    public payload: {
      reportDes?: string;
      roleCode?: string;
    }
  ) {}
}

export class LoadReportRolesSuccess implements Action {
  readonly type = ReportsActionTypes.LOAD_REPORT_ROLES_SUCCESS;
  constructor(public readonly payload: ReportRoleSetting[]) {}
}

export class LoadReportRolesFailure implements Action {
  readonly type = ReportsActionTypes.LOAD_REPORT_ROLES_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadReportFields implements Action {
  readonly type = ReportsActionTypes.LOAD_REPORT_FIELDS;
  constructor(public readonly payload: string) {}
}

export class LoadReportFieldsSuccess implements Action {
  readonly type = ReportsActionTypes.LOAD_REPORT_FIELDS_SUCCESS;
  constructor(public readonly payload: ReportField[]) {}
}

export class LoadReportFieldsFailure implements Action {
  readonly type = ReportsActionTypes.LOAD_REPORT_FIELDS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadReportSettings implements Action {
  readonly type = ReportsActionTypes.LOAD_REPORT_SETTINGS;
  constructor(
    public readonly payload: {
      reportId?: string;
      roleCode?: string;
    }
  ) {}
}

export class LoadReportSettingsSuccess implements Action {
  readonly type = ReportsActionTypes.LOAD_REPORT_SETTINGS_SUCCESS;
  constructor(public readonly payload: CheckBoxSelectedOption[]) {}
}

export class LoadReportSettingsFailure implements Action {
  readonly type = ReportsActionTypes.LOAD_REPORT_SETTINGS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SaveReportRoleSettings implements Action {
  readonly type = ReportsActionTypes.SAVE_REPORT_ROLE_SETTINGS;
  constructor(
    public payload: { roleCode: string; request: SaveReportRolePayload }
  ) {}
}

export class SaveReportRoleSettingsSuccess implements Action {
  readonly type = ReportsActionTypes.SAVE_REPORT_ROLE_SETTINGS_SUCCESS;
}

export class SaveReportRoleSettingsFailure implements Action {
  readonly type = ReportsActionTypes.SAVE_REPORT_ROLE_SETTINGS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SaveReportSettings implements Action {
  readonly type = ReportsActionTypes.SAVE_REPORT_SETTINGS;
  constructor(
    public payload: { reportId: string; request: SaveReportPayload }
  ) {}
}

export class SaveReportSettingsSuccess implements Action {
  readonly type = ReportsActionTypes.SAVE_REPORT_SETTINGS_SUCCESS;
}

export class SaveReportSettingsFailure implements Action {
  readonly type = ReportsActionTypes.SAVE_REPORT_SETTINGS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class GenerateReport implements Action {
  readonly type = ReportsActionTypes.GENERATE_REPORT;
  constructor(
    public payload: { reportId: string; request: GenerateReportRequest }
  ) {}
}

export class GenerateReportSuccess implements Action {
  readonly type = ReportsActionTypes.GENERATE_REPORT_SUCCESS;
  constructor(public readonly payload: string) {}
}

export class GenerateReportFailure implements Action {
  readonly type = ReportsActionTypes.GENERATE_REPORT_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class DownloadReport implements Action {
  readonly type = ReportsActionTypes.DOWNLOAD_REPORT;
  constructor(public payload: { reportId: string; selectedTab: number }) {}
}

export class DownloadReportSuccess implements Action {
  readonly type = ReportsActionTypes.DOWNLOAD_REPORT_SUCCESS;
}

export class DownloadReportFailure implements Action {
  readonly type = ReportsActionTypes.DOWNLOAD_REPORT_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadReports implements Action {
  readonly type = ReportsActionTypes.LOAD_REPORTS;
  constructor(public payload: LoadReportPayload) {}
}

export class LoadReportsSuccess implements Action {
  readonly type = ReportsActionTypes.LOAD_REPORTS_SUCCESS;
  constructor(public readonly payload: ReportReponse) {}
}

export class LoadReportsFailure implements Action {
  readonly type = ReportsActionTypes.LOAD_REPORTS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ClearReportsData implements Action {
  readonly type = ReportsActionTypes.CLEAR_REPORTS_DATA;
}

export class LoadBrands implements Action {
  readonly type = ReportsActionTypes.LOAD_BRANDS;
}

export class LoadBrandsSuccess implements Action {
  readonly type = ReportsActionTypes.LOAD_BRANDS_SUCCESS;
  constructor(public payload: BrandSummary[]) {}
}

export class LoadBrandsFailure implements Action {
  readonly type = ReportsActionTypes.LOAD_BRANDS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadSubBrands implements Action {
  readonly type = ReportsActionTypes.LOAD_SUB_BRANDS;
  constructor(public payload: string | string[]) {}
}
export class LoadSubBrandsSuccess implements Action {
  readonly type = ReportsActionTypes.LOAD_SUB_BRANDS_SUCCESS;
  constructor(public payload: BrandSummary[]) {}
}
export class LoadSubBrandsFailure implements Action {
  readonly type = ReportsActionTypes.LOAD_SUB_BRANDS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadLevels implements Action {
  readonly type = ReportsActionTypes.LOAD_LEVELS;
}
export class LoadLevelsSuccess implements Action {
  readonly type = ReportsActionTypes.LOAD_LEVELS_SUCCESS;
  constructor(public payload: Lov[]) {}
}

export class LoadLevelsFailure implements Action {
  readonly type = ReportsActionTypes.LOAD_LEVELS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadRegions implements Action {
  readonly type = ReportsActionTypes.LOAD_REGIONS;
}
export class LoadRegionsSuccess implements Action {
  readonly type = ReportsActionTypes.LOAD_REGIONS_SUCCESS;
  constructor(public payload: RegionSummary[]) {}
}

export class LoadRegionsFailure implements Action {
  readonly type = ReportsActionTypes.LOAD_REGIONS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadCountries implements Action {
  readonly type = ReportsActionTypes.LOAD_COUNTRIES;
}

export class LoadCountriesSuccess implements Action {
  readonly type = ReportsActionTypes.LOAD_COUNTRIES_SUCCESS;
  constructor(public payload: CountrySummary[]) {}
}

export class LoadCountriesFailure implements Action {
  readonly type = ReportsActionTypes.LOAD_COUNTRIES_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadStates implements Action {
  readonly type = ReportsActionTypes.LOAD_STATES;
  constructor(public payload: string) {}
}

export class LoadStatesSuccess implements Action {
  readonly type = ReportsActionTypes.LOAD_STATES_SUCCESS;
  constructor(public payload: StateSummary[]) {}
}

export class LoadStatesFailure implements Action {
  readonly type = ReportsActionTypes.LOAD_STATES_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadTowns implements Action {
  readonly type = ReportsActionTypes.LOAD_TOWNS;
  constructor(public payload: string) {}
}

export class LoadTownsSuccess implements Action {
  readonly type = ReportsActionTypes.LOAD_TOWNS_SUCCESS;
  constructor(public payload: TownSummary[]) {}
}

export class LoadTownsFailure implements Action {
  readonly type = ReportsActionTypes.LOAD_TOWNS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadLocations implements Action {
  readonly type = ReportsActionTypes.LOAD_LOCAITONS;
  constructor(public payload: ReportBTQCodePayload) {}
}

export class LoadLocationsSuccess implements Action {
  readonly type = ReportsActionTypes.LOAD_LOCAITONS_SUCCESS;
  constructor(public payload: LocationSummaryList[]) {}
}

export class LoadLocationsFailure implements Action {
  readonly type = ReportsActionTypes.LOAD_LOCAITONS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadProductGroups implements Action {
  readonly type = ReportsActionTypes.LOAD_PRODUCT_GROUPS;
}
export class LoadProductGroupsSuccess implements Action {
  readonly type = ReportsActionTypes.LOAD_PRODUCT_GROUPS_SUCCESS;
  constructor(public payload: ProductGroup[]) {}
}
export class LoadProductGroupsFailure implements Action {
  readonly type = ReportsActionTypes.LOAD_PRODUCT_GROUPS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadProductCategories implements Action {
  readonly type = ReportsActionTypes.LOAD_PRODUCT_CATEGORIES;
}
export class LoadProductCategoriesSuccess implements Action {
  readonly type = ReportsActionTypes.LOAD_PRODUCT_CATEGORIES_SUCCESS;
  constructor(public payload: ProductCategory[]) {}
}
export class LoadProductCategoriesFailure implements Action {
  readonly type = ReportsActionTypes.LOAD_PRODUCT_CATEGORIES_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadBinGroups implements Action {
  readonly type = ReportsActionTypes.LOAD_BIN_GROUPS;
}
export class LoadBinGroupsSuccess implements Action {
  readonly type = ReportsActionTypes.LOAD_BIN_GROUPS_SUCCESS;
  constructor(public payload: BinGroup[]) {}
}
export class LoadBinGroupsFailure implements Action {
  readonly type = ReportsActionTypes.LOAD_BIN_GROUPS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadBinCodes implements Action {
  readonly type = ReportsActionTypes.LOAD_BIN_CODES;
  constructor(public payload: string) {}
}
export class LoadBinCodesSuccess implements Action {
  readonly type = ReportsActionTypes.LOAD_BIN_CODES_SUCCESS;
  constructor(public payload: BinCode[]) {}
}
export class LoadBinCodesFailure implements Action {
  readonly type = ReportsActionTypes.LOAD_BIN_CODES_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export type ReportsActions =
  | LoadReportGroups
  | LoadReportGroupsSuccess
  | LoadReportGroupsFailure
  | LoadReportNames
  | LoadReportNamesSuccess
  | LoadReportNamesFailure
  | LoadReportRoles
  | LoadReportRolesSuccess
  | LoadReportRolesFailure
  | LoadReportFields
  | LoadReportFieldsSuccess
  | LoadReportFieldsFailure
  | LoadReportSettings
  | LoadReportSettingsSuccess
  | LoadReportSettingsFailure
  | SaveReportSettings
  | SaveReportSettingsSuccess
  | SaveReportSettingsFailure
  | GenerateReport
  | GenerateReportSuccess
  | GenerateReportFailure
  | LoadReports
  | LoadReportsSuccess
  | LoadReportsFailure
  | DownloadReport
  | DownloadReportSuccess
  | DownloadReportFailure
  | ClearReportsData
  | LoadBrands
  | LoadBrandsSuccess
  | LoadBrandsFailure
  | LoadSubBrands
  | LoadSubBrandsSuccess
  | LoadSubBrandsFailure
  | LoadRegions
  | LoadRegionsSuccess
  | LoadRegionsFailure
  | LoadLevels
  | LoadLevelsSuccess
  | LoadLevelsFailure
  | LoadCountries
  | LoadCountriesSuccess
  | LoadCountriesFailure
  | LoadStates
  | LoadStatesSuccess
  | LoadStatesFailure
  | LoadTowns
  | LoadTownsSuccess
  | LoadTownsFailure
  | LoadLocations
  | LoadLocationsSuccess
  | LoadLocationsFailure
  | LoadProductGroups
  | LoadProductGroupsSuccess
  | LoadProductGroupsFailure
  | LoadProductCategories
  | LoadProductCategoriesSuccess
  | LoadProductCategoriesFailure
  | LoadBinGroups
  | LoadBinGroupsSuccess
  | LoadBinGroupsFailure
  | LoadBinCodes
  | LoadBinCodesSuccess
  | LoadBinCodesFailure
  | LoadPaymentType
  | LoadPaymentTypeSuccess
  | LoadPaymentTypeFailure
  | LoadRoles
  | LoadRolesSuccess
  | LoadRolesFailure
  | LoadTransferTypes
  | LoadTransferTypesSuccess
  | LoadTransferTypesFailure
  | SaveReportRoleSettings
  | SaveReportRoleSettingsSuccess
  | SaveReportRoleSettingsFailure
  | LoadAutoReportList
  | LoadAutoReportListSuccess
  | LoadAutoReportListFailures
  | SaveAutoReportSettings
  | SaveAutoReportSettingsSuccess
  | SaveAutoReportSettingsFailure
  | SaveSearchParameter
  | SaveSearchParameterSuccess
  | SaveSearchParameterFailure
  | LoadSearchParameter
  | LoadSearchParameterFailure
  | LoadSearchParameterSuccess
  | UpdateSearchParameter
  | UpdateSearchParameterSuccess
  | UpdateSearchParameterFailure
  | LoadIndividualSetting
  | LoadIndividualSettingSuccess
  | LoadIndividualSettingFailure
  | UpdateIndividualSetting
  | UpdateIndividualSettingSuccess
  | UpdateIndividualSettingFailure
  | SaveIndividualSetting
  | SaveIndividualSettingSuccess
  | SaveIndividualSettingFailure
  | LoadExcludedIndividualSetting
  | LoadExcludedIndividualSettingSuccess
  | LoadExcludedIndividualSettingFailure
  | LoadCnStatus
  | LoadCnStatusSuccess
  | LoadCnStatusFailure
  | LoadCnType
  | LoadCnTypeSuccess
  | LoadCnTypeFailure
  | LoadComplexity
  | LoadComplexitySuccess
  | LoadComplexityFailure
  | LoadKaratage
  | LoadKaratageSuccess
  | LoadKaratageFailure
  | LoadRso
  | LoadRsoFailure
  | LoadRsoSuccess;
