import { DataPersistence } from '@nrwl/angular';
import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

import * as PayeeBankActions from './payee-bank.action';
import { PayeeBankService } from '../payee-bank.service';
import {
  LoadPayeeBankListingSuccessPayload,
  PayeeBankDetails,
  CustomErrors,
  PayeeBankGLCodeDetails,
  LocationCodeDetails,
  StateSummary,
  TownSummary
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { LoggerService } from '@poss-web/shared/util-logger';
import {
  LocationDataService,
  StateDataService,
  TownDataService
} from '@poss-web/shared/masters/data-access-masters';
@Injectable()
export class PayeeBankEffect {
  constructor(
    private dataPersistence: DataPersistence<any>,
    public loggerService: LoggerService,
    private locationDataService: LocationDataService,
    private payeeBankService: PayeeBankService,
    private stateDataService: StateDataService,
    private townDataService: TownDataService
  ) {}

  @Effect()
  loadPayeeBankDetails$ = this.dataPersistence.fetch(
    PayeeBankActions.PayeeBankActionTypes.LOAD_PAYEE_BANK_LISTING,
    {
      run: (action: PayeeBankActions.LoadPayeeBankDetails) => {
        return this.payeeBankService
          .getPayeeBankDetails(action.payload)
          .pipe(
            map(
              (loadPayeeBankDetails: LoadPayeeBankListingSuccessPayload) =>
                new PayeeBankActions.LoadPayeeBankDetailsSuccess(
                  loadPayeeBankDetails
                )
            )
          );
      },
      onError: (
        action: PayeeBankActions.LoadPayeeBankDetails,
        error: HttpErrorResponse
      ) => {
        return new PayeeBankActions.LoadPayeeBankDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadPayeeBankByPayeeBankName$ = this.dataPersistence.fetch(
    PayeeBankActions.PayeeBankActionTypes
      .LOAD_PAYEE_BANK_DETAILS_BY_PAYEE_BANKNAME,
    {
      run: (action: PayeeBankActions.LoadPayeeBankByPayeeBankName) => {
        console.log(action.payload, 'hello eff');

        return this.payeeBankService
          .getPayeeBankByBankName(action.payload)
          .pipe(
            map(
              (loadPayeeBankByPayeeBankName: PayeeBankDetails) =>
                new PayeeBankActions.LoadPayeeBankByPayeeBankNameSuccess(
                  loadPayeeBankByPayeeBankName
                )
            )
          );
      },
      onError: (
        action: PayeeBankActions.LoadPayeeBankByPayeeBankName,
        error: HttpErrorResponse
      ) => {
        return new PayeeBankActions.LoadPayeeBankByPayeeBankNameFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadStates$ = this.dataPersistence.fetch(
    PayeeBankActions.PayeeBankActionTypes.LOAD_STATES,
    {
      run: (action: PayeeBankActions.LoadStates) => {
        return this.stateDataService
          .getStatesSummary(action.payload, null, null, false, [
            'description,ASC'
          ])
          .pipe(
            map(
              (statesList: StateSummary[]) =>
                new PayeeBankActions.LoadStatesSuccess(statesList)
            )
          );
      },
      onError: (
        action: PayeeBankActions.LoadStates,
        error: HttpErrorResponse
      ) => {
        return new PayeeBankActions.LoadStatesFailure(this.errorHandler(error));
      }
    }
  );
  @Effect()
  loadTowns$ = this.dataPersistence.fetch(
    PayeeBankActions.PayeeBankActionTypes.LOAD_TOWNS,
    {
      run: (action: PayeeBankActions.LoadTowns) => {
        return this.townDataService
          .getTownsSummary(action.payload, null, null, false, [
            'description,ASC'
          ])
          .pipe(
            map(
              (towns: TownSummary[]) =>
                new PayeeBankActions.LoadTownsSuccess(towns)
            )
          );
      },
      onError: (
        action: PayeeBankActions.LoadTowns,
        error: HttpErrorResponse
      ) => {
        return new PayeeBankActions.LoadTownsFailure(this.errorHandler(error));
      }
    }
  );

  @Effect()
  savePayeeBankFormDetails$ = this.dataPersistence.pessimisticUpdate(
    PayeeBankActions.PayeeBankActionTypes.SAVE_PAYEE_BANK_FORM_DETAILS,
    {
      run: (action: PayeeBankActions.SavePayeeBankFormDetails) => {
        return this.payeeBankService
          .savePayeeBankFormDetails(action.payload)
          .pipe(
            map((saveData: PayeeBankDetails) => {
              return new PayeeBankActions.SavePayeeBankFormDetailsSuccess(
                saveData
              );
            })
          );
      },
      onError: (
        action: PayeeBankActions.SavePayeeBankFormDetails,
        error: HttpErrorResponse
      ) => {
        return new PayeeBankActions.SavePayeeBankFormDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  editPayeeBankFormDetails$ = this.dataPersistence.pessimisticUpdate(
    PayeeBankActions.PayeeBankActionTypes.EDIT_PAYEE_BANK_FORM_DETAILS,
    {
      run: (action: PayeeBankActions.EditPayeeBankFormDetails) => {
        return this.payeeBankService
          .editPayeeBankFormDetails(action.payload)
          .pipe(
            map((saveData: PayeeBankDetails) => {
              return new PayeeBankActions.EditPayeeBankFormDetailsSuccess(
                saveData
              );
            })
          );
      },
      onError: (
        action: PayeeBankActions.EditPayeeBankFormDetails,
        error: HttpErrorResponse
      ) => {
        return new PayeeBankActions.EditPayeeBankFormDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  searchPayeebankName$ = this.dataPersistence.fetch(
    PayeeBankActions.PayeeBankActionTypes.SEARCH_PAYEE_BANK_DETAILS,
    {
      run: (action: PayeeBankActions.SearchPayeebankName) => {
        return this.payeeBankService
          .getPayeeBankSearchResult(action.payload)
          .pipe(
            map(
              (SearchResult: PayeeBankDetails[]) =>
                new PayeeBankActions.SearchPayeebankNameSuccess(SearchResult)
            )
          );
      },
      onError: (
        action: PayeeBankActions.SearchPayeebankName,
        error: HttpErrorResponse
      ) => {
        return new PayeeBankActions.LoadPayeeBankDetailsSuccess({
          payeeBankListing: [],
          totalElements: 0
        });
      }
    }
  );

  @Effect()
  loadGlCodeDetails$ = this.dataPersistence.fetch(
    PayeeBankActions.PayeeBankActionTypes.LOAD_PAYEE_BANK_GL_CODE_DETAILS,
    {
      run: (action: PayeeBankActions.LoadPayeeBankGlCodeDetails) => {
        console.log('eff', action.payload);
        return this.payeeBankService
          .getPayeeBankGlCodeDetails(action.payload)
          .pipe(
            map(
              glCodeDetails =>
                new PayeeBankActions.LoadPayeeBankGlCodeDetailsSuccess(
                  glCodeDetails
                )
            )
          );
      },
      onError: (
        action: PayeeBankActions.LoadPayeeBankGlCodeDetails,
        error: HttpErrorResponse
      ) => {
        return new PayeeBankActions.LoadPayeeBankGlCodeDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  saveGlCodeDetails$ = this.dataPersistence.fetch(
    PayeeBankActions.PayeeBankActionTypes.SAVE_PAYEE_BANK_GL_CODE_DETAILS,
    {
      run: (action: PayeeBankActions.SavePayeeBankGlCodeDetails) => {
        console.log('eff', action.payload);
        return this.payeeBankService
          .savePayeeBankGlCodeDetails(action.payload)
          .pipe(
            map(
              (glCodeDetails: PayeeBankGLCodeDetails) =>
                new PayeeBankActions.SavePayeeBankGlCodeDetailsSuccess(
                  glCodeDetails
                )
            )
          );
      },
      onError: (
        action: PayeeBankActions.SavePayeeBankGlCodeDetails,
        error: HttpErrorResponse
      ) => {
        return new PayeeBankActions.SavePayeeBankGlCodeDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadLocationCodes$ = this.dataPersistence.fetch(
    PayeeBankActions.PayeeBankActionTypes.GET_LOCATIONS,
    {
      run: (action: PayeeBankActions.GetLocationCodes) => {
        return this.locationDataService
          .getLocationSummaryList(null, false, null, null, ['locationCode,ASC'])
          .pipe(
            map(
              (locationCodes: LocationCodeDetails[]) =>
                new PayeeBankActions.GetLocationCodesSuccess(locationCodes)
            )
          );
      },
      onError: (
        action: PayeeBankActions.GetLocationCodes,
        error: HttpErrorResponse
      ) => {
        return new PayeeBankActions.GetLocationCodesFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadGlCodeDefaults$ = this.dataPersistence.fetch(
    PayeeBankActions.PayeeBankActionTypes.CHECK_GL_CODE_DEFAULTS,
    {
      run: (action: PayeeBankActions.GetGlCodeIsDefaults) => {
        console.log('eff', action.payload);
        return this.payeeBankService
          .getGlCodeDefaults(action.payload)
          .pipe(
            map(
              (glCodeDetails: PayeeBankGLCodeDetails[]) =>
                new PayeeBankActions.GetGlCodeIsDefaultsSuccess(glCodeDetails)
            )
          );
      },
      onError: (
        action: PayeeBankActions.GetGlCodeIsDefaults,
        error: HttpErrorResponse
      ) => {
        return new PayeeBankActions.GetGlCodeIsDefaultsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadMappedLocations$ = this.dataPersistence.fetch(
    PayeeBankActions.PayeeBankActionTypes.GET_MAPPED_LOCATIONS,
    {
      run: (action: PayeeBankActions.LoadMappedLocations) => {
        return this.payeeBankService
          .getMappedLocations(action.payload)
          .pipe(
            map(
              glCodeDetails =>
                new PayeeBankActions.LoadMappedLocationsSuccess(glCodeDetails)
            )
          );
      },
      onError: (
        action: PayeeBankActions.LoadMappedLocations,
        error: HttpErrorResponse
      ) => {
        return new PayeeBankActions.LoadMappedLocationsFailure(
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
