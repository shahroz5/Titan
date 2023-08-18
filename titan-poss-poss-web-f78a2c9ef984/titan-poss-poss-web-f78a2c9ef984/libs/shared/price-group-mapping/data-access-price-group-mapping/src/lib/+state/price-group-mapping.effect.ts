import {
  CustomErrors,
  LocationPriceGroupMappingList,
  LocationSummaryList,
  Lov,
  PriceGroupListing
} from '@poss-web/shared/models';
import { LoggerService } from '@poss-web/shared/util-logger';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PriceGroupMappingActionTypes } from './price-group-mapping.actons';
import * as PriceGroupMappingActions from './price-group-mapping.actons';

import { Effect } from '@ngrx/effects';
import { map } from 'rxjs/operators';
import { DataPersistence } from '@nrwl/angular';
import {
  LocationDataService,
} from '@poss-web/shared/masters/data-access-masters';

import { PriceGroupMappingService } from '../price-group-mapping.service';

@Injectable()
export class PriceGroupMappingEffect {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private locationService: LocationDataService,
    private priceGroupMappingService: PriceGroupMappingService
  ) {}

  @Effect()
  loadLocationList$ = this.dataPersistence.fetch(
    PriceGroupMappingActionTypes.LOAD_LOCATION_LIST,
    {
      run: (action: PriceGroupMappingActions.LoadLocationList) => {
        return this.locationService
          .getLocationSummaryList(null, false, null, null, null)
          .pipe(
            map(
              (items: LocationSummaryList[]) =>
                new PriceGroupMappingActions.LoadLocationListSuccess(items)
            )
          );
      },
      onError: (
        action: PriceGroupMappingActions.LoadLocationList,
        error: HttpErrorResponse
      ) => {
        return new PriceGroupMappingActions.LoadLocationListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadPriceGroupList$ = this.dataPersistence.fetch(
    PriceGroupMappingActionTypes.LOAD_PRICE_GROUP_LIST,
    {
      run: (action: PriceGroupMappingActions.LoadPriceGroupList) => {
        return this.priceGroupMappingService.getPriceGroupMasterList().pipe(
          map((result: PriceGroupListing) => {
            return new PriceGroupMappingActions.LoadPriceGroupListSuccess(
              result
            );
          })
        );
      },
      onError: (
        action: PriceGroupMappingActions.LoadPriceGroupList,
        error: HttpErrorResponse
      ) => {
        return new PriceGroupMappingActions.LoadPriceGroupListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadPriceGroupTypeList$ = this.dataPersistence.fetch(
    PriceGroupMappingActionTypes.LOAD_PRICE_GROUP_TYPE_LIST,
    {
      run: (action: PriceGroupMappingActions.LoadPriceGroupTypeList) => {
        return this.priceGroupMappingService.getPriceGroupTypeList().pipe(
          map((result: Lov[]) => {
            return new PriceGroupMappingActions.LoadPriceGroupTypeListSuccess(
              result
            );
          })
        );
      },
      onError: (
        action: PriceGroupMappingActions.LoadPriceGroupTypeList,
        error: HttpErrorResponse
      ) => {
        return new PriceGroupMappingActions.LoadPriceGroupTypeListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadlocationPriceGroupMappingList$ = this.dataPersistence.fetch(
    PriceGroupMappingActionTypes.LOAD_LOCATION_PRICE_GROUP_MAPPING_LIST,
    {
      run: (
        action: PriceGroupMappingActions.LoadLocationPriceGroupMappingList
      ) => {
        return this.priceGroupMappingService
          .getLocationPriceGroupMappingDetails(action.payload)
          .pipe(
            map((result: LocationPriceGroupMappingList[]) => {
              return new PriceGroupMappingActions.LoadLocationPriceGroupMappingListSuccess(
                result
              );
            })
          );
      },
      onError: (
        action: PriceGroupMappingActions.LoadLocationPriceGroupMappingList,
        error: HttpErrorResponse
      ) => {
        return new PriceGroupMappingActions.LoadLocationPriceGroupMappingListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  savePriceGroupMapping$ = this.dataPersistence.fetch(
    PriceGroupMappingActionTypes.SAVE_PRICE_GROUP_MAPPING,
    {
      run: (action: PriceGroupMappingActions.SavePriceGroupMapping) => {
        return this.priceGroupMappingService
          .saveLocationPriceGroupMappingDetails(
            action.payload.locationCode,
            action.payload.locationPriceGroupMapping
          )
          .pipe(
            map((result: any) => {
              return new PriceGroupMappingActions.SavePriceGroupMappingSuccess(
                result
              );
            })
          );
      },
      onError: (
        action: PriceGroupMappingActions.SavePriceGroupMapping,
        error: HttpErrorResponse
      ) => {
        return new PriceGroupMappingActions.SavePriceGroupMappingFailure(
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
