import { ReportsState } from './reports.state';
import { ReportsActions, ReportsActionTypes } from './reports.actions';

export const initialState: ReportsState = {
  reportGroups: [],
  reportNames: [],
  applicableReportNames: [],
  reportRoles: [],
  reportFields: [],
  reportSettings: [],
  error: null,
  reports: [],
  brands: [],
  subBrands: [],
  regions: [],
  levels: [],
  countries: [],
  states: [],
  towns: [],
  locations: [],
  productGroups: [],
  productCategories: [],
  isLoading: false,
  binGroups: [],
  binCodes: [],
  generateReportResponse: null,
  totalReports: 0,
  saveReportResponse: null,
  isLoadingReports: false,
  paymentType: [],
  roles: [],
  transferTypes: [],
  autoReportList: [],
  searchParameterResponse: null,
  saveSearchResponse: null,
  templateId: null,
  templateName: null,
  cnStatus: null,
  cnType: [],
  karatage: [],
  complexityCode: [],
  rso: []
};

export function ReportsReducer(
  state: ReportsState = initialState,
  action: ReportsActions
): ReportsState {
  switch (action.type) {
    case ReportsActionTypes.LOAD_SEARCH_PARAMETERS:
    case ReportsActionTypes.LOAD_AUTO_REPORT_LIST:
    case ReportsActionTypes.LOAD_ROLES:
    case ReportsActionTypes.LOAD_TRANSFER_TYPES:
    case ReportsActionTypes.SAVE_AUTO_REPORT_SETTINGS:
    case ReportsActionTypes.UPDATE_INDIVIDUAL_SETTINGS:
    case ReportsActionTypes.LOAD_INDIVIDUAL_SETTINGS:
    case ReportsActionTypes.LOAD_EXCLUDED_INDIVIDUAL_SETTINGS:
    case ReportsActionTypes.SAVE_INDIVIDUAL_SETTINGS:
    case ReportsActionTypes.LOAD_CN_STATUS:
    case ReportsActionTypes.LOAD_CN_TYPES:
    case ReportsActionTypes.LOAD_COMPLEXITY:
    case ReportsActionTypes.LOAD_KARATAGE:
    case ReportsActionTypes.LOAD_RSO:
      return {
        ...state,
        isLoading: true
      };
    case ReportsActionTypes.LOAD_RSO_SUCCESS:
      return {
        ...state,
        isLoading: false,
        rso: action.payload
      };
    case ReportsActionTypes.LOAD_KARATAGE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        karatage: action.payload
      };
    case ReportsActionTypes.LOAD_COMPLEXITY_SUCCESS:
      return {
        ...state,
        isLoading: false,
        complexityCode: action.payload
      };

    case ReportsActionTypes.LOAD_CN_TYPES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        cnType: action.payload
      };
    case ReportsActionTypes.LOAD_CN_STATUS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        cnStatus: action.payload
      };

    case ReportsActionTypes.UPDATE_SEARCH_PARAMETERS:
    case ReportsActionTypes.SAVE_SEARCH_PARAMETERS:
      return {
        ...state,
        isLoading: true,
        saveSearchResponse: null
      };
    case ReportsActionTypes.SAVE_INDIVIDUAL_SETTINGS_SUCCESS:
    case ReportsActionTypes.UPDATE_INDIVIDUAL_SETTINGS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        saveReportResponse: {
          isSaved: true
        }
      };

    case ReportsActionTypes.LOAD_EXCLUDED_INDIVIDUAL_SETTINGS_SUCCESS:
      return {
        ...state,
        reportSettings: action.payload.reportSetting,
        templateId: action.payload.templateId,
        templateName: action.payload.templateName,
        isLoading: false
      };
    case ReportsActionTypes.LOAD_INDIVIDUAL_SETTINGS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        reportFields: action.payload
      };
    case ReportsActionTypes.LOAD_SEARCH_PARAMETERS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        searchParameterResponse: action.payload
      };

    case ReportsActionTypes.LOAD_SEARCH_PARAMETERS_SUCCESS:
    case ReportsActionTypes.SAVE_SEARCH_PARAMETERS_SUCCESS:
    case ReportsActionTypes.UPDATE_SEARCH_PARAMETERS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        searchParameterResponse: action.payload,
        saveSearchResponse: true
      };

    case ReportsActionTypes.SAVE_AUTO_REPORT_SETTINGS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        saveReportResponse: {
          isSaved: true
        }
      };

    case ReportsActionTypes.LOAD_AUTO_REPORT_LIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        autoReportList: action.payload.autoReportList,
        totalReports: action.payload.totalElements
      };
    case ReportsActionTypes.LOAD_ROLES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        roles: action.payload
      };
    case ReportsActionTypes.LOAD_TRANSFER_TYPES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        transferTypes: action.payload
      };
    case ReportsActionTypes.DOWNLOAD_REPORT:
      return {
        ...state,
        isLoading: true
      };
    case ReportsActionTypes.DOWNLOAD_REPORT_SUCCESS:
      return {
        ...state,
        isLoading: false
      };
    case ReportsActionTypes.LOAD_PAYMENT_TYPES:
      return {
        ...state,
        isLoading: true,
        paymentType: []
      };
    case ReportsActionTypes.LOAD_PAYMENT_TYPES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        paymentType: action.payload
      };
    case ReportsActionTypes.LOAD_REPORT_GROUPS:
      return {
        ...state,
        reportGroups: [],
        reportNames: [],
        isLoading: true
      };

    case ReportsActionTypes.LOAD_REPORT_GROUPS_SUCCESS:
      return {
        ...state,
        reportGroups: action.payload,
        isLoading: false
      };

    case ReportsActionTypes.LOAD_REPORT_NAMES:
      return {
        ...state,
        reportNames: [],
        isLoading: true
      };

    case ReportsActionTypes.LOAD_REPORT_NAMES_SUCCESS:
      return {
        ...state,
        reportNames: action.payload,
        applicableReportNames: action.payload.filter(x => x.isApplicableToTheRole),
        isLoading: false
      };

    case ReportsActionTypes.LOAD_REPORTS:
      return {
        ...state,
        isLoadingReports: true
      };
    case ReportsActionTypes.LOAD_REPORTS_SUCCESS:
      return {
        ...state,
        reports: action.payload.reports,
        isLoadingReports: false,
        totalReports: action.payload.totalReports
      };

    case ReportsActionTypes.LOAD_REPORTS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoadingReports: false
      };
    case ReportsActionTypes.LOAD_RSO_FAILURE:
    case ReportsActionTypes.LOAD_KARATAGE_FAILURE:
    case ReportsActionTypes.LOAD_COMPLEXITY_FAILURE:
    case ReportsActionTypes.LOAD_CN_STATUS_FAILURE:
    case ReportsActionTypes.LOAD_CN_TYPES_FAILURE:
    case ReportsActionTypes.LOAD_AUTO_REPORT_LIST_FAILURE:
    case ReportsActionTypes.SAVE_REPORT_ROLE_SETTINGS_FAILURE:
    case ReportsActionTypes.LOAD_ROLES_FAILURE:
    case ReportsActionTypes.LOAD_TRANSFER_TYPES_FAILURE:
    case ReportsActionTypes.LOAD_REPORT_GROUPS_FAILURE:
    case ReportsActionTypes.LOAD_REPORT_NAMES_FAILURE:
    case ReportsActionTypes.GENERATE_REPORT_FAILURE:
    case ReportsActionTypes.SAVE_REPORT_SETTINGS_FAILURE:
    case ReportsActionTypes.LOAD_REPORT_SETTINGS_FAILURE:
    case ReportsActionTypes.LOAD_REPORT_ROLES_FAILURE:
    case ReportsActionTypes.LOAD_REPORT_FIELDS_FAILURE:
    case ReportsActionTypes.DOWNLOAD_REPORT_FAILURE:
    case ReportsActionTypes.SAVE_SEARCH_PARAMETERS_FAILURE:
    case ReportsActionTypes.LOAD_SEARCH_PARAMETERS_FAILURE:
    case ReportsActionTypes.UPDATE_SEARCH_PARAMETERS_FAILURE:
    case ReportsActionTypes.UPDATE_INDIVIDUAL_SETTINGS_FAILURE:
    case ReportsActionTypes.LOAD_INDIVIDUAL_SETTINGS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case ReportsActionTypes.LOAD_REPORT_ROLES:
      return {
        ...state,
        reportRoles: [],
        isLoading: true
      };

    case ReportsActionTypes.LOAD_REPORT_ROLES_SUCCESS:
      return {
        ...state,
        reportRoles: action.payload,
        isLoading: false
      };

    case ReportsActionTypes.LOAD_REPORT_FIELDS:
      return {
        ...state,
        reportFields: [],
        isLoading: true
      };

    case ReportsActionTypes.LOAD_REPORT_FIELDS_SUCCESS:
      return {
        ...state,
        reportFields: action.payload,
        isLoading: false
      };

    case ReportsActionTypes.LOAD_REPORT_SETTINGS:
      return {
        ...state,
        reportSettings: [],
        isLoading: true
      };

    case ReportsActionTypes.LOAD_REPORT_SETTINGS_SUCCESS:
      return {
        ...state,
        reportSettings: action.payload,
        isLoading: false
      };

    case ReportsActionTypes.SAVE_REPORT_SETTINGS:
      return {
        ...state,
        isLoading: true
      };

    case ReportsActionTypes.SAVE_REPORT_SETTINGS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        saveReportResponse: {
          isSaved: true
        }
      };
    case ReportsActionTypes.SAVE_REPORT_ROLE_SETTINGS:
      return {
        ...state,
        isLoading: true
      };
    case ReportsActionTypes.SAVE_REPORT_ROLE_SETTINGS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        saveReportResponse: {
          isSaved: true
        }
      };
    case ReportsActionTypes.GENERATE_REPORT:
      return {
        ...state,
        generateReportResponse: null,
        isLoading: true
      };

    case ReportsActionTypes.GENERATE_REPORT_SUCCESS:
      return {
        ...state,
        generateReportResponse: { id: action.payload },
        isLoading: false
      };

    case ReportsActionTypes.SAVE_AUTO_REPORT_SETTINGS_FAILURE:
    case ReportsActionTypes.LOAD_BRANDS_FAILURE:
    case ReportsActionTypes.LOAD_SUB_BRANDS_FAILURE:
    case ReportsActionTypes.LOAD_REGIONS_FAILURE:
    case ReportsActionTypes.LOAD_LEVELS_FAILURE:
    case ReportsActionTypes.LOAD_COUNTRIES_FAILURE:
    case ReportsActionTypes.LOAD_STATES_FAILURE:
    case ReportsActionTypes.LOAD_TOWNS_FAILURE:
    case ReportsActionTypes.LOAD_LOCAITONS_FAILURE:
    case ReportsActionTypes.LOAD_PRODUCT_CATEGORIES_FAILURE:
    case ReportsActionTypes.LOAD_PRODUCT_GROUPS_FAILURE:
    case ReportsActionTypes.LOAD_BIN_GROUPS_FAILURE:
    case ReportsActionTypes.LOAD_BIN_CODES_FAILURE:
    case ReportsActionTypes.LOAD_PAYMENT_TYPES_FAILURE:
    case ReportsActionTypes.SAVE_INDIVIDUAL_SETTINGS_FAILURE:
    case ReportsActionTypes.LOAD_EXCLUDED_INDIVIDUAL_SETTINGS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case ReportsActionTypes.CLEAR_REPORTS_DATA:
      return {
        ...state,
        reports: [],
        totalReports: 0,
        generateReportResponse: null,
        error: null,
        reportRoles: [],
        reportFields: [],
        reportSettings: [],
        isLoading: false,
        saveReportResponse: null,
        reportNames: [],
        saveSearchResponse: null,
        cnType: []
      };
    case ReportsActionTypes.LOAD_BRANDS_SUCCESS:
      return {
        ...state,
        brands: action.payload
      };
    case ReportsActionTypes.LOAD_SUB_BRANDS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        subBrands: action.payload
      };
    case ReportsActionTypes.LOAD_REGIONS_SUCCESS:
      return {
        ...state,
        regions: action.payload
      };

    case ReportsActionTypes.LOAD_LEVELS_SUCCESS:
      return {
        ...state,
        levels: action.payload
      };

    case ReportsActionTypes.LOAD_COUNTRIES_SUCCESS:
      return {
        ...state,
        countries: action.payload
      };

    case ReportsActionTypes.LOAD_STATES_SUCCESS:
      return {
        ...state,
        states: action.payload
      };

    case ReportsActionTypes.LOAD_TOWNS_SUCCESS:
      return {
        ...state,
        towns: action.payload
      };

    case ReportsActionTypes.LOAD_LOCAITONS_SUCCESS:
      return {
        ...state,
        locations: action.payload
      };

    case ReportsActionTypes.LOAD_PRODUCT_GROUPS_SUCCESS:
      return {
        ...state,
        productGroups: action.payload
      };

    case ReportsActionTypes.LOAD_PRODUCT_CATEGORIES_SUCCESS:
      return {
        ...state,
        productCategories: action.payload
      };
    case ReportsActionTypes.LOAD_BIN_GROUPS_SUCCESS:
      return {
        ...state,
        binGroups: action.payload
      };

    case ReportsActionTypes.LOAD_BIN_CODES_SUCCESS:
      return {
        ...state,
        binCodes: action.payload
      };

    default:
      return state;
  }
}
