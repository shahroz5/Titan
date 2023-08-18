import { DataPersistence } from '@nrwl/angular';
import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

import {
  Complexity,
  CustomErrors,
  LoadComplexityPriceGroupListingSuccessPayload,
  PriceGroups,
  ComplexityPriceGroupDetails
} from '@poss-web/shared/models';
import * as ComplexityPricegroupActions from './complexity-pricegroup-map.actions';
import { ComplexityPricegroupService } from '../complexity-pricegroup-map.service';
import { ProductGroupDataService } from '@poss-web/shared/masters/data-access-masters';
import { LoggerService } from '@poss-web/shared/util-logger';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { ComplexityPriceGroupActionTypes } from './complexity-pricegroup-map.actions';
@Injectable()
export class ComplexityPricegroupEffect {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private productGroupDataService: ProductGroupDataService,
    private complexityPricegroupService: ComplexityPricegroupService
  ) {}

  @Effect()
  loadComplexityPricegroupDetails$ = this.dataPersistence.fetch(
    ComplexityPricegroupActions.ComplexityPriceGroupActionTypes
      .LOAD_COMPLEXITY_PRICEGROUP_MAPPING_LISTING,
    {
      run: (
        action: ComplexityPricegroupActions.LoadComplexityPricegroupMappingDetails
      ) => {
        return this.complexityPricegroupService
          .getComplexityPricegroupDetails(
            action.payload,
            action.complexityCode,
            action.priceCode
          )
          .pipe(
            map(
              (
                complexityPricegroupDetails: LoadComplexityPriceGroupListingSuccessPayload
              ) =>
                new ComplexityPricegroupActions.LoadComplexityPricegroupMappingDetailsSuccess(
                  complexityPricegroupDetails
                )
            )
          );
      },
      onError: (
        action: ComplexityPricegroupActions.LoadComplexityPricegroupMappingDetails,
        error: HttpErrorResponse
      ) => {
        // return new ComplexityPricegroupActions.LoadComplexityPricegroupMappingDetailsFailure(
        //   this.errorHandler(error)
        // );
        return new ComplexityPricegroupActions.LoadComplexityPricegroupMappingDetailsSuccess(
          {
            complexityPricegroupListing: [],
            totalElements: 0
          }
        );
      }
    }
  );

  @Effect()
  loadComplexityPricegroupDetailsById$ = this.dataPersistence.fetch(
    ComplexityPricegroupActions.ComplexityPriceGroupActionTypes
      .LOAD_COMPLEXITY_PRICEGROUP_MAPPING_DETAILS_BY_ID,
    {
      run: (
        action: ComplexityPricegroupActions.LoadComplexityPricegroupMappingDetailsById
      ) => {
        return this.complexityPricegroupService
          .getComplexityPricegroupDetailsById(action.payload)
          .pipe(
            map(
              (ComplexityPricegroupDetailsById: ComplexityPriceGroupDetails) =>
                new ComplexityPricegroupActions.LoadComplexityPricegroupMappingDetailsByIdSuccess(
                  ComplexityPricegroupDetailsById
                )
            )
          );
      },
      onError: (
        action: ComplexityPricegroupActions.LoadComplexityPricegroupMappingDetailsById,
        error: HttpErrorResponse
      ) => {
        return new ComplexityPricegroupActions.LoadComplexityPricegroupMappingDetailsByIdFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadFileUploadItems$ = this.dataPersistence.fetch(
    ComplexityPriceGroupActionTypes.LOAD_FILE_UPLOAD_ITEMS,
    {
      run: (action: ComplexityPricegroupActions.LoadFileUploadItems, state) => {
        return this.complexityPricegroupService
          .loadFileUploadItems(
            action.payload,
          )
          .pipe(
            map(
              (loadItemsResponse: boolean) =>
                new ComplexityPricegroupActions.LoadFileUploadItemsSuccess(
                  loadItemsResponse
                )
            )
          );
      },

      onError: (
        action: ComplexityPricegroupActions.LoadFileUploadItems,
        error: HttpErrorResponse
      ) => {
        return new ComplexityPricegroupActions.LoadFileUploadItemsFailure(
          this.errorHandler(error)
          );
      }
    }
  );

  @Effect()
  saveComplexityPricegroupFormDetails$ = this.dataPersistence.pessimisticUpdate(
    ComplexityPricegroupActions.ComplexityPriceGroupActionTypes
      .SAVE_COMPLEXITY_PRICEGROUP_FORM_DETAILS,
    {
      run: (
        action: ComplexityPricegroupActions.SaveComplexityPricegroupFormDetails
      ) => {
        return this.complexityPricegroupService
          .saveComplexityPricegroupFormDetails(action.payload)
          .pipe(
            map((saveData: ComplexityPriceGroupDetails) => {
              return new ComplexityPricegroupActions.SaveComplexityPricegroupFormDetailsSuccess(
                saveData
              );
            })
          );
      },
      onError: (
        action: ComplexityPricegroupActions.SaveComplexityPricegroupFormDetails,
        error: HttpErrorResponse
      ) => {
        return new ComplexityPricegroupActions.SaveComplexityPricegroupFormDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  editComplexityPricegroupFormDetails$ = this.dataPersistence.pessimisticUpdate(
    ComplexityPricegroupActions.ComplexityPriceGroupActionTypes
      .EDIT_COMPLEXITY_PRICEGROUP_FORM_DETAILS,
    {
      run: (
        action: ComplexityPricegroupActions.EditComplexityPricegroupFormDetails
      ) => {
        return this.complexityPricegroupService
          .editComplexityPricegroupFormDetails(action.payload)
          .pipe(
            map((saveData: ComplexityPriceGroupDetails) => {
              return new ComplexityPricegroupActions.EditComplexityPricegroupFormDetailsSuccess(
                saveData
              );
            })
          );
      },
      onError: (
        action: ComplexityPricegroupActions.EditComplexityPricegroupFormDetails,
        error: HttpErrorResponse
      ) => {
        return new ComplexityPricegroupActions.EditComplexityPricegroupFormDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  complexityCodeDetails$ = this.dataPersistence.fetch(
    ComplexityPricegroupActions.ComplexityPriceGroupActionTypes
      .LOAD_COMPLEXITY_CODE,
    {
      run: (action: ComplexityPricegroupActions.LoadComplexityCode) => {
        return this.productGroupDataService
          .getcomplexityDeatils(false)
          .pipe(
            map(
              (complexityCodes: Complexity[]) =>
                new ComplexityPricegroupActions.LoadComplexityCodeSuccess(
                  complexityCodes
                )
            )
          );
      },
      onError: (
        action: ComplexityPricegroupActions.LoadComplexityCode,
        error: HttpErrorResponse
      ) => {
        return new ComplexityPricegroupActions.LoadComplexityCodeFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  priceGroupDetails$ = this.dataPersistence.fetch(
    ComplexityPricegroupActions.ComplexityPriceGroupActionTypes.LOAD_PRICEGROUP,
    {
      run: (action: ComplexityPricegroupActions.LoadPricegroup) => {
        return this.productGroupDataService
          .getPriceGroups(false)
          .pipe(
            map(
              (priceGroups: PriceGroups[]) =>
                new ComplexityPricegroupActions.LoadPricegroupSuccess(
                  priceGroups
                )
            )
          );
      },
      onError: (
        action: ComplexityPricegroupActions.LoadPricegroup,
        error: HttpErrorResponse
      ) => {
        return new ComplexityPricegroupActions.LoadPricegroupFailure(
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
