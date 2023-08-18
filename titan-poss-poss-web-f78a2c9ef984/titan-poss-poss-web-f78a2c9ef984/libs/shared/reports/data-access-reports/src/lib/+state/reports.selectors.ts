import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ReportsState, REPORTS_FEATURE_KEY } from './reports.state';

export const selectReportstState = createFeatureSelector<ReportsState>(
  REPORTS_FEATURE_KEY
);

const selectIsLoading = createSelector(
  selectReportstState,
  state => state.isLoading
);

const selectIsLoadingReports = createSelector(
  selectReportstState,
  state => state.isLoadingReports
);

const selectReportGroups = createSelector(
  selectReportstState,
  state => state.reportGroups
);

const selectReportNames = createSelector(
  selectReportstState,
  state => state.reportNames
);

const selectApplicableReportNames = createSelector(
  selectReportstState,
  state => state.applicableReportNames
);

const selectReportRoles = createSelector(
  selectReportstState,
  state => state.reportRoles
);
const selectReportFields = createSelector(
  selectReportstState,
  state => state.reportFields
);

const selectReportSettings = createSelector(
  selectReportstState,
  state => state.reportSettings
);

const selectReports = createSelector(
  selectReportstState,
  state => state.reports
);

const selectBrands = createSelector(selectReportstState, state => state.brands);

const selectSubBrands = createSelector(selectReportstState, state => state.subBrands);

const selectRegions = createSelector(
  selectReportstState,
  state => state.regions
);

const selectLevels = createSelector(selectReportstState, state => state.levels);

const selectCountries = createSelector(
  selectReportstState,
  state => state.countries
);

const selectStates = createSelector(selectReportstState, state => state.states);

const selectTowns = createSelector(selectReportstState, state => state.towns);

const selectLocations = createSelector(
  selectReportstState,
  state => state.locations
);

const selectError = createSelector(selectReportstState, state => state.error);

const selectProductGroups = createSelector(
  selectReportstState,
  state => state.productGroups
);

const selectProductCategories = createSelector(
  selectReportstState,
  state => state.productCategories
);
const selectBinGroups = createSelector(
  selectReportstState,
  state => state.binGroups
);
const selectBinCodes = createSelector(
  selectReportstState,
  state => state.binCodes
);

const selectGenerateReportResponse = createSelector(
  selectReportstState,
  state => state.generateReportResponse
);

const selectTotalReports = createSelector(
  selectReportstState,
  state => state.totalReports
);

const selectSaveReportResponse = createSelector(
  selectReportstState,
  state => state.saveReportResponse
);
const selectPaymentType = createSelector(
  selectReportstState,
  state => state.paymentType
);

const selectAutoReportList = createSelector(
  selectReportstState,
  state => state.autoReportList
);

const selectRoles = createSelector(selectReportstState, state => state.roles);

const selectTransferTypes = createSelector(
  selectReportstState,
   state => state.transferTypes);

const selectSearchParameters = createSelector(
  selectReportstState,
  state => state.searchParameterResponse
);

const selectSaveSearchResponse = createSelector(
  selectReportstState,
  state => state.saveSearchResponse
);
const selectTemplateId = createSelector(
  selectReportstState,
  state => state.templateId
);

const selectTemplateName = createSelector(
  selectReportstState,
  state => state.templateName
);

const selectCnType = createSelector(selectReportstState, state => state.cnType);

const selectCnStatus = createSelector(
  selectReportstState,
  state => state.cnStatus
);

const selectComplexityCode = createSelector(
  selectReportstState,
  state => state.complexityCode
);

const selectKaratage = createSelector(
  selectReportstState,
  state => state.karatage
);

const selectRso = createSelector(selectReportstState, state => state.rso);

export const ReportsSelectors = {
  selectError,
  selectIsLoading,
  selectReportGroups,
  selectReportNames,
  selectApplicableReportNames,
  selectReportRoles,
  selectReportFields,
  selectReportSettings,
  selectReports,
  selectBrands,
  selectSubBrands,
  selectRegions,
  selectLevels,
  selectCountries,
  selectStates,
  selectTowns,
  selectLocations,
  selectProductGroups,
  selectProductCategories,
  selectBinGroups,
  selectBinCodes,
  selectGenerateReportResponse,
  selectTotalReports,
  selectSaveReportResponse,
  selectIsLoadingReports,
  selectPaymentType,
  selectRoles,
  selectTransferTypes,
  selectAutoReportList,
  selectSearchParameters,
  selectSaveSearchResponse,
  selectTemplateId,
  selectTemplateName,
  selectCnType,
  selectCnStatus,
  selectComplexityCode,
  selectKaratage,
  selectRso
};
