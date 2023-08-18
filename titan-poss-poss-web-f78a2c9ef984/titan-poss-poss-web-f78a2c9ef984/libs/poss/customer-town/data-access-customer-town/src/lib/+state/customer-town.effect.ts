import { Injectable } from '@angular/core';
import {
  CustomErrors,
  CustomerTown,
  StateSummary,
  LoadCustomerTownListingSuccessPayload
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { LoggerService } from '@poss-web/shared/util-logger';
import { HttpErrorResponse } from '@angular/common/http';

import * as CustomerTownActions from './customer-town.actions';
import { CustomerTownActionTypes } from './customer-town.actions';
import { CustomerTownService } from '../customer-town.service';
import { StateDataService } from '@poss-web/shared/masters/data-access-masters';
import { Effect } from '@ngrx/effects';
import { map } from 'rxjs/operators';
import { DataPersistence } from '@nrwl/angular';
@Injectable()
export class CustomerTownEffect {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private customerTownService: CustomerTownService,
    private stateDataService: StateDataService
  ) {}

  @Effect()
  loadCustomerTownDetails$ = this.dataPersistence.fetch(
    CustomerTownActionTypes.LOAD_CORPORATE_TOWN,
    {
      run: (action: CustomerTownActions.LoadCustomerTownDetails) => {
        return this.customerTownService
          .getCustomerTownDetails(action.payload, action.townName)
          .pipe(
            map(
              (customerTown: LoadCustomerTownListingSuccessPayload) =>
                new CustomerTownActions.LoadCustomerTownDetailsSuccess(
                  customerTown
                )
            )
          );
      },
      onError: (
        action: CustomerTownActions.LoadCustomerTownDetails,
        error: HttpErrorResponse
      ) => {
        return new CustomerTownActions.LoadCustomerTownDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadStatesDetails$ = this.dataPersistence.fetch(
    CustomerTownActionTypes.LOAD_STATE_DETAILS,
    {
      run: (action: CustomerTownActions.LoadStateDetails) => {
        return this.stateDataService
          .getStatesSummary(action.payload, null, null, false, [
            'description,ASC'
          ])
          .pipe(
            map(
              (statesList: StateSummary[]) =>
                new CustomerTownActions.LoadStateDetailsSuccess(statesList)
            )
          );
      },
      onError: (
        action: CustomerTownActions.LoadStateDetails,
        error: HttpErrorResponse
      ) => {
        return new CustomerTownActions.LoadStateDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadTownDetailsByTownCode$ = this.dataPersistence.fetch(
    CustomerTownActionTypes.LOAD_CORPORATE_TOWN_DETAILS_BY_TOWNCODE,
    {
      run: (action: CustomerTownActions.LoadTownDetailsByTownCode) => {
        return this.customerTownService
          .getTownDetailsByTownCode(action.payload)
          .pipe(
            map(
              (townDetailsByTownCode: CustomerTown) =>
                new CustomerTownActions.LoadTownDetailsByTownCodeSuccess(
                  townDetailsByTownCode
                )
            )
          );
      },
      onError: (
        action: CustomerTownActions.LoadTownDetailsByTownCode,
        error: HttpErrorResponse
      ) => {
        return new CustomerTownActions.LoadTownDetailsByTownCodeFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  saveTownFormDetails$ = this.dataPersistence.pessimisticUpdate(
    CustomerTownActionTypes.SAVE_CORPORATE_TOWN,
    {
      run: (action: CustomerTownActions.SaveTownFormDetails) => {
        return this.customerTownService
          .saveTownFormDetails(action.payload)
          .pipe(
            map((saveData: CustomerTown) => {
              return new CustomerTownActions.SaveTownFormDetailsSuccess(
                saveData
              );
            })
          );
      },
      onError: (
        action: CustomerTownActions.SaveTownFormDetails,
        error: HttpErrorResponse
      ) => {
        return new CustomerTownActions.SaveTownFormDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  editTownFormDetails$ = this.dataPersistence.pessimisticUpdate(
    CustomerTownActionTypes.EDIT_CORPORATE_TOWN,
    {
      run: (action: CustomerTownActions.EditTownFormDetails) => {
        return this.customerTownService
          .editTownFormDetails(action.payload)
          .pipe(
            map((saveData: CustomerTown) => {
              return new CustomerTownActions.EditTownFormDetailsSuccess(
                saveData
              );
            })
          );
      },
      onError: (
        action: CustomerTownActions.EditTownFormDetails,
        error: HttpErrorResponse
      ) => {
        return new CustomerTownActions.EditTownFormDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  // @Effect()
  // loadRegionDetails$ = this.dataPersistence.fetch(
  //   CustomerTownActionTypes.LOAD_REGION_DETAILS,
  //   {
  //     run: (action: CustomerTownActions.LoadRegionDetails) => {
  //       return this.customerTownService
  //         .getRegionDetails(action.payload)
  //         .pipe(
  //           map(
  //             (regionList: LoadRegionDetailsListingSuccessPayload) =>
  //               new CustomerTownActions.LoadRegionDetailsSuccess(regionList)
  //           )
  //         );
  //     },
  //     onError: (
  //       action: CustomerTownActions.LoadRegionDetails,
  //       error: HttpErrorResponse
  //     ) => {
  //       return new CustomerTownActions.LoadRegionDetailsFailure(
  //         this.errorHandler(error)
  //       );
  //     }
  //   }
  // );

  // @Effect()
  // searchCustomerTownByTownCode$ = this.dataPersistence.fetch(
  //   CustomerTownActionTypes.SEARCH_CORPORATETOWN,
  //   {
  //     run: (action: CustomerTownActions.SearchCustomerTownCode) => {
  //       return this.customerTownService
  //         .searchCustomerTown(action.payload)
  //         .pipe(
  //           map(
  //             (corpTown: LoadCustomerTownListingSuccessPayload) =>
  //               new CustomerTownActions.SearchCustomerTownCodeSuccess(corpTown)
  //           )
  //         );
  //     },
  //     onError: (
  //       action: CustomerTownActions.SearchCustomerTownCode,
  //       error: HttpErrorResponse
  //     ) => {
  //       return new CustomerTownActions.SearchCustomerTownCodeFailure(
  //         this.errorHandler(error)
  //       );
  //     }
  //   }
  // );

  errorHandler(error: HttpErrorResponse): CustomErrors {
    const customError: CustomErrors = CustomErrorAdaptor.fromJson(error);
    this.loggerService.error(customError);
    return customError;
  }
}
