import * as ReportsActions from './reports.actions';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ReportsState } from './reports.state';
import { ReportsSelectors } from './reports.selectors';
import {
  ReportBTQCodePayload,
  GenerateReportRequest,
  LoadReportPayload,
  SaveReportPayload,
  SaveReportRolePayload,
  LoadAutoReportPayload,
  SaveAutoReportPayload,
  LoadSearchParameterPayload,
  SaveSearchParametersPayload,
  UpdateSearchParametersPayload,
  UpdateIndividualReportSetting,
  SaveIndividualReportSetting,
  LoadExcludedSettingRequestPayload
} from '@poss-web/shared/models';
@Injectable()
export class ReportsFacade {
  private isLoading$ = this.store.select(ReportsSelectors.selectIsLoading);

  private isLoadingReports$ = this.store.select(
    ReportsSelectors.selectIsLoadingReports
  );

  private reportGroups$ = this.store.select(
    ReportsSelectors.selectReportGroups
  );
  private reportNames$ = this.store.select(ReportsSelectors.selectReportNames);
  private applicableReportNames$ = this.store.select(ReportsSelectors.selectApplicableReportNames);

  private reportRoles$ = this.store.select(ReportsSelectors.selectReportRoles);
  private reportFields$ = this.store.select(
    ReportsSelectors.selectReportFields
  );
  private reportSettings$ = this.store.select(
    ReportsSelectors.selectReportSettings
  );
  private error$ = this.store.select(ReportsSelectors.selectError);
  private reports$ = this.store.select(ReportsSelectors.selectReports);
  private brands$ = this.store.select(ReportsSelectors.selectBrands);
  private subBrands$ = this.store.select(ReportsSelectors.selectSubBrands);
  private regions$ = this.store.select(ReportsSelectors.selectRegions);
  private levels$ = this.store.select(ReportsSelectors.selectLevels);
  private countries$ = this.store.select(ReportsSelectors.selectCountries);
  private states$ = this.store.select(ReportsSelectors.selectStates);
  private towns$ = this.store.select(ReportsSelectors.selectTowns);
  private locations$ = this.store.select(ReportsSelectors.selectLocations);
  private productGroups$ = this.store.select(
    ReportsSelectors.selectProductGroups
  );

  private productCategories$ = this.store.select(
    ReportsSelectors.selectProductCategories
  );

  private binGroups$ = this.store.select(ReportsSelectors.selectBinGroups);

  private binCodes$ = this.store.select(ReportsSelectors.selectBinCodes);

  private generateReportResponse$ = this.store.select(
    ReportsSelectors.selectGenerateReportResponse
  );

  private totalReports$ = this.store.select(
    ReportsSelectors.selectTotalReports
  );

  private saveReportResponse$ = this.store.select(
    ReportsSelectors.selectSaveReportResponse
  );

  private paymentType$ = this.store.select(ReportsSelectors.selectPaymentType);

  private roles$ = this.store.select(ReportsSelectors.selectRoles);
  private transferTypes$ = this.store.select(ReportsSelectors.selectTransferTypes);

  private autoReportList$ = this.store.select(
    ReportsSelectors.selectAutoReportList
  );

  private searchParameter$ = this.store.select(
    ReportsSelectors.selectSearchParameters
  );

  private saveSearchResponse$ = this.store.select(
    ReportsSelectors.selectSaveSearchResponse
  );
  private templateId$ = this.store.select(ReportsSelectors.selectTemplateId);

  private templateName$ = this.store.select(
    ReportsSelectors.selectTemplateName
  );

  private cnType$ = this.store.select(ReportsSelectors.selectCnType);

  private cnStatus$ = this.store.select(ReportsSelectors.selectCnStatus);

  private complexityCode$ = this.store.select(
    ReportsSelectors.selectComplexityCode
  );

  private karatage$ = this.store.select(ReportsSelectors.selectKaratage);

  private rso$ = this.store.select(ReportsSelectors.selectRso);
  constructor(private store: Store<ReportsState>) {}

  getComplexityCode() {
    return this.complexityCode$;
  }
  getKaratage() {
    return this.karatage$;
  }

  getRso() {
    return this.rso$;
  }
  getCnStatus() {
    return this.cnStatus$;
  }
  getCnType() {
    return this.cnType$;
  }

  getTemplateName() {
    return this.templateName$;
  }
  getTemplateId() {
    return this.templateId$;
  }
  getSaveSearchResponse() {
    return this.saveSearchResponse$;
  }

  getSearchParameter() {
    return this.searchParameter$;
  }
  getRoles() {
    return this.roles$;
  }
  getTransferTypes() {
    return this.transferTypes$;
  }
  getPaymentType() {
    return this.paymentType$;
  }
  getSaveReportResponse() {
    return this.saveReportResponse$;
  }

  getGenerateReportResponse() {
    return this.generateReportResponse$;
  }

  getTotalReports() {
    return this.totalReports$;
  }

  getError() {
    return this.error$;
  }

  getIsLoadingReports() {
    return this.isLoadingReports$;
  }

  getBinGroups() {
    return this.binGroups$;
  }

  getBinCodes() {
    return this.binCodes$;
  }

  getIsLoading() {
    return this.isLoading$;
  }

  getReportGroups() {
    return this.reportGroups$;
  }
  getReportNames() {
    return this.reportNames$;
  }
  getApplicableReportNames() {
    return this.applicableReportNames$;
  }
  getReportRoles() {
    return this.reportRoles$;
  }
  getReportFields() {
    return this.reportFields$;
  }

  getReportSettings() {
    return this.reportSettings$;
  }

  getReports() {
    return this.reports$;
  }
  getBrands() {
    return this.brands$;
  }
  getSubBrands() {
    return this.subBrands$;
  }

  getRegions() {
    return this.regions$;
  }

  getLevels() {
    return this.levels$;
  }

  getCountries() {
    return this.countries$;
  }
  getStates() {
    return this.states$;
  }
  getTowns() {
    return this.towns$;
  }

  getLocations() {
    return this.locations$;
  }
  getProductGroups() {
    return this.productGroups$;
  }
  getProductCategories() {
    return this.productCategories$;
  }
  getAutoReportList() {
    return this.autoReportList$;
  }

  saveAutoReportList(saveAutoReportPayload: SaveAutoReportPayload) {
    this.store.dispatch(
      new ReportsActions.SaveAutoReportSettings(saveAutoReportPayload)
    );
  }
  loadAutoReportList(loadAutoReportPayload: LoadAutoReportPayload) {
    this.store.dispatch(
      new ReportsActions.LoadAutoReportList(loadAutoReportPayload)
    );
  }
  loadReportGroups = () =>
    this.store.dispatch(new ReportsActions.LoadReportGroups());

  loadReportNames = (type?: string) =>
    this.store.dispatch(new ReportsActions.LoadReportNames(type));

  loadReportRoles = (reportRolePayload: {
    reportDes?: string;
    roleCode?: string;
  }) =>
    this.store.dispatch(new ReportsActions.LoadReportRoles(reportRolePayload));

  loadReportFields = (reportId: string) =>
    this.store.dispatch(new ReportsActions.LoadReportFields(reportId));

  loadReportSettings = (reportSettingPayload: {
    reportId?: string;
    roleCode?: string;
  }) =>
    this.store.dispatch(
      new ReportsActions.LoadReportSettings(reportSettingPayload)
    );

  saveReportSettings = (data: {
    reportId: string;
    request: SaveReportPayload;
  }) => this.store.dispatch(new ReportsActions.SaveReportSettings(data));

  saveReportRoleSettings = (data: {
    roleCode: string;
    request: SaveReportRolePayload;
  }) => this.store.dispatch(new ReportsActions.SaveReportRoleSettings(data));

  generateReport = (data: {
    reportId: string;
    request: GenerateReportRequest;
  }) => this.store.dispatch(new ReportsActions.GenerateReport(data));

  downloadReport = (data: { reportId: string; selectedTab: number }) =>
    this.store.dispatch(new ReportsActions.DownloadReport(data));

  loadReports = (data: LoadReportPayload) =>
    this.store.dispatch(new ReportsActions.LoadReports(data));

  loadBrands() {
    this.store.dispatch(new ReportsActions.LoadBrands());
  }

  loadSubBrands(payload: string[]) {
    this.store.dispatch(new ReportsActions.LoadSubBrands(payload));
  }

  loadRegions() {
    this.store.dispatch(new ReportsActions.LoadRegions());
  }
  loadLevels() {
    this.store.dispatch(new ReportsActions.LoadLevels());
  }

  loadCountries() {
    this.store.dispatch(new ReportsActions.LoadCountries());
  }

  loadStates(stateCode: string) {
    this.store.dispatch(new ReportsActions.LoadStates(stateCode));
  }
  loadTowns(townCode: string) {
    this.store.dispatch(new ReportsActions.LoadTowns(townCode));
  }
  loadLocations(data: ReportBTQCodePayload) {
    this.store.dispatch(new ReportsActions.LoadLocations(data));
  }
  loadProductGroups() {
    this.store.dispatch(new ReportsActions.LoadProductGroups());
  }

  loadProductCategories() {
    this.store.dispatch(new ReportsActions.LoadProductCategories());
  }
  loadBinGroups() {
    this.store.dispatch(new ReportsActions.LoadBinGroups());
  }
  loadBinCodes(binGroup: string) {
    this.store.dispatch(new ReportsActions.LoadBinCodes(binGroup));
  }
  loadPaymentType() {
    this.store.dispatch(new ReportsActions.LoadPaymentType());
  }
  loadRoles() {
    this.store.dispatch(new ReportsActions.LoadRoles());
  }
  loadTransferTypes() {
    this.store.dispatch(new ReportsActions.LoadTransferTypes());
  }
  loadSearchParameter(loadSearchParameterPayload: LoadSearchParameterPayload) {
    this.store.dispatch(
      new ReportsActions.LoadSearchParameter(loadSearchParameterPayload)
    );
  }
  updateSearchParameter(
    updateSearchParametersPayload: UpdateSearchParametersPayload
  ) {
    this.store.dispatch(
      new ReportsActions.UpdateSearchParameter(updateSearchParametersPayload)
    );
  }
  saveSearchParameter(
    saveSearchParametersPayload: SaveSearchParametersPayload
  ) {
    this.store.dispatch(
      new ReportsActions.SaveSearchParameter(saveSearchParametersPayload)
    );
  }
  saveIndividualSetting(
    saveIndividualReportSetting: SaveIndividualReportSetting
  ) {
    this.store.dispatch(
      new ReportsActions.SaveIndividualSetting(saveIndividualReportSetting)
    );
  }
  loadExcludedIndividualSetting(
    loadExcludedSettingRequestPayload: LoadExcludedSettingRequestPayload
  ) {
    this.store.dispatch(
      new ReportsActions.LoadExcludedIndividualSetting(
        loadExcludedSettingRequestPayload
      )
    );
  }

  updateIndividualSetting(
    updateIndividualReportSetting: UpdateIndividualReportSetting
  ) {
    this.store.dispatch(
      new ReportsActions.UpdateIndividualSetting(updateIndividualReportSetting)
    );
  }
  loadIndividualSetting(reportId: string) {
    this.store.dispatch(new ReportsActions.LoadIndividualSetting(reportId));
  }

  loadCnType() {
    this.store.dispatch(new ReportsActions.LoadCnType());
  }
  loadCnStatus() {
    this.store.dispatch(new ReportsActions.LoadCnStatus());
  }

  loadComplexityCode() {
    this.store.dispatch(new ReportsActions.LoadComplexity());
  }

  loadKaratage() {
    this.store.dispatch(new ReportsActions.LoadKaratage());
  }
  loadRso(payload: { locationCodes?: string[]; roleCodes?: string[] }) {
    this.store.dispatch(new ReportsActions.LoadRso(payload));
  }
  clearReportsData() {
    this.store.dispatch(new ReportsActions.ClearReportsData());
  }
}
