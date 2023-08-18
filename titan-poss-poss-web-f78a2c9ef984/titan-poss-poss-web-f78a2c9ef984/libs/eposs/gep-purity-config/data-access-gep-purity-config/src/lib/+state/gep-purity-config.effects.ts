import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { DataPersistence } from '@nrwl/angular';
import {
  LocationDataService, LovDataService, ProductGroupDataService
} from '@poss-web/shared/masters/data-access-masters';
import {
  CustomErrors, ExcludeItemCodes, ExcludeThemeCodes, FileGroupEnum,
  FileResponse, GepDetails, GEPPurityConfig, GEPPurityConfigResponse, Lov, MetalType, ProductGroup, ProductGroupsDeduction, PurityDetailsResponse, Ranges
} from '@poss-web/shared/models';
import {
  CustomErrorAdaptor
} from '@poss-web/shared/util-adaptors';
import { FileDownloadService } from '@poss-web/shared/util-common';
import { LoggerService } from '@poss-web/shared/util-logger';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GEPPurityConfigService } from '../gep-purity-config.service';
import * as GEPPurityConfigActions from './gep-purity-config.actions';
import { GEPPurityConfigActionTypes } from './gep-purity-config.actions';

@Injectable()
export class GEPPurityConfigEffects {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private gepPurityConfigService: GEPPurityConfigService,
    private productGroupDataService: ProductGroupDataService,
    private lovDataService: LovDataService,
    private fileDownloadService: FileDownloadService,
    private locationService: LocationDataService
  ) {}
  @Effect()
  gepPurityConfigList$: Observable<Action> = this.dataPersistence.fetch(
    GEPPurityConfigActionTypes.LOAD_GEP_PURITY_CONFIG_LIST,
    {
      run: (action: GEPPurityConfigActions.LoadGEPPurityConfig) => {
        return this.gepPurityConfigService
          .getGEPPurityConfigList(action.payload)
          .pipe(
            map(
              (gepPurityConfigList: GEPPurityConfigResponse) =>
                new GEPPurityConfigActions.LoadGEPPurityConfigSuccess(
                  gepPurityConfigList
                )
            )
          );
      },
      onError: (
        action: GEPPurityConfigActions.LoadGEPPurityConfig,
        error: HttpErrorResponse
      ) => {
        return new GEPPurityConfigActions.LoadGEPPurityConfigFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect() loadProductGroups$ = this.dataPersistence.fetch(
    GEPPurityConfigActionTypes.LOAD_PRODUCT_GROUPS,
    {
      run: (action: GEPPurityConfigActions.LoadProductGroups) => {
        return this.productGroupDataService
          .getProductGroups(false, null, null, ['description,asc'])
          .pipe(
            map(
              (data: ProductGroup[]) =>
                new GEPPurityConfigActions.LoadProductGroupsSuccess(data)
            )
          );
      },

      onError: (
        action: GEPPurityConfigActions.LoadProductGroups,
        error: HttpErrorResponse
      ) => {
        return new GEPPurityConfigActions.LoadProductGroupsFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect() searchProductGroups$ = this.dataPersistence.fetch(
    GEPPurityConfigActionTypes.SEARCH_PRODUCT_GROUP,
    {
      run: (action: GEPPurityConfigActions.SearchProductGroup) => {
        return this.gepPurityConfigService
          .searchProductGroup(action.payload)
          .pipe(
            map(
              (productGroupsDeduction: ProductGroupsDeduction[]) =>
                new GEPPurityConfigActions.SearchProductGroupSuccess(
                  productGroupsDeduction
                )
            )
          );
      },

      onError: (
        action: GEPPurityConfigActions.SearchProductGroup,
        error: HttpErrorResponse
      ) => {
        return new GEPPurityConfigActions.SearchProductGroupFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  gepPurityConfigSearch$: Observable<Action> = this.dataPersistence.fetch(
    GEPPurityConfigActionTypes.SEARCH_CONFIG_NAME,
    {
      run: (action: GEPPurityConfigActions.SearchConfigName) => {
        return this.gepPurityConfigService
          .searchConfigName(action.payload)
          .pipe(
            map(
              (gepPurityConfigSearch: GEPPurityConfig[]) =>
                new GEPPurityConfigActions.SearchConfigNameSuccess(
                  gepPurityConfigSearch
                )
            )
          );
      },
      onError: (
        action: GEPPurityConfigActions.SearchConfigName,
        error: HttpErrorResponse
      ) => {
        return new GEPPurityConfigActions.SearchConfigNameFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  saveGEPDetails$: Observable<Action> = this.dataPersistence.fetch(
    GEPPurityConfigActionTypes.SAVE_GEP_DETAILS,
    {
      run: (action: GEPPurityConfigActions.SaveGEPDetails) => {
        return this.gepPurityConfigService
          .saveGEPDetails(action.payload)
          .pipe(
            map(
              (gepDetails: GepDetails) =>
                new GEPPurityConfigActions.SaveGEPDetailsSuccess(gepDetails)
            )
          );
      },
      onError: (
        action: GEPPurityConfigActions.SaveGEPDetails,
        error: HttpErrorResponse
      ) => {
        return new GEPPurityConfigActions.SaveGEPDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadMetalTypes$: Observable<Action> = this.dataPersistence.fetch(
    GEPPurityConfigActionTypes.LOAD_METAL_TYPES,
    {
      run: (action: GEPPurityConfigActions.LoadMetalTypes) => {
        return this.gepPurityConfigService
          .loadMetalTypes()
          .pipe(
            map(
              (metalTypes: MetalType[]) =>
                new GEPPurityConfigActions.LoadMetalTypesSuccess(metalTypes)
            )
          );
      },
      onError: (
        action: GEPPurityConfigActions.LoadMetalTypes,
        error: HttpErrorResponse
      ) => {
        return new GEPPurityConfigActions.LoadMetalTypesFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadItemTypes$: Observable<Action> = this.dataPersistence.fetch(
    GEPPurityConfigActionTypes.LOAD_ITEM_TYPES,
    {
      run: (action: GEPPurityConfigActions.LoadItemTypes) => {
        return this.lovDataService
          .getLov('GEPITEMTYPE')
          .pipe(
            map(
              (itemTypes: Lov[]) =>
                new GEPPurityConfigActions.LoadItemTypesSuccess(itemTypes)
            )
          );
      },
      onError: (
        action: GEPPurityConfigActions.LoadItemTypes,
        error: HttpErrorResponse
      ) => {
        return new GEPPurityConfigActions.LoadItemTypesFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  savePurityDetails$: Observable<Action> = this.dataPersistence.fetch(
    GEPPurityConfigActionTypes.SAVE_PURITY_DETAILS,
    {
      run: (action: GEPPurityConfigActions.SavePurityDetails) => {
        return this.gepPurityConfigService
          .savePurityDetails(action.payload)
          .pipe(
            map(
              (purityDetails: PurityDetailsResponse[]) =>
                new GEPPurityConfigActions.SavePurityDetailsSuccess(
                  purityDetails
                )
            )
          );
      },
      onError: (
        action: GEPPurityConfigActions.SavePurityDetails,
        error: HttpErrorResponse
      ) => {
        return new GEPPurityConfigActions.SavePurityDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  uploadFile$: Observable<Action> = this.dataPersistence.fetch(
    GEPPurityConfigActionTypes.UPLOAD_FILE,
    {
      run: (action: GEPPurityConfigActions.UploadFile) => {
        return this.gepPurityConfigService
          .uploadFile(action.payload)
          .pipe(
            map(
              (response: { fileResponse: FileResponse; configId: string }) =>
                new GEPPurityConfigActions.UploadFileSuccess(response)
            )
          );
      },
      onError: (
        action: GEPPurityConfigActions.UploadFile,
        error: HttpErrorResponse
      ) => {
        return new GEPPurityConfigActions.UploadFileFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  getExcludeThemeCodes$: Observable<Action> = this.dataPersistence.fetch(
    GEPPurityConfigActionTypes.GET_EXCLUDE_THEME_CODES,
    {
      run: (action: GEPPurityConfigActions.GetExcludeThemeCodes) => {
        return this.gepPurityConfigService
          .getExcludeThemeCodes(action.payload)
          .pipe(
            map(
              (excludeThemeCodes: ExcludeThemeCodes[]) =>
                new GEPPurityConfigActions.GetExcludeThemeCodesSuccess(
                  excludeThemeCodes
                )
            )
          );
      },
      onError: (
        action: GEPPurityConfigActions.GetExcludeThemeCodes,
        error: HttpErrorResponse
      ) => {
        return new GEPPurityConfigActions.GetExcludeThemeCodesFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  getExcludeItemCodes$: Observable<Action> = this.dataPersistence.fetch(
    GEPPurityConfigActionTypes.GET_EXCLUDE_ITEM_CODES,
    {
      run: (action: GEPPurityConfigActions.GetExcludeItemCodes) => {
        return this.gepPurityConfigService
          .getExcludeItemCodes(action.payload)
          .pipe(
            map(
              (excludeItemCodes: {
                itemCodes: ExcludeItemCodes[];
                totalElements: number;
              }) =>
                new GEPPurityConfigActions.GetExcludeItemCodesSuccess(
                  excludeItemCodes
                )
            )
          );
      },
      onError: (
        action: GEPPurityConfigActions.GetExcludeItemCodes,
        error: HttpErrorResponse
      ) => {
        return new GEPPurityConfigActions.GetExcludeItemCodesFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  saveProductGroupsDeduction$: Observable<Action> = this.dataPersistence.fetch(
    GEPPurityConfigActionTypes.SAVE_PRODUCT_GROUPS_DEDUCTION,
    {
      run: (action: GEPPurityConfigActions.SaveProductGroupsDeduction) => {
        return this.gepPurityConfigService
          .productsGroupsDeduction(action.payload)
          .pipe(
            map(
              (configId: string) =>
                new GEPPurityConfigActions.SaveProductGroupsDeductionSuccess(
                  configId
                )
            )
          );
      },
      onError: (
        action: GEPPurityConfigActions.SaveProductGroupsDeduction,
        error: HttpErrorResponse
      ) => {
        return new GEPPurityConfigActions.SaveProductGroupsDeductionFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  updateProductGroupsDeduction$: Observable<Action> = this.dataPersistence.fetch(
    GEPPurityConfigActionTypes.UPDATE_PRODUCT_GROUPS_DEDUCTION,
    {
      run: (action: GEPPurityConfigActions.updateProductGroupsDeduction) => {
        return this.gepPurityConfigService
          .productsGroupsDeduction(action.payload)
          .pipe(
            map(
              (configId: string) =>
                new GEPPurityConfigActions.updateProductGroupsDeductionSuccess(
                  configId
                )
            )
          );
      },
      onError: (
        action: GEPPurityConfigActions.updateProductGroupsDeduction,
        error: HttpErrorResponse
      ) => {
        return new GEPPurityConfigActions.updateProductGroupsDeductionFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  getGepPurityDetails$: Observable<Action> = this.dataPersistence.fetch(
    GEPPurityConfigActionTypes.LOAD_GEP_PURITY_DETAILS,
    {
      run: (action: GEPPurityConfigActions.LoadGepPurityDetails) => {
        return this.gepPurityConfigService
          .getGepPurityDetails(action.payload)
          .pipe(
            map(
              (purityDetails: PurityDetailsResponse[]) =>
                new GEPPurityConfigActions.LoadGepPurityDetailsSuccess(
                  purityDetails
                )
            )
          );
      },
      onError: (
        action: GEPPurityConfigActions.LoadGepPurityDetails,
        error: HttpErrorResponse
      ) => {
        return new GEPPurityConfigActions.LoadGepPurityDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  getGepDetails$: Observable<Action> = this.dataPersistence.fetch(
    GEPPurityConfigActionTypes.LOAD_GEP_DETAILS,
    {
      run: (action: GEPPurityConfigActions.LoadGepDetails) => {
        return this.gepPurityConfigService
          .getGepDetails(action.payload)
          .pipe(
            map(
              (gepDetails: GepDetails) =>
                new GEPPurityConfigActions.LoadGepDetailsSuccess(gepDetails)
            )
          );
      },
      onError: (
        action: GEPPurityConfigActions.LoadGepDetails,
        error: HttpErrorResponse
      ) => {
        return new GEPPurityConfigActions.LoadGepDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadProductGroupsDeduction$: Observable<Action> = this.dataPersistence.fetch(
    GEPPurityConfigActionTypes.LOAD_PRODUCT_GROUPS_DEUCTION,
    {
      run: (action: GEPPurityConfigActions.LoadProductGroupsDeduction) => {
        return this.gepPurityConfigService
          .loadProductGroupsDeduction(action.payload)
          .pipe(
            map(
              (deduction: {
                productGroupsDeduction: ProductGroupsDeduction[];
                count: number;
              }) =>
                new GEPPurityConfigActions.LoadProductGroupsDeductionSuccess(
                  deduction
                )
            )
          );
      },
      onError: (
        action: GEPPurityConfigActions.LoadProductGroupsDeduction,
        error: HttpErrorResponse
      ) => {
        return new GEPPurityConfigActions.LoadProductGroupsDeductionFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  saveThemeCodes$: Observable<Action> = this.dataPersistence.fetch(
    GEPPurityConfigActionTypes.SAVE_THEME_CODES,
    {
      run: (action: GEPPurityConfigActions.SaveThemeCodes) => {
        return this.gepPurityConfigService
          .saveThemeCodes(action.payload)
          .pipe(
            map(
              (configId: string) =>
                new GEPPurityConfigActions.SaveThemeCodesSuccess(configId)
            )
          );
      },
      onError: (
        action: GEPPurityConfigActions.SaveThemeCodes,
        error: HttpErrorResponse
      ) => {
        return new GEPPurityConfigActions.SaveThemeCodesFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  deleteThemeCodes$: Observable<Action> = this.dataPersistence.fetch(
    GEPPurityConfigActionTypes.DELETE_THEME_CODES,
    {
      run: (action: GEPPurityConfigActions.DeleteThemeCodes) => {
        return this.gepPurityConfigService
          .deleteThemeCode(action.payload)
          .pipe(
            map(() => new GEPPurityConfigActions.DeleteThemeCodesSuccess())
          );
      },
      onError: (
        action: GEPPurityConfigActions.DeleteThemeCodes,
        error: HttpErrorResponse
      ) => {
        return new GEPPurityConfigActions.DeleteThemeCodesFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  removeProductGroup$: Observable<Action> = this.dataPersistence.fetch(
    GEPPurityConfigActionTypes.REMOVE_PRODUCT_GROUP,
    {
      run: (action: GEPPurityConfigActions.RemoveProductGroups) => {
        return this.gepPurityConfigService
          .removeProductGroup(action.payload)
          .pipe(
            map(() => new GEPPurityConfigActions.RemoveProductGroupsSuccess())
          );
      },
      onError: (
        action: GEPPurityConfigActions.RemoveProductGroups,
        error: HttpErrorResponse
      ) => {
        return new GEPPurityConfigActions.RemoveProductGroupsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  searchItemCode$: Observable<Action> = this.dataPersistence.fetch(
    GEPPurityConfigActionTypes.SEARCH_ITEM_CODE,
    {
      run: (action: GEPPurityConfigActions.SearchItemCode) => {
        return this.gepPurityConfigService
          .searchItemCode(action.payload)
          .pipe(
            map(
              (itemCode: ExcludeItemCodes[]) =>
                new GEPPurityConfigActions.SearchItemCodeSucccess(itemCode)
            )
          );
      },
      onError: (
        action: GEPPurityConfigActions.SearchItemCode,
        error: HttpErrorResponse
      ) => {
        return new GEPPurityConfigActions.SearchItemCodeFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  errorLogDownload$: Observable<Action> = this.dataPersistence.fetch(
    GEPPurityConfigActionTypes.ITEM_CODES_ERROR_LOG_DOWNLOAD,
    {
      run: (action: GEPPurityConfigActions.ItemCodeErrorLogDownload) => {
        return this.fileDownloadService
          .getErrorResponse(
            action.payload,
            FileGroupEnum.GEP_CONFIG_EXCLUDE_MAPPING
          )
          .pipe(
            map(
              data =>
                new GEPPurityConfigActions.ItemCodeErrorLogDownloadSuccess(data)
            )
          );
      },
      onError: (
        action: GEPPurityConfigActions.ItemCodeErrorLogDownload,
        error: HttpErrorResponse
      ) => {
        return new GEPPurityConfigActions.ItemCodeErrorLogDownloadFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  updateToggleButton$: Observable<Action> = this.dataPersistence.fetch(
    GEPPurityConfigActionTypes.UPDATE_TOGGLE_BUTTON,
    {
      run: (action: GEPPurityConfigActions.UpdateToggleButton) => {
        return this.gepPurityConfigService
          .updateToggleButton(action.payload)
          .pipe(
            map(() => new GEPPurityConfigActions.UpdateToggleButtonSuccess())
          );
      },
      onError: (
        action: GEPPurityConfigActions.UpdateToggleButton,
        error: HttpErrorResponse
      ) => {
        return new GEPPurityConfigActions.UpdateToggleButtonFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadRanges$: Observable<Action> = this.dataPersistence.fetch(
    GEPPurityConfigActionTypes.LOAD_GOLD_RANGES,
    {
      run: (action: GEPPurityConfigActions.LoadGoldRanges) => {
        return this.gepPurityConfigService
          .loadRanges(action.payload)
          .pipe(
            map(
              (ranges: Ranges[]) =>
                new GEPPurityConfigActions.LoadGoldRangesSuccess(ranges)
            )
          );
      },
      onError: (
        action: GEPPurityConfigActions.LoadGoldRanges,
        error: HttpErrorResponse
      ) => {
        return new GEPPurityConfigActions.LoadGoldRangesFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadSilverRanges$: Observable<Action> = this.dataPersistence.fetch(
    GEPPurityConfigActionTypes.LOAD_SILVER_RANGES,
    {
      run: (action: GEPPurityConfigActions.LoadSilverRanges) => {
        return this.gepPurityConfigService
          .loadRanges(action.payload)
          .pipe(
            map(
              (ranges: Ranges[]) =>
                new GEPPurityConfigActions.LoadSilverRangesSuccess(ranges)
            )
          );
      },
      onError: (
        action: GEPPurityConfigActions.LoadSilverRanges,
        error: HttpErrorResponse
      ) => {
        return new GEPPurityConfigActions.LoadSilverRangesFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadPlatinumRanges$: Observable<Action> = this.dataPersistence.fetch(
    GEPPurityConfigActionTypes.LOAD_PLATINUM_RANGES,
    {
      run: (action: GEPPurityConfigActions.LoadPlatinumRanges) => {
        return this.gepPurityConfigService
          .loadRanges(action.payload)
          .pipe(
            map(
              (ranges: Ranges[]) =>
                new GEPPurityConfigActions.LoadPlatinumRangesSuccess(ranges)
            )
          );
      },
      onError: (
        action: GEPPurityConfigActions.LoadPlatinumRanges,
        error: HttpErrorResponse
      ) => {
        return new GEPPurityConfigActions.LoadPlatinumRangesFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  selectedProductGroups$ = this.dataPersistence.fetch(
    GEPPurityConfigActionTypes.LOAD_SELETED_PRODUCT_GROUPS,
    {
      run: (action: GEPPurityConfigActions.LoadSelectedPgs) => {
        return this.gepPurityConfigService
          .loadAllSelectedPgs(action.payload)
          .pipe(
            map(
              (pgs: any) =>
                new GEPPurityConfigActions.LoadSelectedPgsSuccess(pgs)
            )
          );
      },
      onError: (
        action: GEPPurityConfigActions.LoadSelectedPgs,
        error: HttpErrorResponse
      ) => {
        return new GEPPurityConfigActions.LoadSelectedPgsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  errorHandler(error: HttpErrorResponse): CustomErrors {
    const customError: CustomErrors = CustomErrorAdaptor.fromJson(error);
    this.loggerService.error(customError);
    return customError;
  }
}
