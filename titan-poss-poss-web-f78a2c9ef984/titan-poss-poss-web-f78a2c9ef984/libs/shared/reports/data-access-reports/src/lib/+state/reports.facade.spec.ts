import { ReportBTQCodePayload } from '@poss-web/shared/models';
import { Store } from '@ngrx/store';

import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

import { ReportsFacade } from './reports.facade';

import { ReportsState } from './reports.state';
import {
  LoadReportGroups,
  LoadReportNames,
  LoadReportRoles,
  LoadReportFields,
  LoadReportSettings,
  SaveReportSettings,
  SaveReportRoleSettings,
  GenerateReport,
  DownloadReport,
  LoadReports,
  LoadBrands,
  LoadLevels,
  LoadRegions,
  LoadCountries,
  LoadStates,
  LoadTowns,
  LoadLocations,
  LoadProductGroups,
  LoadProductCategories,
  LoadBinGroups,
  LoadBinCodes,
  ClearReportsData
} from './reports.actions';

describe(' ReportsFacade Testing Suite', () => {
  const initialState: ReportsState = {
    reportGroups: [],
    reportNames: [],
    reportRoles: [],
    reportFields: [],
    reportSettings: [],
    error: null,
    reports: [],
    brands: [],
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
    autoReportList: [],
    searchParameterResponse: null,
    saveSearchResponse: null,
    templateId: null,
    templateName: null,
    cnStatus: null,
    cnType: null,
    karatage: [],
    complexityCode: [],
    rso: [],
    transferTypes: null,
    applicableReportNames: null,
    subBrands: []
  };

  let reportsFacade: ReportsFacade;
  let store: MockStore<ReportsFacade>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), ReportsFacade]
    });
    store = TestBed.inject<any>(Store);
    reportsFacade = TestBed.inject<any>(ReportsFacade);
  });

  describe('Dispatch Actions action', () => {
    it('should call LOAD_REPORT_GROUPS action', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new LoadReportGroups();
      reportsFacade.loadReportGroups();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_REPORT_NAMES action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload = 'INVENTORY_GROUP';
      const action = new LoadReportNames(payload);
      reportsFacade.loadReportNames(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_REPORT_ROLES action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload = {
        roleCode: 'commercial'
      };
      const action = new LoadReportRoles(payload);
      reportsFacade.loadReportRoles(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_REPORT_FIELDS action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload = '1';
      const action = new LoadReportFields(payload);
      reportsFacade.loadReportFields(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_REPORT_SETTINGS action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload = {
        roleCode: 'commercial'
      };
      const action = new LoadReportSettings(payload);
      reportsFacade.loadReportSettings(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SAVE_REPORT_SETTINGS action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload = {
        reportId: '1',
        request: {
          addRoles: [
            {
              reportFieldId: '1',
              isExcluded: true,
              isMasked: true,
              roleCode: 'commercial'
            }
          ],
          removeRoles: []
        }
      };
      const action = new SaveReportSettings(payload);
      reportsFacade.saveReportSettings(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SAVE_REPORT_ROLE_SETTINGS action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload = {
        roleCode: 'commercial',
        request: {
          addAccess: [
            {
              fromAccessTime: '10:05',
              toAccessTime: '11:05',
              reportId: '1'
            }
          ],
          removeAccess: [],
          updateAccess: []
        }
      };
      const action = new SaveReportRoleSettings(payload);
      reportsFacade.saveReportRoleSettings(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call GENERATE_REPORT action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload = {
        reportId: '1',
        request: {
          fromDate: '12-03-2021',
          toDate: '16-03-2021',
          locationCode: ['URB'],
          ownerType: ['L1'],
          reportType: 'SUMMARY',
          countryId: '1',
          stateId: '29',
          subBrandCode: ['mia'],
          brandCode: ['mia'],
          subRegionCode: 'east',
          townId: ['1'],
          customFields: {
            data: {}
          }
        }
      };
      const action = new GenerateReport(payload);
      reportsFacade.generateReport(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call DOWNLOAD_REPORT action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload = { reportId: '1', selectedTab: 0 };
      const action = new DownloadReport(payload);
      reportsFacade.downloadReport(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call UPDATE_SELECTED_DATE action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload = {
        pageSize: 1,
        pageIndex: 10,
        reportDesc: 'STOCK RECEIVE',
        reportGroup: 'INVENTORY ',
        reportStatus: 'completed',
        referenceNumber: '102',
        fromDate: '12-03-2021',
        toDate: '15-03-2021',
        selectedTab: 1
      };
      const action = new LoadReports(payload);
      reportsFacade.loadReports(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_BRANDS action', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new LoadBrands();
      reportsFacade.loadBrands();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_LEVELS action', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new LoadLevels();
      reportsFacade.loadLevels();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_REGIONS action', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new LoadRegions();
      reportsFacade.loadRegions();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_COUNTRIES action', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new LoadCountries();
      reportsFacade.loadCountries();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LOAD_STATES action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload = 'IND';
      const action = new LoadStates(payload);
      reportsFacade.loadStates(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_TOWNS action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload = '29';
      const action = new LoadTowns(payload);
      reportsFacade.loadTowns(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LOAD_LOCAITONS action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: ReportBTQCodePayload = {
        brands: ['TANISHQ'],
        regions: [],
        levels: [],
        towns: [],
        states: [],
        countries: []
      };
      const action = new LoadLocations(payload);
      reportsFacade.loadLocations(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LOAD_PRODUCT_GROUPS action', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new LoadProductGroups();
      reportsFacade.loadProductGroups();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LOAD_PRODUCT_CATEGORIES action', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new LoadProductCategories();
      reportsFacade.loadProductCategories();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_BIN_GROUPS action', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new LoadBinGroups();
      reportsFacade.loadBinGroups();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_BIN_CODES action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload = 'DEFECTIVE';
      const action = new LoadBinCodes(payload);
      reportsFacade.loadBinCodes(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call CLEAR_REPORTS_DATA action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new ClearReportsData();
      reportsFacade.clearReportsData();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });

  describe('Access Selector action', () => {
    it('should access the getRoles selector action', () => {
      expect(reportsFacade.getRoles()).toEqual(reportsFacade['roles$']);
    });

    it('should access the getPaymentType selector action', () => {
      expect(reportsFacade.getPaymentType()).toEqual(
        reportsFacade['paymentType$']
      );
    });

    it('should access the getSaveReportResponse selector action', () => {
      expect(reportsFacade.getSaveReportResponse()).toEqual(
        reportsFacade['saveReportResponse$']
      );
    });
    it('should access the getGenerateReportResponse selector action', () => {
      expect(reportsFacade.getGenerateReportResponse()).toEqual(
        reportsFacade['generateReportResponse$']
      );
    });
    it('should access the getTotalReports selector action', () => {
      expect(reportsFacade.getTotalReports()).toEqual(
        reportsFacade['totalReports$']
      );
    });
    it('should access the getError selector action', () => {
      expect(reportsFacade.getError()).toEqual(reportsFacade['error$']);
    });

    it('should access the getIsLoadingReports selector action', () => {
      expect(reportsFacade.getIsLoadingReports()).toEqual(
        reportsFacade['isLoadingReports$']
      );
    });
    it('should access the getBinCodes selector action', () => {
      expect(reportsFacade.getBinCodes()).toEqual(reportsFacade['binCodes$']);
    });
    it('should access the getIsLoading selector action', () => {
      expect(reportsFacade.getIsLoading()).toEqual(reportsFacade['isLoading$']);
    });
    it('should access the getReportGroups selector action', () => {
      expect(reportsFacade.getReportGroups()).toEqual(
        reportsFacade['reportGroups$']
      );
    });

    it('should access the getReportNames selector action', () => {
      expect(reportsFacade.getReportNames()).toEqual(
        reportsFacade['reportNames$']
      );
    });
    it('should access the getReportRoles selector action', () => {
      expect(reportsFacade.getReportRoles()).toEqual(
        reportsFacade['reportRoles$']
      );
    });

    it('should access the getReportFields selector action', () => {
      expect(reportsFacade.getReportFields()).toEqual(
        reportsFacade['reportFields$']
      );
    });

    it('should access the getReportSettings selector action', () => {
      expect(reportsFacade.getReportSettings()).toEqual(
        reportsFacade['reportSettings$']
      );
    });

    it('should access the getReports selector action', () => {
      expect(reportsFacade.getReports()).toEqual(reportsFacade['reports$']);
    });

    it('should access the getBrands selector action', () => {
      expect(reportsFacade.getBrands()).toEqual(reportsFacade['brands$']);
    });
    it('should access the getRegions selector action', () => {
      expect(reportsFacade.getRegions()).toEqual(reportsFacade['regions$']);
    });
    it('should access the getLevels selector action', () => {
      expect(reportsFacade.getLevels()).toEqual(reportsFacade['levels$']);
    });
    it('should access the getCountries selector action', () => {
      expect(reportsFacade.getCountries()).toEqual(reportsFacade['countries$']);
    });
    it('should access the getStates selector action', () => {
      expect(reportsFacade.getStates()).toEqual(reportsFacade['states$']);
    });

    it('should access the getTowns selector action', () => {
      expect(reportsFacade.getTowns()).toEqual(reportsFacade['towns$']);
    });
    it('should access the getLocations selector action', () => {
      expect(reportsFacade.getLocations()).toEqual(reportsFacade['locations$']);
    });
    it('should access the getProductGroups selector action', () => {
      expect(reportsFacade.getProductGroups()).toEqual(
        reportsFacade['productGroups$']
      );
    });
    it('should access the getProductCategories selector action', () => {
      expect(reportsFacade.getProductCategories()).toEqual(
        reportsFacade['productCategories$']
      );
    });
    it('should access the getAutoReportList selector action', () => {
      expect(reportsFacade.getAutoReportList()).toEqual(
        reportsFacade['autoReportList$']
      );
    });

    it('should access the getComplexityCode selector action', () => {
      expect(reportsFacade.getComplexityCode()).toEqual(
        reportsFacade['complexityCode$']
      );
    });

    it('should access the getKaratage selector action', () => {
      expect(reportsFacade.getKaratage()).toEqual(
        reportsFacade['karatage$']
      );
    });


    it('should access the getRso selector action', () => {
      expect(reportsFacade.getRso()).toEqual(
        reportsFacade['rso$']
      );
    });

    it('should access the getCnStatus selector action', () => {
      expect(reportsFacade.getCnStatus()).toEqual(
        reportsFacade['cnStatus$']
      );
    });

    it('should access the getCnType selector action', () => {
      expect(reportsFacade.getCnType()).toEqual(
        reportsFacade['cnType$']
      );
    });

    it('should access the getTemplateName selector action', () => {
      expect(reportsFacade.getTemplateName()).toEqual(
        reportsFacade['templateName$']
      );
    });

    it('should access the getTemplateId selector action', () => {
      expect(reportsFacade.getTemplateId()).toEqual(
        reportsFacade['templateId$']
      );
    });

    it('should access the getSaveSearchResponse selector action', () => {
      expect(reportsFacade.getSaveSearchResponse()).toEqual(
        reportsFacade['saveSearchResponse$']
      );
    });

    it('should access the getSearchParameter selector action', () => {
      expect(reportsFacade.getSearchParameter()).toEqual(
        reportsFacade['searchParameter$']
      );
    });

    it('should access the getTransferTypes selector action', () => {
      expect(reportsFacade.getTransferTypes()).toEqual(
        reportsFacade['transferTypes$']
      );
    });

    it('should access the getApplicableReportNames selector action', () => {
      expect(reportsFacade.getApplicableReportNames()).toEqual(
        reportsFacade['applicableReportNames$']
      );
    });

    it('should access the getSubBrands selector action', () => {
      expect(reportsFacade.getSubBrands()).toEqual(
        reportsFacade['subBrands$']
      );
    });
  });
});
