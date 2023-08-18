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
  PaymentDataService,
  BinDataService,
  StoreUserDataService
} from '@poss-web/shared/masters/data-access-masters';
import { ReportsActionTypes } from './reports.actions';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { LoggerService } from '@poss-web/shared/util-logger';
import { map, mergeMap } from 'rxjs/operators';
import { Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { DataPersistence } from '@nrwl/angular';
import { HttpErrorResponse } from '@angular/common/http';

import * as ReportsActions from './reports.actions';
import {
  CustomErrors,
  BrandSummary,
  RegionSummary,
  Lov,
  CountrySummary,
  StateSummary,
  TownSummary,
  LocationSummaryList,
  ProductGroup,
  ProductCategory,
  BinGroup,
  BinCode,
  ReportName,
  CheckBoxSelectedOption,
  ReportReponse,
  ReportField,
  ReportGroupLov,
  ReportRoleSetting,
  LoadAutoReportResponse,
  SearchParameter,
  LoadExcludedSettingPayload,
  StoreUser,
  LovMasterEnum
} from '@poss-web/shared/models';
import { ReportsService } from '../reports.service';
import { ReportsState } from './reports.state';

@Injectable()
export class ReportsEffect {
  constructor(
    private service: ReportsService,
    private loggerService: LoggerService,
    private dataPersistence: DataPersistence<ReportsState>,
    private brandDataService: BrandDataService,
    private regionDataService: RegionDataService,
    private lovDataService: LovDataService,
    private countryDataService: CountryDataService,
    private stateDataService: StateDataService,
    private townDataService: TownDataService,
    private locationDataService: LocationDataService,
    private productGroupDataService: ProductGroupDataService,
    private productCategoryDataService: ProductCategoryDataService,
    private binDataService: BinDataService,
    private paymentDataService: PaymentDataService,
    private storeUserDataService: StoreUserDataService
  ) {}

  @Effect()
  loadAutoReportList$ = this.dataPersistence.fetch(
    ReportsActionTypes.LOAD_AUTO_REPORT_LIST,
    {
      run: (action: ReportsActions.LoadAutoReportList) => {
        return this.service
          .getAutoReportList(action.payload)
          .pipe(
            map(
              (data: LoadAutoReportResponse) =>
                new ReportsActions.LoadAutoReportListSuccess(data)
            )
          );
      },
      onError: (
        action: ReportsActions.LoadAutoReportList,
        error: HttpErrorResponse
      ) => {
        return new ReportsActions.LoadAutoReportListFailures(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  saveAutoReportSettings$ = this.dataPersistence.fetch(
    ReportsActionTypes.SAVE_AUTO_REPORT_SETTINGS,
    {
      run: (action: ReportsActions.SaveAutoReportSettings) => {
        return this.service
          .saveAutoReportSettings(action.payload)
          .pipe(
            map(data => new ReportsActions.SaveAutoReportSettingsSuccess(data))
          );
      },
      onError: (
        action: ReportsActions.SaveAutoReportSettings,
        error: HttpErrorResponse
      ) => {
        return new ReportsActions.SaveAutoReportSettingsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadRoles$ = this.dataPersistence.fetch(ReportsActionTypes.LOAD_ROLES, {
    run: (action: ReportsActions.LoadRoles) => {
      return this.service
        .getRoles()
        .pipe(map(data => new ReportsActions.LoadRolesSuccess(data)));
    },
    onError: (action: ReportsActions.LoadRoles, error: HttpErrorResponse) => {
      return new ReportsActions.LoadRolesFailure(this.errorHandler(error));
    }
  });

  @Effect()
  loadTransferTypes$ = this.dataPersistence.fetch(ReportsActionTypes.LOAD_TRANSFER_TYPES, {
    run: (action: ReportsActions.LoadTransferTypes) => {
      return this.lovDataService.getLov(LovMasterEnum.STOCK_ISSUE_REPORT_HEADER)
        .pipe(map(data => new ReportsActions.LoadTransferTypesSuccess(data)));
    },
    onError: (action: ReportsActions.LoadTransferTypes, error: HttpErrorResponse) => {
      return new ReportsActions.LoadTransferTypesFailure(this.errorHandler(error));
    }
  });

  @Effect()
  loadPaymentTypes$ = this.dataPersistence.fetch(
    ReportsActionTypes.LOAD_PAYMENT_TYPES,
    {
      run: (action: ReportsActions.LoadPaymentType) => {
        return this.paymentDataService
          .getPaymentModes(null, false)
          .pipe(map(data => new ReportsActions.LoadPaymentTypeSuccess(data)));
      },
      onError: (
        action: ReportsActions.LoadPaymentType,
        error: HttpErrorResponse
      ) => {
        return new ReportsActions.LoadPaymentTypeFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadReportGroups$ = this.dataPersistence.fetch(
    ReportsActionTypes.LOAD_REPORT_GROUPS,
    {
      run: (action: ReportsActions.LoadReportGroups) => {
        return this.service
          .loadReportGroups()
          .pipe(
            map(
              (data: ReportGroupLov[]) =>
                new ReportsActions.LoadReportGroupsSuccess(data)
            )
          );
      },

      onError: (
        action: ReportsActions.LoadReportGroups,
        error: HttpErrorResponse
      ) => {
        return new ReportsActions.LoadReportGroupsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadReportNames = this.dataPersistence.fetch(
    ReportsActionTypes.LOAD_REPORT_NAMES,
    {
      run: (action: ReportsActions.LoadReportNames) => {
        return this.service
          .loadReportNames(action.payload)
          .pipe(
            map(
              (data: ReportName[]) =>
                new ReportsActions.LoadReportNamesSuccess(data)
            )
          );
      },

      onError: (
        action: ReportsActions.LoadReportNames,
        error: HttpErrorResponse
      ) => {
        return new ReportsActions.LoadReportNamesFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadReportRoles = this.dataPersistence.fetch(
    ReportsActionTypes.LOAD_REPORT_ROLES,
    {
      run: (action: ReportsActions.LoadReportRoles) => {
        return this.service
          .loadReportRoles(action.payload.reportDes, action.payload.roleCode)
          .pipe(
            map(
              (data: ReportRoleSetting[]) =>
                new ReportsActions.LoadReportRolesSuccess(data)
            )
          );
      },

      onError: (
        action: ReportsActions.LoadReportRoles,
        error: HttpErrorResponse
      ) => {
        return new ReportsActions.LoadReportRolesFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() saveReportRoleSettings = this.dataPersistence.fetch(
    ReportsActionTypes.SAVE_REPORT_ROLE_SETTINGS,
    {
      run: (action: ReportsActions.SaveReportRoleSettings) => {
        return this.service
          .saveReportRoleSetting(
            action.payload.roleCode,
            action.payload.request
          )
          .pipe(map(() => new ReportsActions.SaveReportRoleSettingsSuccess()));
      },

      onError: (
        action: ReportsActions.SaveReportRoleSettings,
        error: HttpErrorResponse
      ) => {
        return new ReportsActions.SaveReportRoleSettingsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadReportFields = this.dataPersistence.fetch(
    ReportsActionTypes.LOAD_REPORT_FIELDS,
    {
      run: (action: ReportsActions.LoadReportFields) => {
        return this.service
          .loadReportFields(action.payload)
          .pipe(
            map(
              (data: ReportField[]) =>
                new ReportsActions.LoadReportFieldsSuccess(data)
            )
          );
      },

      onError: (
        action: ReportsActions.LoadReportFields,
        error: HttpErrorResponse
      ) => {
        return new ReportsActions.LoadReportFieldsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadReportSettings = this.dataPersistence.fetch(
    ReportsActionTypes.LOAD_REPORT_SETTINGS,
    {
      run: (action: ReportsActions.LoadReportSettings) => {
        return this.service
          .loadReportSettings(action.payload.reportId, action.payload.roleCode)
          .pipe(
            map(
              (data: CheckBoxSelectedOption[]) =>
                new ReportsActions.LoadReportSettingsSuccess(data)
            )
          );
      },

      onError: (
        action: ReportsActions.LoadReportSettings,
        error: HttpErrorResponse
      ) => {
        return new ReportsActions.LoadReportSettingsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() saveReportSettings = this.dataPersistence.fetch(
    ReportsActionTypes.SAVE_REPORT_SETTINGS,
    {
      run: (action: ReportsActions.SaveReportSettings) => {
        return this.service
          .saveReportSettings(action.payload.reportId, action.payload.request)
          .pipe(
            mergeMap(() => [new ReportsActions.SaveReportSettingsSuccess()])
          );
      },

      onError: (
        action: ReportsActions.SaveReportSettings,
        error: HttpErrorResponse
      ) => {
        return new ReportsActions.SaveReportSettingsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() generateReport = this.dataPersistence.fetch(
    ReportsActionTypes.GENERATE_REPORT,
    {
      run: (action: ReportsActions.GenerateReport) => {
        return this.service
          .generateReport(action.payload.reportId, action.payload.request)
          .pipe(
            map(
              (data: string) => new ReportsActions.GenerateReportSuccess(data)
            )
          );
      },

      onError: (
        action: ReportsActions.GenerateReport,
        error: HttpErrorResponse
      ) => {
        return new ReportsActions.GenerateReportFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadReports = this.dataPersistence.fetch(
    ReportsActionTypes.LOAD_REPORTS,
    {
      run: (action: ReportsActions.LoadReports) => {
        return this.service
          .loadReports(action.payload)
          .pipe(
            map(
              (data: ReportReponse) =>
                new ReportsActions.LoadReportsSuccess(data)
            )
          );
      },

      onError: (
        action: ReportsActions.LoadReports,
        error: HttpErrorResponse
      ) => {
        return new ReportsActions.LoadReportsFailure(this.errorHandler(error));
      }
    }
  );

  @Effect() downloadReport = this.dataPersistence.fetch(
    ReportsActionTypes.DOWNLOAD_REPORT,
    {
      run: (action: ReportsActions.DownloadReport) => {
        return this.service
          .downloadReport(action.payload.reportId, action.payload.selectedTab)
          .pipe(map(() => new ReportsActions.DownloadReportSuccess()));
      },

      onError: (
        action: ReportsActions.DownloadReport,
        error: HttpErrorResponse
      ) => {
        return new ReportsActions.DownloadReportFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadBrands$ = this.dataPersistence.fetch(ReportsActionTypes.LOAD_BRANDS, {
    run: (action: ReportsActions.LoadBrands) => {
      return this.brandDataService
        .getBrandSummary(false, null, null, null, ['brandCode,ASC'])
        .pipe(
          map(
            (data: BrandSummary[]) => new ReportsActions.LoadBrandsSuccess(data)
          )
        );
    },
    onError: (action: ReportsActions.LoadBrands, error: HttpErrorResponse) => {
      return new ReportsActions.LoadBrandsFailure(this.errorHandler(error));
    }
  });

  @Effect()
  loadSubBrands$ = this.dataPersistence.fetch(
    ReportsActionTypes.LOAD_SUB_BRANDS,
    {
      run: (action: ReportsActions.LoadSubBrands) => {
        return this.brandDataService
          .getBrandSummary(false, undefined, null, null, null, action.payload as string[])
          .pipe(
            map(
              (parentBrands: BrandSummary[]) =>
                new ReportsActions.LoadSubBrandsSuccess(parentBrands)
            )
          );
      },
      onError: (
        action: ReportsActions.LoadSubBrands,
        error: HttpErrorResponse
      ) => {
        return new ReportsActions.LoadSubBrandsFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadRegions$ = this.dataPersistence.fetch(ReportsActionTypes.LOAD_REGIONS, {
    run: (action: ReportsActions.LoadRegions) => {
      return this.regionDataService
        .getRegionSummary(false, null, null, null, ['regionCode,ASC'])
        .pipe(
          map(
            (data: RegionSummary[]) =>
              new ReportsActions.LoadRegionsSuccess(data)
          )
        );
    },
    onError: (action: ReportsActions.LoadRegions, error: HttpErrorResponse) => {
      return new ReportsActions.LoadRegionsFailure(this.errorHandler(error));
    }
  });

  @Effect()
  loadLevels$ = this.dataPersistence.fetch(ReportsActionTypes.LOAD_LEVELS, {
    run: (action: ReportsActions.LoadLevels) => {
      return this.lovDataService
        .getLocationLovs('OWNERTYPE')
        .pipe(map((data: Lov[]) => new ReportsActions.LoadLevelsSuccess(data)));
    },
    onError: (action: ReportsActions.LoadLevels, error: HttpErrorResponse) => {
      return new ReportsActions.LoadLevelsFailure(this.errorHandler(error));
    }
  });

  @Effect()
  loadCountries$ = this.dataPersistence.fetch(
    ReportsActionTypes.LOAD_COUNTRIES,
    {
      run: (action: ReportsActions.LoadCountries) => {
        return this.countryDataService
          .getCountrySummary(null, null, false, ['description,ASC'])
          .pipe(
            map(
              (data: CountrySummary[]) =>
                new ReportsActions.LoadCountriesSuccess(data)
            )
          );
      },
      onError: (
        action: ReportsActions.LoadCountries,
        error: HttpErrorResponse
      ) => {
        return new ReportsActions.LoadCountriesFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadStates$ = this.dataPersistence.fetch(ReportsActionTypes.LOAD_STATES, {
    run: (action: ReportsActions.LoadStates) => {
      return this.stateDataService
        .getStatesSummary(action.payload, null, null, false, [
          'description,ASC'
        ])
        .pipe(
          map(
            (data: StateSummary[]) => new ReportsActions.LoadStatesSuccess(data)
          )
        );
    },
    onError: (action: ReportsActions.LoadStates, error: HttpErrorResponse) => {
      return new ReportsActions.LoadStatesFailure(this.errorHandler(error));
    }
  });

  @Effect()
  loadTowns$ = this.dataPersistence.fetch(ReportsActionTypes.LOAD_TOWNS, {
    run: (action: ReportsActions.LoadTowns) => {
      return this.townDataService
        .getTownsSummary(action.payload, null, null, false, ['description,ASC'])
        .pipe(
          map(
            (data: TownSummary[]) => new ReportsActions.LoadTownsSuccess(data)
          )
        );
    },
    onError: (action: ReportsActions.LoadTowns, error: HttpErrorResponse) => {
      return new ReportsActions.LoadTownsFailure(this.errorHandler(error));
    }
  });
  @Effect()
  loadLocations$ = this.dataPersistence.fetch(
    ReportsActionTypes.LOAD_LOCAITONS,
    {
      run: (action: ReportsActions.LoadLocations) => {
        return this.locationDataService
          .getLocationSummaryList(
            {
              brands: action.payload.brands,
              regions: action.payload.regions,
              levels: action.payload.levels,
              countries: action.payload.countries,
              states: action.payload.states,
              towns: action.payload.towns
            },
            false,
            null,
            null,
            ['locationCode,ASC']
          )
          .pipe(
            map(
              (data: LocationSummaryList[]) =>
                new ReportsActions.LoadLocationsSuccess(data)
            )
          );
      },
      onError: (
        action: ReportsActions.LoadLocations,
        error: HttpErrorResponse
      ) => {
        return new ReportsActions.LoadLocationsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadProductGroups$ = this.dataPersistence.fetch(
    ReportsActionTypes.LOAD_PRODUCT_GROUPS,
    {
      run: () => {
        return this.productGroupDataService
          .getProductGroups(false, null, null, ['description,asc'])
          .pipe(
            map(
              (data: ProductGroup[]) =>
                new ReportsActions.LoadProductGroupsSuccess(data)
            )
          );
      },

      onError: (
        action: ReportsActions.LoadProductGroups,
        error: HttpErrorResponse
      ) => {
        return new ReportsActions.LoadProductGroupsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadProductCategories$ = this.dataPersistence.fetch(
    ReportsActionTypes.LOAD_PRODUCT_CATEGORIES,
    {
      run: () => {
        return this.productCategoryDataService
          .getProductCategories(false, null, null, ['description,asc'])
          .pipe(
            map(
              (data: ProductCategory[]) =>
                new ReportsActions.LoadProductCategoriesSuccess(data)
            )
          );
      },

      onError: (
        action: ReportsActions.LoadProductCategories,
        error: HttpErrorResponse
      ) => {
        return new ReportsActions.LoadProductCategoriesFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadBinGroups$ = this.dataPersistence.fetch(
    ReportsActionTypes.LOAD_BIN_GROUPS,
    {
      run: (action: ReportsActions.LoadBinGroups) => {
        return this.service
          .getBinGroups()
          .pipe(
            map(
              (data: BinGroup[]) =>
                new ReportsActions.LoadBinGroupsSuccess(data)
            )
          );
      },
      onError: (
        action: ReportsActions.LoadBinGroups,
        error: HttpErrorResponse
      ) => {
        return new ReportsActions.LoadBinGroupsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadBinCodes$ = this.dataPersistence.fetch(
    ReportsActionTypes.LOAD_BIN_CODES,
    {
      run: (action: ReportsActions.LoadBinCodes) => {
        return this.binDataService
          .getBinDetails(action.payload, false)
          .pipe(
            map(
              (data: BinCode[]) => new ReportsActions.LoadBinCodesSuccess(data)
            )
          );
      },
      onError: (
        action: ReportsActions.LoadBinCodes,
        error: HttpErrorResponse
      ) => {
        return new ReportsActions.LoadBinCodesFailure(this.errorHandler(error));
      }
    }
  );

  @Effect()
  loadSearchParameters$ = this.dataPersistence.fetch(
    ReportsActionTypes.LOAD_SEARCH_PARAMETERS,
    {
      run: (action: ReportsActions.LoadSearchParameter) => {
        return this.service
          .getSearchParameter(action.payload)
          .pipe(
            map(
              (data: SearchParameter) =>
                new ReportsActions.LoadSearchParameterSuccess(data)
            )
          );
      },
      onError: (
        action: ReportsActions.LoadSearchParameter,
        error: HttpErrorResponse
      ) => {
        return new ReportsActions.LoadSearchParameterFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  saveSearchParameter$ = this.dataPersistence.fetch(
    ReportsActionTypes.SAVE_SEARCH_PARAMETERS,
    {
      run: (action: ReportsActions.SaveSearchParameter) => {
        return this.service
          .saveSearchParameter(action.payload)
          .pipe(
            map(
              (data: SearchParameter) =>
                new ReportsActions.SaveSearchParameterSuccess(data)
            )
          );
      },
      onError: (
        action: ReportsActions.SaveSearchParameter,
        error: HttpErrorResponse
      ) => {
        return new ReportsActions.SaveSearchParameterFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  updateSearchParameter$ = this.dataPersistence.fetch(
    ReportsActionTypes.UPDATE_SEARCH_PARAMETERS,
    {
      run: (action: ReportsActions.UpdateSearchParameter) => {
        return this.service
          .updateSearchParameter(action.payload)
          .pipe(
            map(
              (data: SearchParameter) =>
                new ReportsActions.UpdateSearchParameterSuccess(data)
            )
          );
      },
      onError: (
        action: ReportsActions.UpdateSearchParameter,
        error: HttpErrorResponse
      ) => {
        return new ReportsActions.UpdateSearchParameterFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadIndividualSettings$ = this.dataPersistence.fetch(
    ReportsActionTypes.LOAD_INDIVIDUAL_SETTINGS,
    {
      run: (action: ReportsActions.LoadIndividualSetting) => {
        return this.service
          .loadIndividualSetting(action.payload)
          .pipe(
            map(
              (data: ReportField[]) =>
                new ReportsActions.LoadIndividualSettingSuccess(data)
            )
          );
      },
      onError: (
        action: ReportsActions.LoadIndividualSetting,
        error: HttpErrorResponse
      ) => {
        return new ReportsActions.LoadIndividualSettingFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadExcludedIndividualSettings$ = this.dataPersistence.fetch(
    ReportsActionTypes.LOAD_EXCLUDED_INDIVIDUAL_SETTINGS,
    {
      run: (action: ReportsActions.LoadExcludedIndividualSetting) => {
        return this.service
          .loadExcludedIndividualSetting(
            action.payload.reportMasterId,
            action.payload.employeeCode
          )
          .pipe(
            map(
              (data: LoadExcludedSettingPayload) =>
                new ReportsActions.LoadExcludedIndividualSettingSuccess(data)
            )
          );
      },
      onError: (
        action: ReportsActions.LoadExcludedIndividualSetting,
        error: HttpErrorResponse
      ) => {
        return new ReportsActions.LoadExcludedIndividualSettingFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  updateIndividualSettings$ = this.dataPersistence.fetch(
    ReportsActionTypes.UPDATE_INDIVIDUAL_SETTINGS,
    {
      run: (action: ReportsActions.UpdateIndividualSetting) => {
        return this.service
          .updateIndividualSetting(action.payload)
          .pipe(map(() => new ReportsActions.UpdateIndividualSettingSuccess()));
      },
      onError: (
        action: ReportsActions.UpdateIndividualSetting,
        error: HttpErrorResponse
      ) => {
        return new ReportsActions.UpdateIndividualSettingFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  saveIndividualSettings$ = this.dataPersistence.fetch(
    ReportsActionTypes.SAVE_INDIVIDUAL_SETTINGS,
    {
      run: (action: ReportsActions.SaveIndividualSetting) => {
        return this.service
          .saveIndividualSetting(action.payload)
          .pipe(map(() => new ReportsActions.SaveIndividualSettingSuccess()));
      },
      onError: (
        action: ReportsActions.SaveIndividualSetting,
        error: HttpErrorResponse
      ) => {
        return new ReportsActions.SaveIndividualSettingFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadCnType$ = this.dataPersistence.fetch(ReportsActionTypes.LOAD_CN_TYPES, {
    run: (action: ReportsActions.LoadCnType) => {
      return this.paymentDataService
        .getCreditNoteList()
        .pipe(map(data => new ReportsActions.LoadCnTypeSuccess(data)));
    },
    onError: (action: ReportsActions.LoadCnType, error: HttpErrorResponse) => {
      return new ReportsActions.LoadCnTypeFailure(this.errorHandler(error));
    }
  });

  @Effect()
  loadCnStatus$ = this.dataPersistence.fetch(
    ReportsActionTypes.LOAD_CN_STATUS,
    {
      run: (action: ReportsActions.LoadCnStatus) => {
        return this.lovDataService
          .getEnginePaymentLovs('CN_STATUS')
          .pipe(map(data => new ReportsActions.LoadCnStatusSuccess(data)));
      },
      onError: (
        action: ReportsActions.LoadCnStatus,
        error: HttpErrorResponse
      ) => {
        return new ReportsActions.LoadCnTypeFailure(this.errorHandler(error));
      }
    }
  );

  @Effect()
  loadComplexity$ = this.dataPersistence.fetch(
    ReportsActionTypes.LOAD_COMPLEXITY,
    {
      run: (action: ReportsActions.LoadComplexity) => {
        return this.service
          .getComplexity()
          .pipe(map(data => new ReportsActions.LoadComplexitySuccess(data)));
      },
      onError: (
        action: ReportsActions.LoadComplexity,
        error: HttpErrorResponse
      ) => {
        return new ReportsActions.LoadComplexityFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadKaratage$ = this.dataPersistence.fetch(ReportsActionTypes.LOAD_KARATAGE, {
    run: (action: ReportsActions.LoadKaratage) => {
      return this.service
        .getKaratage()
        .pipe(map(data => new ReportsActions.LoadKaratageSuccess(data)));
    },
    onError: (
      action: ReportsActions.LoadKaratage,
      error: HttpErrorResponse
    ) => {
      return new ReportsActions.LoadKaratageFailure(this.errorHandler(error));
    }
  });

  @Effect()
  loadRso$ = this.dataPersistence.fetch(ReportsActionTypes.LOAD_RSO, {
    run: (action: ReportsActions.LoadRso) => {
      return this.storeUserDataService
        .getStoreUsers(
          null,
          100000,
          null,
          action.payload.locationCodes,
          action.payload.roleCodes
        )
        .pipe(
          map((data: StoreUser[]) => {
            const empNames: string[] = [];
            for (const employee of data) {
              empNames.push(employee.employeeCode);
            }
            return new ReportsActions.LoadRsoSuccess(empNames);
          })
        );
    },
    onError: (action: ReportsActions.LoadRso, error: HttpErrorResponse) => {
      return new ReportsActions.LoadRsoFailure(this.errorHandler(error));
    }
  });

  errorHandler(error: HttpErrorResponse): CustomErrors {
    const customError: CustomErrors = CustomErrorAdaptor.fromJson(error);
    this.loggerService.error(customError);
    return customError;
  }
}
