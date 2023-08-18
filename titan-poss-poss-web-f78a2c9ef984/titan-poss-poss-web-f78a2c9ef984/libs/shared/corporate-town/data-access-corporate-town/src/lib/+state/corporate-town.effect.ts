import { Injectable } from '@angular/core';
import {
  CustomErrors,
  CorporateTown,
  StateSummary,
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { LoggerService } from '@poss-web/shared/util-logger';
import { HttpErrorResponse } from '@angular/common/http';
import {
  LoadCorporateTownListingSuccessPayload,
  // LoadRegionDetailsListingSuccessPayload
} from '@poss-web/shared/models';

import * as CorporateTownActions from './corporate-town.actions';
import { CorporateTownActionTypes } from './corporate-town.actions';
import { CorporateTownService } from '../corporate-town.service';

import { Effect } from '@ngrx/effects';
import { map } from 'rxjs/operators';
import { DataPersistence } from '@nrwl/angular';
import {
  StateDataService,
} from '@poss-web/shared/masters/data-access-masters';
@Injectable()
export class CorporateTownEffect {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    // private locationDataService: LocationDataService,
    private corporateTownService: CorporateTownService,
    private stateDataService: StateDataService
  ) {}

  @Effect()
  loadCorporateTownDetails$ = this.dataPersistence.fetch(
    CorporateTownActionTypes.LOAD_CORPORATE_TOWN,
    {
      run: (action: CorporateTownActions.LoadCorporateTownDetails) => {
        return this.corporateTownService
          .getCorporateTownDetails(action.payload)
          .pipe(
            map(
              (corporateTown: LoadCorporateTownListingSuccessPayload) =>
                new CorporateTownActions.LoadCorporateTownDetailsSuccess(
                  corporateTown
                )
            )
          );
      },
      onError: (
        action: CorporateTownActions.LoadCorporateTownDetails,
        error: HttpErrorResponse
      ) => {
        return new CorporateTownActions.LoadCorporateTownDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  // @Effect()
  // loadCountryCodeDetails$ = this.dataPersistence.fetch(
  //   CorporateTownActionTypes.LOAD_COUNTRY_DETAILS_BY_NAME,
  //   {
  //     run: (action: CorporateTownActions.LoadCountryDetails) => {
  //       return this.locationDataService
  //         .getCountryList(false)
  //         .pipe(
  //           map(
  //             (statesList: CountryList[]) =>
  //               new CorporateTownActions.LoadCountryDetailsSuccess(statesList)
  //           )
  //         );
  //     },
  //     onError: (
  //       action: CorporateTownActions.LoadCountryDetails,
  //       error: HttpErrorResponse
  //     ) => {
  //       return new CorporateTownActions.LoadCountryDetailsFailure(
  //         this.errorHandler(error)
  //       );
  //     }
  //   }
  // );
  @Effect()
  loadStatesDetails$ = this.dataPersistence.fetch(
    CorporateTownActionTypes.LOAD_STATE_DETAILS,
    {
      run: (action: CorporateTownActions.LoadStateDetails) => {
        return this.stateDataService
          .getStatesSummary(action.payload, null, null, false, [
            'description,ASC'
          ])
          .pipe(
            map(
              (statesList: StateSummary[]) =>
                new CorporateTownActions.LoadStateDetailsSuccess(statesList)
            )
          );
      },
      onError: (
        action: CorporateTownActions.LoadStateDetails,
        error: HttpErrorResponse
      ) => {
        return new CorporateTownActions.LoadStateDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadTownDetailsByTownCode$ = this.dataPersistence.fetch(
    CorporateTownActionTypes.LOAD_CORPORATE_TOWN_DETAILS_BY_TOWNCODE,
    {
      run: (action: CorporateTownActions.LoadTownDetailsByTownCode) => {
        return this.corporateTownService
          .getTownDetailsByTownCode(action.payload)
          .pipe(
            map(
              (townDetailsByTownCode: CorporateTown) =>
                new CorporateTownActions.LoadTownDetailsByTownCodeSuccess(
                  townDetailsByTownCode
                )
            )
          );
      },
      onError: (
        action: CorporateTownActions.LoadTownDetailsByTownCode,
        error: HttpErrorResponse
      ) => {
        return new CorporateTownActions.LoadTownDetailsByTownCodeFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  saveTownFormDetails$ = this.dataPersistence.pessimisticUpdate(
    CorporateTownActionTypes.SAVE_CORPORATE_TOWN,
    {
      run: (action: CorporateTownActions.SaveTownFormDetails) => {
        return this.corporateTownService
          .saveTownFormDetails(action.payload)
          .pipe(
            map((saveData: CorporateTown) => {
              return new CorporateTownActions.SaveTownFormDetailsSuccess(
                saveData
              );
            })
          );
      },
      onError: (
        action: CorporateTownActions.SaveTownFormDetails,
        error: HttpErrorResponse
      ) => {
        return new CorporateTownActions.SaveTownFormDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  editTownFormDetails$ = this.dataPersistence.pessimisticUpdate(
    CorporateTownActionTypes.EDIT_CORPORATE_TOWN,
    {
      run: (action: CorporateTownActions.EditTownFormDetails) => {
        return this.corporateTownService
          .editTownFormDetails(action.payload)
          .pipe(
            map((saveData: CorporateTown) => {
              return new CorporateTownActions.EditTownFormDetailsSuccess(
                saveData
              );
            })
          );
      },
      onError: (
        action: CorporateTownActions.EditTownFormDetails,
        error: HttpErrorResponse
      ) => {
        return new CorporateTownActions.EditTownFormDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  // @Effect()
  // loadRegionDetails$ = this.dataPersistence.fetch(
  //   CorporateTownActionTypes.LOAD_REGION_DETAILS,
  //   {
  //     run: (action: CorporateTownActions.LoadRegionDetails) => {
  //       return this.corporateTownService
  //         .getRegionDetails(action.payload)
  //         .pipe(
  //           map(
  //             (regionList: LoadRegionDetailsListingSuccessPayload) =>
  //               new CorporateTownActions.LoadRegionDetailsSuccess(regionList)
  //           )
  //         );
  //     },
  //     onError: (
  //       action: CorporateTownActions.LoadRegionDetails,
  //       error: HttpErrorResponse
  //     ) => {
  //       return new CorporateTownActions.LoadRegionDetailsFailure(
  //         this.errorHandler(error)
  //       );
  //     }
  //   }
  // );

  @Effect()
  searchCorporateTownByTownCode$ = this.dataPersistence.fetch(
    CorporateTownActionTypes.SEARCH_CORPORATETOWN,
    {
      run: (action: CorporateTownActions.SearchCorporateTownCode) => {
        return this.corporateTownService
          .searchCorporateTown(action.payload)
          .pipe(
            map(
              (corpTown: LoadCorporateTownListingSuccessPayload) =>
                new CorporateTownActions.SearchCorporateTownCodeSuccess(
                  corpTown
                )
            )
          );
      },
      onError: (
        action: CorporateTownActions.SearchCorporateTownCode,
        error: HttpErrorResponse
      ) => {
        return new CorporateTownActions.SearchCorporateTownCodeFailure(
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
