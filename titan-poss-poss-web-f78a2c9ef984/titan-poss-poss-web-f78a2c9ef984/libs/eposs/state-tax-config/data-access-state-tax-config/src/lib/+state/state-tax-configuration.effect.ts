import { DataPersistence } from '@nrwl/angular';

import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

import * as StateTaxConfigurationActions from './state-tax-configuration.actions';
import {
  CustomErrors,
  StateTaxConfigurationListingResult,
  LoadStatesDetailsListingSuccessPayload,
  StateTaxConfigurationStateDetails,
  TaxDetailsConfig,
  TaxsList,
  TaxDetailsSubmit
} from '@poss-web/shared/models';
import { LoggerService } from '@poss-web/shared/util-logger';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { StateTaxConfigurationService } from '../state-tax-configuration.service';

@Injectable()
export class StateTaxConfigurationEffect {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private stateTaxConfigurationService: StateTaxConfigurationService
  ) { }

  @Effect()
  loadStateTaxConfigurationListing$ = this.dataPersistence.fetch(
    StateTaxConfigurationActions.StateTaxConfigurationActionTypes.LOAD_STATE_TAX_CONFIGURATION_LISTING,
    {
      run: (action: StateTaxConfigurationActions.LoadStateTaxConfigurationListing) => {
        return this.stateTaxConfigurationService
          .getStateTaxConfigurationList(action.payload.pageEvent, action.payload.stateName)
          .pipe(
            map((staeTaxConfigurationListing: StateTaxConfigurationListingResult) =>
              new StateTaxConfigurationActions.LoadStateTaxConfigurationListingSuccess(staeTaxConfigurationListing)
            )
          );
      },
      onError: (
        action: StateTaxConfigurationActions.LoadStateTaxConfigurationListing,
        error: HttpErrorResponse
      ) => {
        return new StateTaxConfigurationActions.LoadStateTaxConfigurationListingFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  searchStateTaxConfigurationDetails$ = this.dataPersistence.fetch(
    StateTaxConfigurationActions.StateTaxConfigurationActionTypes.SEARCH_STATE_TAX_CONFIGURATION_LISTING,
    {
      run: (action: StateTaxConfigurationActions.SearchStateTaxConfigurationListing) => {
        return this.stateTaxConfigurationService
          .getStateTaxConfigurationList({ pageIndex: 0, pageSize: 0 }, action.payload)
          .pipe(
            map((detailsData: StateTaxConfigurationListingResult) =>
              new StateTaxConfigurationActions.SearchStateTaxConfigurationListingSuccess(detailsData)
            )
          );
      },
      onError: (
        action: StateTaxConfigurationActions.SearchStateTaxConfigurationListing,
        error: HttpErrorResponse
      ) => {
        return new StateTaxConfigurationActions.SearchStateTaxConfigurationListingFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadStateTaxConfigurationStateDetails$ = this.dataPersistence.fetch(
    StateTaxConfigurationActions.StateTaxConfigurationActionTypes.LOAD_STATE_TAX_CONFIGURATION_STATE_DETAILS,
    {
      run: (action: StateTaxConfigurationActions.LoadStateTaxConfigurationStateDetails) => {
        return this.stateTaxConfigurationService
          .getStateTaxConfigurationStateDetails(action.payload)
          .pipe(
            map((stateTaxConfigurationStateDetails: StateTaxConfigurationStateDetails) =>
              new StateTaxConfigurationActions.LoadStateTaxConfigurationStateDetailsSuccess(stateTaxConfigurationStateDetails)
            )
          );
      },
      onError: (
        action: StateTaxConfigurationActions.LoadStateTaxConfigurationStateDetails,
        error: HttpErrorResponse
      ) => {
        return new StateTaxConfigurationActions.LoadStateTaxConfigurationListingFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadStateTaxConfigurationTaxDetails$ = this.dataPersistence.fetch(
    StateTaxConfigurationActions.StateTaxConfigurationActionTypes.LOAD_STATE_TAX_CONFIGURATION_TAX_DETAILS,
    {
      run: (action: StateTaxConfigurationActions.LoadStateTaxConfigurationTaxDetails) => {
        return this.stateTaxConfigurationService
          .getStateTaxConfigurationTaxDetails(action.payload)
          .pipe(
            map((response: TaxDetailsConfig[]) =>
              new StateTaxConfigurationActions.LoadStateTaxConfigurationTaxDetailsSuccess(response)
            )
          );
      },
      onError: (
        action: StateTaxConfigurationActions.LoadStateTaxConfigurationTaxDetails,
        error: HttpErrorResponse
      ) => {
        return new StateTaxConfigurationActions.LoadStateTaxConfigurationTaxDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadAllStateList$ = this.dataPersistence.fetch(
    StateTaxConfigurationActions.StateTaxConfigurationActionTypes.LOAD_ALL_STATE_LIST,
    {
      run: (action: StateTaxConfigurationActions.LoadAllStateList) => {
        return this.stateTaxConfigurationService
          .getAllStateList()
          .pipe(
            map((loadStatesDetailsListingSuccessPayload: LoadStatesDetailsListingSuccessPayload) =>
              new StateTaxConfigurationActions.LoadAllStateListSuccess(loadStatesDetailsListingSuccessPayload)
            )
          );
      },
      onError: (
        action: StateTaxConfigurationActions.LoadAllStateList,
        error: HttpErrorResponse
      ) => {
        return new StateTaxConfigurationActions.LoadAllStateListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadAllTaxsystemList$ = this.dataPersistence.fetch(
    StateTaxConfigurationActions.StateTaxConfigurationActionTypes.LOAD_ALL_TAXSYSTEM_LIST,
    {
      run: (action: StateTaxConfigurationActions.LoadAllTaxsystemList) => {
        return this.stateTaxConfigurationService
          .getAllTaxSystemList()
          .pipe(
            map((response: string[]) =>
              new StateTaxConfigurationActions.LoadAllTaxsystemListSuccess(response)
            )
          );
      },
      onError: (
        action: StateTaxConfigurationActions.LoadAllTaxsystemList,
        error: HttpErrorResponse
      ) => {
        return new StateTaxConfigurationActions.LoadAllTaxsystemListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadAllTaxClassList$ = this.dataPersistence.fetch(
    StateTaxConfigurationActions.StateTaxConfigurationActionTypes.LOAD_ALL_TAXCLASS_LIST,
    {
      run: (action: StateTaxConfigurationActions.LoadAllTaxClassList) => {
        return this.stateTaxConfigurationService
          .getAllTaxClassList()
          .pipe(
            map((response: string[]) =>
              new StateTaxConfigurationActions.LoadAllTaxClassListSuccess(response)
            )
          );
      },
      onError: (
        action: StateTaxConfigurationActions.LoadAllTaxClassList,
        error: HttpErrorResponse
      ) => {
        return new StateTaxConfigurationActions.LoadAllTaxClassListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadAllTaxsList$ = this.dataPersistence.fetch(
    StateTaxConfigurationActions.StateTaxConfigurationActionTypes.LOAD_ALL_TAXS_LIST,
    {
      run: (action: StateTaxConfigurationActions.LoadAllTaxsList) => {
        return this.stateTaxConfigurationService
          .getAllTaxList()
          .pipe(
            map((response: TaxsList[]) =>
              new StateTaxConfigurationActions.LoadAllTaxsListSuccess(response)
            )
          );
      },
      onError: (
        action: StateTaxConfigurationActions.LoadAllTaxsList,
        error: HttpErrorResponse
      ) => {
        return new StateTaxConfigurationActions.LoadAllTaxsListFailure(
          this.errorHandler(error)
        );
      }
    }
  );


  @Effect()
  saveStateTaxConfigurationStateDetails$ = this.dataPersistence.pessimisticUpdate(
    StateTaxConfigurationActions.StateTaxConfigurationActionTypes.SAVE_STATE_TAX_CONFIGURATION_STATE_DETAILS,
    {
      run: (action: StateTaxConfigurationActions.SaveStateTaxConfigurationStateDetails) => {
        return this.stateTaxConfigurationService
          .saveStateTaxConfigurationStateDetails(action.payload)
          .pipe(
            map((saveData: StateTaxConfigurationStateDetails) => {
              return new StateTaxConfigurationActions.SaveStateTaxConfigurationStateDetailsSuccess(saveData)
            })
          );
      },
      onError: (
        action: StateTaxConfigurationActions.SaveStateTaxConfigurationStateDetails,
        error: HttpErrorResponse
      ) => {
        return new StateTaxConfigurationActions.SaveStateTaxConfigurationStateDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  editStateTaxConfigurationStateDetails$ = this.dataPersistence.pessimisticUpdate(
    StateTaxConfigurationActions.StateTaxConfigurationActionTypes.EDIT_STATE_TAX_CONFIGURATION_STATE_DETAILS,
    {
      run: (action: StateTaxConfigurationActions.EditStateTaxConfigurationStateDetails) => {
        return this.stateTaxConfigurationService
          .editStateTaxConfigurationStateDetails(action.payload.formData, action.payload.configId)
          .pipe(
            map((saveData: StateTaxConfigurationStateDetails) => {
              return new StateTaxConfigurationActions.EditStateTaxConfigurationStateDetailsSuccess(saveData)
            })
          );
      },
      onError: (
        action: StateTaxConfigurationActions.EditStateTaxConfigurationStateDetails,
        error: HttpErrorResponse
      ) => {
        return new StateTaxConfigurationActions.EditStateTaxConfigurationStateDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  saveStateTaxConfigurationTaxDetails$ = this.dataPersistence.pessimisticUpdate(
    StateTaxConfigurationActions.StateTaxConfigurationActionTypes.SAVE_STATE_TAX_CONFIGURATION_TAX_DETAILS,
    {
      run: (action: StateTaxConfigurationActions.SaveStateTaxConfigurationTaxDetails) => {
        return this.stateTaxConfigurationService
          .saveStateTaxConfigurationTaxDetails(action.payload.formData, action.payload.configId)
          .pipe(
            map((saveData: TaxDetailsSubmit) => {
              return new StateTaxConfigurationActions.SaveStateTaxConfigurationTaxDetailsSuccess(saveData)
            })
          );
      },
      onError: (
        action: StateTaxConfigurationActions.SaveStateTaxConfigurationTaxDetails,
        error: HttpErrorResponse
      ) => {
        return new StateTaxConfigurationActions.SaveStateTaxConfigurationTaxDetailsFailure(
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

