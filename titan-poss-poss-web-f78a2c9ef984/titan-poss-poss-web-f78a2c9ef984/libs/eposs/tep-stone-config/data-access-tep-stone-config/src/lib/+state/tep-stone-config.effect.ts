import {
  CustomErrors,
  TEPStoneConfig,
  TEPStoneConfigDetailsListing,
  TEPStoneConfigListing,
  TEPStoneConfigQualities,
  TEPStoneConfigRange,
  TEPStoneConfigStoneType
} from '@poss-web/shared/models';
import { LoggerService } from '@poss-web/shared/util-logger';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as TepStoneConfigActions from './tep-stone-config.actons';

import { Effect } from '@ngrx/effects';
import { map } from 'rxjs/operators';
import { DataPersistence } from '@nrwl/angular';
import { TepStoneConfigService } from '../tep-stone-config.service';

@Injectable()
export class TepStoneConfigEffect {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private tepStoneConfigService: TepStoneConfigService
  ) {}

  @Effect()
  loadTepStoneConfigListing$ = this.dataPersistence.fetch(
    TepStoneConfigActions.TepStoneConfigActionTypes
      .LOAD_TEP_STONE_CONFIG_LISTING,
    {
      run: (action: TepStoneConfigActions.LoadTepStoneConfigListing) => {
        return this.tepStoneConfigService
          .getTepStoneConfigList(
            action.payload.pageIndex,
            action.payload.pageSize
          )
          .pipe(
            map(
              (result: TEPStoneConfigListing) =>
                new TepStoneConfigActions.LoadTepStoneConfigListingSuccess(
                  result
                )
            )
          );
      },
      onError: (
        action: TepStoneConfigActions.LoadTepStoneConfigListing,
        error: HttpErrorResponse
      ) => {
        return new TepStoneConfigActions.LoadTepStoneConfigListingFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  searchTepStoneConfigDetails$ = this.dataPersistence.fetch(
    TepStoneConfigActions.TepStoneConfigActionTypes.SEARCH_TEP_STONE_CONFIG,
    {
      run: (action: TepStoneConfigActions.SearchTepStoneConfigDetails) => {
        return this.tepStoneConfigService
          .searchTepStoneConfigList(action.payload)
          .pipe(
            map(
              (details: TEPStoneConfigListing) =>
                new TepStoneConfigActions.SearchTepStoneConfigDetailsSuccess(
                  details
                )
            )
          );
      },
      onError: (
        action: TepStoneConfigActions.SearchTepStoneConfigDetails,
        error: HttpErrorResponse
      ) => {
        return new TepStoneConfigActions.SearchTepStoneConfigDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  saveTepStoneDetails$ = this.dataPersistence.fetch(
    TepStoneConfigActions.TepStoneConfigActionTypes.SAVE_TEP_STONE_CONFIG,
    {
      run: (action: TepStoneConfigActions.SaveTepStoneConfig) => {
        return this.tepStoneConfigService
          .saveTepStoneConfig(action.payload)
          .pipe(
            map((result: TEPStoneConfig) => {
              return new TepStoneConfigActions.SaveTepStoneConfigSuccess(
                result
              );
            })
          );
      },
      onError: (
        action: TepStoneConfigActions.SaveTepStoneConfig,
        error: HttpErrorResponse
      ) => {
        return new TepStoneConfigActions.SaveTepStoneConfigFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  updateTepStoneConfigDetails$ = this.dataPersistence.pessimisticUpdate(
    TepStoneConfigActions.TepStoneConfigActionTypes.UPDATE_TEP_STONE_CONFIG,
    {
      run: (action: TepStoneConfigActions.UpdateTepStoneConfigDetails) => {
        return this.tepStoneConfigService
          .updateTepStoneConfig(action.payload)
          .pipe(
            map((result: TEPStoneConfig) => {
              return new TepStoneConfigActions.UpdateTepStoneConfigDetailsSuccess(
                result
              );
            })
          );
      },
      onError: (
        action: TepStoneConfigActions.UpdateTepStoneConfigDetails,
        error: HttpErrorResponse
      ) => {
        return new TepStoneConfigActions.UpdateTepStoneConfigDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadTepStoneConfigDetails$ = this.dataPersistence.fetch(
    TepStoneConfigActions.TepStoneConfigActionTypes.LOAD_TEP_STONE_CONFIG,
    {
      run: (action: TepStoneConfigActions.LoadTepStoneConfigDetails) => {
        return this.tepStoneConfigService
          .getTepStoneConfig(action.payload)
          .pipe(
            map((details: TEPStoneConfig) => {
              return new TepStoneConfigActions.LoadTepStoneConfigDetailsSuccess(
                details
              );
            })
          );
      },
      onError: (
        action: TepStoneConfigActions.LoadTepStoneConfigDetails,
        error: HttpErrorResponse
      ) => {
        return new TepStoneConfigActions.LoadTepStoneConfigDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  searchTepStoneConfigDatalist$ = this.dataPersistence.fetch(
    TepStoneConfigActions.TepStoneConfigActionTypes
      .SEARCH_TEP_STONE_CONFIG_DATA_LISTING,
    {
      run: (action: TepStoneConfigActions.SearchTepStoneConfigDataListing) => {
        return this.tepStoneConfigService
          .searchTepStoneConfigDetailsList(
            action.payload.configId,
            action.payload.filter
          )
          .pipe(
            map(
              (details: TEPStoneConfigDetailsListing) =>
                new TepStoneConfigActions.SearchTepStoneConfigDataListingSuccess(
                  details
                )
            )
          );
      },
      onError: (
        action: TepStoneConfigActions.SearchTepStoneConfigDataListing,
        error: HttpErrorResponse
      ) => {
        return new TepStoneConfigActions.SearchTepStoneConfigDataListingFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadTepStoneConfigDetailsListing$ = this.dataPersistence.fetch(
    TepStoneConfigActions.TepStoneConfigActionTypes
      .LOAD_TEP_STONE_CONFIG_DATA_LISTING,
    {
      run: (action: TepStoneConfigActions.LoadTepStoneConfigDataListing) => {
        return this.tepStoneConfigService
          .getTepStoneConfigDetailsList(action.payload)
          .pipe(
            map(
              (result: TEPStoneConfigDetailsListing) =>
                new TepStoneConfigActions.LoadTepStoneConfigDataListingSuccess(
                  result
                )
            )
          );
      },
      onError: (
        action: TepStoneConfigActions.LoadTepStoneConfigDataListing,
        error: HttpErrorResponse
      ) => {
        return new TepStoneConfigActions.LoadTepStoneConfigDataListingFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadTepStoneConfigStoneType$ = this.dataPersistence.fetch(
    TepStoneConfigActions.TepStoneConfigActionTypes.LOAD_TEP_STONE_TYPES_LIST,
    {
      run: (action: TepStoneConfigActions.LoadTepStoneTypesListing) => {
        return this.tepStoneConfigService
          .getStoneTypesList()
          .pipe(
            map(
              (result: TEPStoneConfigStoneType[]) =>
                new TepStoneConfigActions.LoadTepStoneTypesListingSuccess(
                  result
                )
            )
          );
      },
      onError: (
        action: TepStoneConfigActions.LoadTepStoneTypesListing,
        error: HttpErrorResponse
      ) => {
        return new TepStoneConfigActions.LoadTepStoneTypesListingFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadTepStoneQualitiesListing$ = this.dataPersistence.fetch(
    TepStoneConfigActions.TepStoneConfigActionTypes
      .LOAD_TEP_STONE_QUALITIES_LIST,
    {
      run: (action: TepStoneConfigActions.LoadTepStoneQualitiesListing) => {
        return this.tepStoneConfigService
          .getStoneQualitiesList()
          .pipe(
            map(
              (result: TEPStoneConfigQualities[]) =>
                new TepStoneConfigActions.LoadTepStoneQualitiesListingSuccess(
                  result
                )
            )
          );
      },
      onError: (
        action: TepStoneConfigActions.LoadTepStoneQualitiesListing,
        error: HttpErrorResponse
      ) => {
        return new TepStoneConfigActions.LoadTepStoneQualitiesListingFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadTepStoneRangeListing$ = this.dataPersistence.fetch(
    TepStoneConfigActions.TepStoneConfigActionTypes.LOAD_TEP_STONE_RANGE_LIST,
    {
      run: (action: TepStoneConfigActions.LoadTepStoneRangeListing) => {
        return this.tepStoneConfigService
          .getRangesList()
          .pipe(
            map(
              (result: TEPStoneConfigRange[]) =>
                new TepStoneConfigActions.LoadTepStoneRangeListingSuccess(
                  result
                )
            )
          );
      },
      onError: (
        action: TepStoneConfigActions.LoadTepStoneRangeListing,
        error: HttpErrorResponse
      ) => {
        return new TepStoneConfigActions.LoadTepStoneRangeListingFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  saveTepStoneConfigDetails$ = this.dataPersistence.fetch(
    TepStoneConfigActions.TepStoneConfigActionTypes
      .SAVE_TEP_STONE_CONFIG_DATA_DETAILS,
    {
      run: (action: TepStoneConfigActions.SaveTepStoneConfigDataDetails) => {
        return this.tepStoneConfigService
          .addTepStoneConfigDetails(
            action.payload.configId,
            action.payload.tepStoneDetails
          )
          .pipe(
            map(details => {
              return new TepStoneConfigActions.SaveTepStoneConfigDataDetailsSuccess(
                details
              );
            })
          );
      },
      onError: (
        action: TepStoneConfigActions.SaveTepStoneConfigDataDetails,
        error: HttpErrorResponse
      ) => {
        return new TepStoneConfigActions.SaveTepStoneConfigDataDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  editTepStoneConfigDetails$ = this.dataPersistence.fetch(
    TepStoneConfigActions.TepStoneConfigActionTypes
      .EDIT_TEP_STONE_CONFIG_DATA_DETAILS,
    {
      run: (action: TepStoneConfigActions.EditTepStoneConfigDataDetails) => {
        return this.tepStoneConfigService
          .addTepStoneConfigDetails(
            action.payload.configId,
            action.payload.tepStoneDetails
          )
          .pipe(
            map(details => {
              return new TepStoneConfigActions.EditTepStoneConfigDataDetailsSuccess(
                details
              );
            })
          );
      },
      onError: (
        action: TepStoneConfigActions.EditTepStoneConfigDataDetails,
        error: HttpErrorResponse
      ) => {
        return new TepStoneConfigActions.EditTepStoneConfigDataDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  removeTepStoneConfigDetails$ = this.dataPersistence.fetch(
    TepStoneConfigActions.TepStoneConfigActionTypes
      .REMOVE_TEP_STONE_CONFIG_DATA_DETAILS,
    {
      run: (action: TepStoneConfigActions.RemoveTepStoneConfigDataDetails) => {
        return this.tepStoneConfigService
          .removeTepStoneConfigDetails(
            action.payload.configId,
            action.payload.tepStoneDetails
          )
          .pipe(
            map(details => {
              return new TepStoneConfigActions.RemoveTepStoneConfigDataDetailsSuccess(
                details
              );
            })
          );
      },
      onError: (
        action: TepStoneConfigActions.RemoveTepStoneConfigDataDetails,
        error: HttpErrorResponse
      ) => {
        return new TepStoneConfigActions.RemoveTepStoneConfigDataDetailsFailure(
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
