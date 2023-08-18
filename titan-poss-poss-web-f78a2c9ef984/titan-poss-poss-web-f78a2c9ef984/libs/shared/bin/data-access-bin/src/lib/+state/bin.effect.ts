import { DataPersistence } from '@nrwl/angular';
import { Injectable } from '@angular/core';
import * as InventoryConfigurationActions from './bin.actions';
import { HttpErrorResponse } from '@angular/common/http';

import { BinActionTypes } from './bin.actions';
import {
  SaveBinCodeFormPayload,
  BinCodeEditedFormPayload,
  LocationList,
  LocationMappingPost,
  LoadSearchBinCodeDetails,
  CustomErrors
} from '@poss-web/shared/models';
import { BinService } from '../bin.service';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { LoggerService } from '@poss-web/shared/util-logger';

import { Effect } from '@ngrx/effects';
import { map } from 'rxjs/operators';
@Injectable()
export class BinEffect {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private binService: BinService
  ) {}

  @Effect()
  saveBinCodeNewFormDetails$ = this.dataPersistence.pessimisticUpdate(
    BinActionTypes.SAVE_BINCODE_FORM_DETAILS,
    {
      run: (
        action: InventoryConfigurationActions.SaveBinCodeNewFormDetails
      ) => {
        return this.binService.saveBinCodeNewFormDetails(action.payload).pipe(
          map((saveData: SaveBinCodeFormPayload) => {
            return new InventoryConfigurationActions.SaveBinCodeNewFormDetailsSuccess(
              saveData
            );
          })
        );
      },
      onError: (
        action: InventoryConfigurationActions.SaveBinCodeNewFormDetails,
        error: HttpErrorResponse
      ) => {
        return new InventoryConfigurationActions.SaveBinCodeNewFormDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  // @Effect()
  // loadBinCodeDetails$ = this.dataPersistence.fetch(
  //   BinActionTypes.LOAD_BIN_CODE_DETAILS,
  //   {
  //     run: (action: InventoryConfigurationActions.LoadBinCodeDetails) => {
  //       return this.binService
  //         .getbinCodeDetails(action.payload)
  //         .pipe(
  //           map(
  //             (binCodeDetails: LoadBinCodeDetailsListingSuccessPayload) =>
  //               new InventoryConfigurationActions.LoadBinCodeDetailsSuccess(
  //                 binCodeDetails
  //               )
  //           )
  //         );
  //     },
  //     onError: (
  //       action: InventoryConfigurationActions.LoadBinCodeDetails,
  //       error: HttpErrorResponse
  //     ) => {
  //       return new InventoryConfigurationActions.LoadBinCodeDetailsFailure(
  //         this.errorHandler(error)
  //       );
  //     }
  //   }
  // );

  @Effect()
  loadBinCodesByBinGroupCode$ = this.dataPersistence.fetch(
    BinActionTypes.LOAD_BIN_CODES_BY_BIN_GROUPCODE,
    {
      run: (
        action: InventoryConfigurationActions.LoadBinCodesByBinGroupCode
      ) => {
        return this.binService
          .getBinCodesByBinGroupCode(action.payload)
          .pipe(
            map(
              (binCodesByBinGroupCode: LoadSearchBinCodeDetails) =>
                new InventoryConfigurationActions.LoadBinCodesByBinGroupCodeSuccess(
                  binCodesByBinGroupCode
                )
            )
          );
      },
      onError: (
        action: InventoryConfigurationActions.LoadBinCodesByBinGroupCode,
        error: HttpErrorResponse
      ) => {
        return new InventoryConfigurationActions.LoadBinCodesByBinGroupCodeFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  saveBinCodeEditedFormDetails$ = this.dataPersistence.pessimisticUpdate(
    BinActionTypes.EDIT_BINCODE_FORM_DETAILS,
    {
      run: (action: InventoryConfigurationActions.EditBinCodeFormDetails) => {
        return this.binService
          .saveBinCodeEditedFormDetails(action.payload)
          .pipe(
            map((saveData: BinCodeEditedFormPayload) => {
              return new InventoryConfigurationActions.EditBinCodeFormDetailsSuccess(
                saveData
              );
            })
          );
      },
      onError: (
        action: InventoryConfigurationActions.EditBinCodeFormDetails,
        error: HttpErrorResponse
      ) => {
        return new InventoryConfigurationActions.EditBinCodeFormDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  searchBinName$ = this.dataPersistence.fetch(BinActionTypes.SEARCH_BIN_NAME, {
    run: (action: InventoryConfigurationActions.SearchBinName) => {
      return this.binService
        .searchBinName(action.payload.binCode, action.payload.binGroupCode)
        .pipe(
          map(
            binDetails =>
              new InventoryConfigurationActions.SearchBinNameSuccess(binDetails)
          )
        );
    },
    onError: (
      action: InventoryConfigurationActions.SearchBinName,
      error: HttpErrorResponse
    ) => {
      return new InventoryConfigurationActions.SearchBinNameFailure(
        this.errorHandler(error)
      );
    }
  });

  @Effect()
  loadLocationsByBinCodesAndBinGroup$ = this.dataPersistence.fetch(
    BinActionTypes.LOAD_LOCATIONS_BY_BINGROUP_AND_BINCODE,
    {
      run: (
        action: InventoryConfigurationActions.LoadLocationsByBinGroupAndBinCode
      ) => {
        return this.binService
          .getLocationsByBinGroupAndBinCode(action.payload)
          .pipe(
            map(
              (locationsByBinGroupAndBinCode: LocationList[]) =>
                new InventoryConfigurationActions.LoadLocationsByBinGroupAndBinCodeSuccess(
                  locationsByBinGroupAndBinCode
                )
            )
          );
      },
      onError: (
        action: InventoryConfigurationActions.LoadLocationsByBinGroupAndBinCode,
        error: HttpErrorResponse
      ) => {
        return new InventoryConfigurationActions.LoadLocationsByBinGroupAndBinCodeFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  saveLocationMappingDetails$ = this.dataPersistence.pessimisticUpdate(
    BinActionTypes.SAVE_LOCATION_MAPPING_DETAILS,
    {
      run: (
        action: InventoryConfigurationActions.SaveLocationMappingDetails
      ) => {
        return this.binService.saveLocationMapping(action.payload).pipe(
          map((saveData: LocationMappingPost) => {
            return new InventoryConfigurationActions.SaveLocationMappingDetailsSuccess(
              saveData
            );
          })
        );
      },
      onError: (
        action: InventoryConfigurationActions.SaveLocationMappingDetails,
        error: HttpErrorResponse
      ) => {
        return new InventoryConfigurationActions.SaveLocationMappingDetailsFailure(
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
