//you here need to assert a reactive result as well as trigger an effect.
//To assert that an effect returns the right observable stream, we can use
// Rx Marbles.
import { Observable } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';

import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClient } from '@angular/common/http';

import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { DataPersistence } from '@nrwl/angular';
import {
  LoadAutoReportPayload,
  LoadAutoReportResponse,
  SaveAutoReportPayload,
  AutoReportList,
  PaymentCodeList,
  ReportGroupLov,
  ReportName,
  ReportRoleSetting,
  ReportField,
  CheckBoxSelectedOption,
  ReportReponse,
  BrandSummary,
  RegionSummary,
  Lov,
  CountrySummary,
  StateSummary,
  TownSummary,
  ReportBTQCodePayload,
  LocationSummaryList,
  ProductGroup,
  BinGroup,
  BinCode,
  ProductCategory,
  Karatage
} from '@poss-web/shared/models';

import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { ReportsEffect } from './reports.effect';
import { ReportsService } from '../reports.service';
import {
  BrandDataService,
  RegionDataService,
  LovDataService,
  CountryDataService,
  StateDataService,
  TownDataService,
  LocationDataService,
  ProductGroupDataService,
  ProductCategoryDataService,
  BinDataService,
  PaymentDataService,
  StoreUserDataService
} from '@poss-web/shared/masters/data-access-masters';
import {
  LoadAutoReportListSuccess,
  LoadAutoReportList,
  LoadAutoReportListFailures,
  SaveAutoReportSettings,
  SaveAutoReportSettingsFailure,
  SaveAutoReportSettingsSuccess,
  LoadRoles,
  LoadRolesSuccess,
  LoadRolesFailure,
  LoadPaymentType,
  LoadPaymentTypeSuccess,
  LoadPaymentTypeFailure,
  LoadReportGroups,
  LoadReportGroupsSuccess,
  LoadReportGroupsFailure,
  LoadReportNames,
  LoadReportNamesSuccess,
  LoadReportNamesFailure,
  LoadReportRoles,
  LoadReportRolesSuccess,
  LoadReportRolesFailure,
  SaveReportRoleSettings,
  SaveReportRoleSettingsSuccess,
  SaveReportRoleSettingsFailure,
  LoadReportFieldsFailure,
  LoadReportFields,
  LoadReportFieldsSuccess,
  LoadReportSettings,
  LoadReportSettingsSuccess,
  LoadReportSettingsFailure,
  SaveReportSettingsFailure,
  SaveReportSettingsSuccess,
  SaveReportSettings,
  GenerateReportSuccess,
  GenerateReportFailure,
  GenerateReport,
  LoadReportsFailure,
  LoadReports,
  LoadReportsSuccess,
  DownloadReportSuccess,
  DownloadReportFailure,
  DownloadReport,
  LoadBrandsSuccess,
  LoadBrandsFailure,
  LoadBrands,
  LoadRegionsSuccess,
  LoadRegionsFailure,
  LoadRegions,
  LoadLevelsSuccess,
  LoadLevels,
  LoadLevelsFailure,
  LoadCountriesSuccess,
  LoadCountriesFailure,
  LoadCountries,
  LoadStatesFailure,
  LoadStatesSuccess,
  LoadStates,
  LoadTownsSuccess,
  LoadTownsFailure,
  LoadTowns,
  LoadLocationsSuccess,
  LoadLocationsFailure,
  LoadLocations,
  LoadProductGroupsSuccess,
  LoadProductGroupsFailure,
  LoadProductGroups,
  LoadBinGroupsSuccess,
  LoadBinGroupsFailure,
  LoadBinGroups,
  LoadBinCodesSuccess,
  LoadBinCodesFailure,
  LoadBinCodes,
  LoadProductCategories,
  LoadProductCategoriesSuccess,
  LoadProductCategoriesFailure,
  LoadRso,
  LoadRsoSuccess,
  LoadRsoFailure,
  LoadKaratage,
  LoadKaratageSuccess,
  LoadKaratageFailure
} from './reports.actions';

describe('ReportsEffect Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: ReportsEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  const brandDataService = jasmine.createSpyObj<BrandDataService>([
    'getBrandSummary'
  ]);

  const regionDataService = jasmine.createSpyObj<RegionDataService>([
    'getRegionSummary'
  ]);
  const lovDataService = jasmine.createSpyObj<LovDataService>([
    'getLocationLovs'
  ]);
  const countryDataService = jasmine.createSpyObj<CountryDataService>([
    'getCountrySummary'
  ]);
  const stateDataService = jasmine.createSpyObj<StateDataService>([
    'getStatesSummary'
  ]);
  const townDataService = jasmine.createSpyObj<TownDataService>([
    'getTownsSummary'
  ]);
  const locationDataService = jasmine.createSpyObj<LocationDataService>([
    'getLocationSummaryList'
  ]);
  const productGroupDataService = jasmine.createSpyObj<ProductGroupDataService>(
    ['getProductGroups']
  );
  const productCategoryDataService = jasmine.createSpyObj<
    ProductCategoryDataService
  >(['getProductCategories']);
  const binDataService = jasmine.createSpyObj<BinDataService>([
    'getBinDetails'
  ]);

  const paymentDataService = jasmine.createSpyObj<PaymentDataService>([
    'getPaymentModes'
  ]);

  const storeUserDataService = jasmine.createSpyObj<StoreUserDataService>([
    'getStoreUsers',
    'getKaratage'
  ]);

  let reportsService = jasmine.createSpyObj<ReportsService>('ReportsService', [
    'generateReport',
    'downloadReport',
    'getBinGroups',
    'loadReports',
    'loadReportGroups',
    'loadReportNames',
    'loadReportRoles',
    'loadReportFields',
    'loadReportSettings',
    'saveReportRoleSetting',
    'saveReportSettings',
    'getAutoReportList',
    'saveAutoReportSettings',
    'getRoles',
    'getKaratage'
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ReportsEffect,
        DataPersistence,
        provideMockStore({ initialState }),
        provideMockActions(() => actions$),
        {
          provide: POSS_WEB_API_URL,
          useValue: ''
        },

        {
          provide: HttpClient,
          useValue: httpClientSpy
        },
        {
          provide: BrandDataService,
          useValue: brandDataService
        },
        {
          provide: RegionDataService,
          useValue: regionDataService
        },
        {
          provide: LovDataService,
          useValue: lovDataService
        },
        {
          provide: CountryDataService,
          useValue: countryDataService
        },
        {
          provide: StateDataService,
          useValue: stateDataService
        },
        {
          provide: TownDataService,
          useValue: townDataService
        },

        {
          provide: LocationDataService,
          useValue: locationDataService
        },
        {
          provide: ProductGroupDataService,
          useValue: productGroupDataService
        },
        {
          provide: ProductCategoryDataService,
          useValue: productCategoryDataService
        },
        {
          provide: BinDataService,
          useValue: binDataService
        },
        {
          provide: PaymentDataService,
          useValue: paymentDataService
        },
        {
          provide: StoreUserDataService,
          useValue: storeUserDataService
        },
        {
          provide: ReportsService,
          useValue: {
            searchSavedLocationPriceByLocationCode: jasmine.createSpy(),
            generateReport: jasmine.createSpy(),
            downloadReport: jasmine.createSpy(),
            getBinGroups: jasmine.createSpy(),
            loadReports: jasmine.createSpy(),
            loadReportGroups: jasmine.createSpy(),
            loadReportNames: jasmine.createSpy(),
            loadReportRoles: jasmine.createSpy(),
            loadReportFields: jasmine.createSpy(),
            loadReportSettings: jasmine.createSpy(),
            saveReportRoleSetting: jasmine.createSpy(),
            saveReportSettings: jasmine.createSpy(),
            getAutoReportList: jasmine.createSpy(),
            saveAutoReportSettings: jasmine.createSpy(),
            getRoles: jasmine.createSpy(),
            getKaratage: jasmine.createSpy()
          }
        }
      ]
    });

    effect = TestBed.inject(ReportsEffect);
    reportsService = TestBed.inject<any>(ReportsService);
  });

  describe('loadAutoReportList', () => {
    it('should return a stream with auto report list', () => {
      const payload: LoadAutoReportPayload = {
        pageIndex: 0,
        pageSize: 10
      };
      const res: LoadAutoReportResponse = {
        autoReportList: [
          {
            reportDescription: 'stock receive detail',
            reportId: '1',
            cronExpression: '* * * * * *',
            frequency: 'DAILY',
            isAutoGenerated: true,
            id: '1'
          }
        ],
        totalElements: 1
      };

      const action = new LoadAutoReportList(payload);
      const outcome = new LoadAutoReportListSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      reportsService.getAutoReportList.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadAutoReportList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: LoadAutoReportPayload = {
        pageIndex: 0,
        pageSize: 10
      };
      const action = new LoadAutoReportList(payload);
      const error = new Error('some error');
      const outcome = new LoadAutoReportListFailures(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      reportsService.getAutoReportList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadAutoReportList$).toBeObservable(expected);
    });
  });

  describe('saveAutoReportSettings', () => {
    it('should return a stream with saved auto report setting', () => {
      const payload: SaveAutoReportPayload = {
        addScheduler: [
          {
            reportId: '1',
            cronExpression: '* * * * * *',
            frequency: 'DAILY'
          }
        ],
        removeScheduler: [],
        updateScheduler: []
      };
      const res: AutoReportList = {
        reportDescription: 'stock receive detail',
        reportId: '1',
        cronExpression: '* * * * * *',
        frequency: 'DAILY',
        isAutoGenerated: true,
        id: '1'
      };

      const action = new SaveAutoReportSettings(payload);
      const outcome = new SaveAutoReportSettingsSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      reportsService.saveAutoReportSettings.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveAutoReportSettings$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: SaveAutoReportPayload = {
        addScheduler: [
          {
            reportId: '1',
            cronExpression: '* * * * * *',
            frequency: 'DAILY'
          }
        ],
        removeScheduler: [],
        updateScheduler: []
      };
      const action = new SaveAutoReportSettings(payload);
      const error = new Error('some error');
      const outcome = new SaveAutoReportSettingsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      reportsService.saveAutoReportSettings.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.saveAutoReportSettings$).toBeObservable(expected);
    });
  });

  describe('loadRoles', () => {
    it('should return a stream with roles', () => {
      const res = [
        {
          roleCode: 'Commercial',
          roleName: 'commercial'
        }
      ];

      const action = new LoadRoles();
      const outcome = new LoadRolesSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      reportsService.getRoles.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadRoles$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadRoles();
      const error = new Error('some error');
      const outcome = new LoadRolesFailure(CustomErrorAdaptor.fromJson(error));
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      reportsService.getRoles.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadRoles$).toBeObservable(expected);
    });
  });

  describe('loadPaymentTypes', () => {
    it('should return a stream with payment mode list', () => {
      const res: PaymentCodeList[] = [
        {
          paymentCode: 'cash'
        }
      ];

      const action = new LoadPaymentType();
      const outcome = new LoadPaymentTypeSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      paymentDataService.getPaymentModes.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadPaymentTypes$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadPaymentType();
      const error = new Error('some error');
      const outcome = new LoadPaymentTypeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      paymentDataService.getPaymentModes.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadPaymentTypes$).toBeObservable(expected);
    });
  });

  describe('loadReportGroups', () => {
    it('should return a stream with report group list', () => {
      const res: ReportGroupLov[] = [
        {
          code: 'INVENTORY_REPORT',
          value: 'Inventory Report'
        }
      ];
      const action = new LoadReportGroups();
      const outcome = new LoadReportGroupsSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      reportsService.loadReportGroups.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadReportGroups$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadReportGroups();
      const error = new Error('some error');
      const outcome = new LoadReportGroupsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      reportsService.loadReportGroups.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadReportGroups$).toBeObservable(expected);
    });
  });

  describe('loadReportNames', () => {
    it('should return a stream with location code list', () => {
      const payload = 'INVENTORY_GROUP';
      const res: ReportName[] = [
        {
          reportDes: 'stock receive details',
          reportGroup: 'Inventory Group',
          reportType: 'DETIAL',
          maxNoOfDays: 90,
          name: 'STOCK RECEIVE DETAIL',
          id: '1'
        }
      ];

      const action = new LoadReportNames(payload);
      const outcome = new LoadReportNamesSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      reportsService.loadReportNames.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadReportNames).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload = 'INVENTORY_GROUP';

      const action = new LoadReportNames(payload);
      const error = new Error('some error');
      const outcome = new LoadReportNamesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      reportsService.loadReportNames.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadReportNames).toBeObservable(expected);
    });
  });

  describe('loadReportRoles', () => {
    it('should return a stream with reprots mapped with roles list', () => {
      const payload = {
        roleCode: 'commercial'
      };
      const res: ReportRoleSetting[] = [
        {
          id: '1',
          reportId: '2',
          reportName: 'Stock receive detail',
          fromAccessTime: '10:20',
          toAccessTime: '10:30'
        }
      ];

      const action = new LoadReportRoles(payload);
      const outcome = new LoadReportRolesSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      reportsService.loadReportRoles.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadReportRoles).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload = {
        reportDes: 'Stock receive detail'
      };

      const action = new LoadReportRoles(payload);
      const error = new Error('some error');
      const outcome = new LoadReportRolesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      reportsService.loadReportRoles.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadReportRoles).toBeObservable(expected);
    });
  });

  describe('saveReportRoleSettings', () => {
    it('should return a stream with savereportsetting success stream', () => {
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
      const outcome = new SaveReportRoleSettingsSuccess();
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: {} });
      reportsService.saveReportRoleSetting.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveReportRoleSettings).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
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
      const error = new Error('some error');
      const outcome = new SaveReportRoleSettingsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      reportsService.saveReportRoleSetting.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.saveReportRoleSettings).toBeObservable(expected);
    });
  });

  describe('loadReportFields', () => {
    it('should return a stream with  report fields', () => {
      const payload = '1';
      const res: ReportField[] = [
        {
          reportFieldId: '1',
          fieldName: 'Location code'
        }
      ];
      const action = new LoadReportFields(payload);
      const outcome = new LoadReportFieldsSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      reportsService.loadReportFields.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadReportFields).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload = '1';
      const action = new LoadReportFields(payload);
      const error = new Error('some error');
      const outcome = new LoadReportFieldsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      reportsService.loadReportFields.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadReportFields).toBeObservable(expected);
    });
  });

  describe('loadReportSettings', () => {
    it('should return a stream with role with report column maping detaisl', () => {
      const payload = {
        roleCode: 'commercial'
      };
      const res: CheckBoxSelectedOption[] = [
        {
          id: '1',
          rowHeaderKey: 'Location code',
          columnHeaderKey: 'isExclude'
        }
      ];
      const action = new LoadReportSettings(payload);
      const outcome = new LoadReportSettingsSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      reportsService.loadReportSettings.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadReportSettings).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload = {
        roleCode: 'commercial'
      };
      const action = new LoadReportSettings(payload);
      const error = new Error('some error');
      const outcome = new LoadReportSettingsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      reportsService.loadReportSettings.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadReportSettings).toBeObservable(expected);
    });
  });

  describe('saveReportSettings', () => {
    it('should return a stream with SaveReportSettingsSuccess', () => {
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
      const outcome = new SaveReportSettingsSuccess();
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: {} });
      reportsService.saveReportSettings.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveReportSettings).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
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
      const error = new Error('some error');
      const outcome = new SaveReportSettingsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      reportsService.saveReportSettings.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.saveReportSettings).toBeObservable(expected);
    });
  });

  describe('generateReport', () => {
    it('should return a stream with report id generated', () => {
      const payload = {
        reportId: '1',
        request: {
          fromDate: '12-03-2021',
          brandCode: ['mia'],
          toDate: '16-03-2021',
          locationCode: ['URB'],
          ownerType: ['L1'],
          reportType: 'SUMMARY',
          countryId: '1',
          stateId: '29',
          subBrandCode: ['mia'],
          subRegionCode: 'east',
          townId: ['1'],
          customFields: {
            data: {}
          }
        }
      };
      const res = '120';

      const action = new GenerateReport(payload);
      const outcome = new GenerateReportSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      reportsService.generateReport.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.generateReport).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
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
      const error = new Error('some error');
      const outcome = new GenerateReportFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      reportsService.generateReport.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.generateReport).toBeObservable(expected);
    });
  });

  describe('loadReports', () => {
    it('should return a stream with list of reports', () => {
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
      const res: ReportReponse = {
        reports: [
          {
            reportType: 'SUMMARY',
            reportDes: 'STOCK RECEIVE',
            reportMasterId: '1',
            status: 'completed',
            id: '1'
          }
        ],
        totalReports: 1
      };

      const action = new LoadReports(payload);
      const outcome = new LoadReportsSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      reportsService.loadReports.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadReports).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
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
      const error = new Error('some error');
      const outcome = new LoadReportsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      reportsService.loadReports.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadReports).toBeObservable(expected);
    });
  });

  describe('downloadReport', () => {
    it('should return a stream with DownloadReportSuccess', () => {
      const payload = { reportId: '1', selectedTab: 0 };

      const action = new DownloadReport(payload);
      const outcome = new DownloadReportSuccess();
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: {} });
      reportsService.downloadReport.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.downloadReport).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload = { reportId: '1', selectedTab: 0 };
      const action = new DownloadReport(payload);
      const error = new Error('some error');
      const outcome = new DownloadReportFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      reportsService.downloadReport.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.downloadReport).toBeObservable(expected);
    });
  });

  describe('loadBrand$', () => {
    it('should return a stream with list of brands', () => {
      const res: BrandSummary[] = [
        {
          brandCode: 'Tanishq',
          description: 'Tanishq'
        }
      ];

      const action = new LoadBrands();
      const outcome = new LoadBrandsSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      brandDataService.getBrandSummary.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadBrands$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadBrands();
      const error = new Error('some error');
      const outcome = new LoadBrandsFailure(CustomErrorAdaptor.fromJson(error));
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      brandDataService.getBrandSummary.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadBrands$).toBeObservable(expected);
    });
  });

  describe('loadRegions$', () => {
    it('should return a stream with region list', () => {
      const res: RegionSummary[] = [
        {
          regionCode: 'EAST',
          description: 'EAST'
        }
      ];

      const action = new LoadRegions();
      const outcome = new LoadRegionsSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      regionDataService.getRegionSummary.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadRegions$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadRegions();
      const error = new Error('some error');
      const outcome = new LoadRegionsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      regionDataService.getRegionSummary.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadRegions$).toBeObservable(expected);
    });
  });

  describe('loadLevels$', () => {
    it('should return a stream with region levels', () => {
      const res: Lov[] = [
        {
          code: 'L1',
          value: 'LEVEL 1',
          isActive: true
        }
      ];

      const action = new LoadLevels();
      const outcome = new LoadLevelsSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      lovDataService.getLocationLovs.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadLevels$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadLevels();
      const error = new Error('some error');
      const outcome = new LoadLevelsFailure(CustomErrorAdaptor.fromJson(error));
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      lovDataService.getLocationLovs.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadLevels$).toBeObservable(expected);
    });
  });

  describe('loadCountries$', () => {
    it('should return a stream with countries', () => {
      const res: CountrySummary[] = [
        {
          countryCode: 'IND',
          description: 'India',
          isdCode: '+91'
        }
      ];

      const action = new LoadCountries();
      const outcome = new LoadCountriesSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      countryDataService.getCountrySummary.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadCountries$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadCountries();
      const error = new Error('some error');
      const outcome = new LoadCountriesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      countryDataService.getCountrySummary.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadCountries$).toBeObservable(expected);
    });
  });

  describe('loadStates$', () => {
    it('should return a stream with state list', () => {
      const payload = 'IND';
      const res: StateSummary[] = [
        {
          stateId: 29,
          description: 'Karanataka'
        }
      ];

      const action = new LoadStates(payload);
      const outcome = new LoadStatesSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      stateDataService.getStatesSummary.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadStates$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload = 'IND';
      const action = new LoadStates(payload);
      const error = new Error('some error');
      const outcome = new LoadStatesFailure(CustomErrorAdaptor.fromJson(error));
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      stateDataService.getStatesSummary.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadStates$).toBeObservable(expected);
    });
  });

  describe('loadTowns$', () => {
    it('should return a stream with town list', () => {
      const payload = '29';
      const res: TownSummary[] = [
        {
          townCode: 10,
          description: 'Bangalore'
        }
      ];

      const action = new LoadTowns(payload);
      const outcome = new LoadTownsSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      townDataService.getTownsSummary.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadTowns$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload = '29';
      const action = new LoadTowns(payload);
      const error = new Error('some error');
      const outcome = new LoadTownsFailure(CustomErrorAdaptor.fromJson(error));
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      townDataService.getTownsSummary.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadTowns$).toBeObservable(expected);
    });
  });

  describe('loadLocations$', () => {
    it('should return a stream with Location list', () => {
      const payload: ReportBTQCodePayload = {
        brands: ['TANISHQ'],
        regions: [],
        levels: [],
        towns: [],
        states: [],
        countries: []
      };
      const res: LocationSummaryList[] = [
        {
          locationCode: 'URB',
          description: 'Bangalore'
        }
      ];

      const action = new LoadLocations(payload);
      const outcome = new LoadLocationsSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      locationDataService.getLocationSummaryList.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadLocations$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: ReportBTQCodePayload = {
        brands: ['TANISHQ'],
        regions: [],
        levels: [],
        towns: [],
        states: [],
        countries: []
      };
      const action = new LoadLocations(payload);
      const error = new Error('some error');
      const outcome = new LoadLocationsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      locationDataService.getLocationSummaryList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadLocations$).toBeObservable(expected);
    });
  });

  describe('loadProductGroups$', () => {
    it('should return a stream with product group list', () => {
      const res: ProductGroup[] = [
        {
          productGroupCode: '76',
          description: 'GOLD COIN'
        }
      ];

      const action = new LoadProductGroups();
      const outcome = new LoadProductGroupsSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      productGroupDataService.getProductGroups.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadProductGroups$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadProductGroups();
      const error = new Error('some error');
      const outcome = new LoadProductGroupsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      productGroupDataService.getProductGroups.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadProductGroups$).toBeObservable(expected);
    });
  });

  describe('loadProductCategories$', () => {
    it('should return a stream with product group list', () => {
      const res: ProductCategory[] = [
        {
          productCategoryCode: '76',
          description: 'GOLD COIN',
          isActive: true
        }
      ];

      const action = new LoadProductCategories();
      const outcome = new LoadProductCategoriesSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      productCategoryDataService.getProductCategories.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadProductCategories$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadProductCategories();
      const error = new Error('some error');
      const outcome = new LoadProductCategoriesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      productCategoryDataService.getProductCategories.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadProductCategories$).toBeObservable(expected);
    });
  });

  describe('loadBinGroups$', () => {
    it('should return a stream with Bin groups list', () => {
      const res: BinGroup[] = [
        {
          binGroupCode: '76',
          description: 'DEFECTIVE COIN',
          isActive: true
        }
      ];

      const action = new LoadBinGroups();
      const outcome = new LoadBinGroupsSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      reportsService.getBinGroups.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadBinGroups$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadBinGroups();
      const error = new Error('some error');
      const outcome = new LoadBinGroupsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      reportsService.getBinGroups.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadBinGroups$).toBeObservable(expected);
    });
  });

  describe('loadBinCodes$', () => {
    it('should return a stream with Bin code list', () => {
      const payload = 'DEFECTIVE';
      const res: BinCode[] = [
        {
          binCode: '76',
          description: 'DEFECTIVE COIN'
        }
      ];
      const action = new LoadBinCodes(payload);
      const outcome = new LoadBinCodesSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      binDataService.getBinDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadBinCodes$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload = 'DEFECTIVE';
      const action = new LoadBinCodes(payload);
      const error = new Error('some error');
      const outcome = new LoadBinCodesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      binDataService.getBinDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadBinCodes$).toBeObservable(expected);
    });
  });

  describe('loadRso$', () => {
    it('should return a stream with rso code list', () => {
      const payload = {
        locationCodes: 'CPD',
        roleCodes: []
      }
      const res: BinCode[] = [
        {
          binCode: '76',
          description: 'DEFECTIVE COIN'
        }
      ];
      const action = new LoadRso(payload as any);
      const outcome = new LoadRsoSuccess(['1','2']);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: [{employeeCode: '1'},{employeeCode: '2'}] });
      storeUserDataService.getStoreUsers.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadRso$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload = {
        locationCodes: 'CPD',
        roleCodes: []
      }
      const action = new LoadRso(payload as any);
      const error = new Error('some error');
      const outcome = new LoadRsoFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      storeUserDataService.getStoreUsers.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadRso$).toBeObservable(expected);
    });
  });

  describe('loadKaratage$', () => {
    it('should return a stream Karatage', () => {
      const payload = {
        locationCodes: 'CPD',
        roleCodes: []
      }
      const res: Karatage[] = [
        {
          karat: '18',
          description: 'Gold',
          materialCode: 'J'
        },
      ];
      const action = new LoadKaratage();
      const outcome = new LoadKaratageSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      reportsService.getKaratage.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadKaratage$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload = {
        locationCodes: 'CPD',
        roleCodes: []
      }
      const action = new LoadKaratage();
      const error = new Error('some error');
      const outcome = new LoadKaratageFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      reportsService.getKaratage.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadKaratage$).toBeObservable(expected);
    });
  });
});
