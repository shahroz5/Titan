import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { LoggerService } from '@poss-web/shared/util-logger';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { VendorMasterActionTypes } from './vendor-master.action';
import * as VendorMasterAction from './vendor-master.action';
import {
  CustomErrors,
  VendorMasterListing,
  VendorMaster
} from '@poss-web/shared/models';

import { map } from 'rxjs/operators';
import { DataPersistence } from '@nrwl/angular';
import { Effect } from '@ngrx/effects';
import { VendorMasterService } from '../vendor-master.service';

@Injectable()
export class VendorMasterEffect {
  constructor(
    public dataPersistence: DataPersistence<any>,
    public vendorMasterService: VendorMasterService,
    private loggerService: LoggerService
  ) {}
  @Effect()
  loadVendorMasterList$ = this.dataPersistence.fetch(
    VendorMasterActionTypes.LOAD_VENDOR_MASTER_LISTING,
    {
      run: (action: VendorMasterAction.LoadVendorMasterList) => {
        return this.vendorMasterService
          .getVendorMasterList(
            action.payload.pageIndex,
            action.payload.pageSize
          )
          .pipe(
            map(
              (vendorMasterListing: VendorMasterListing) =>
                new VendorMasterAction.LoadVendorMasterListSuccess(
                  vendorMasterListing
                )
            )
          );
      },

      onError: (
        action: VendorMasterAction.LoadVendorMasterList,
        error: HttpErrorResponse
      ) => {
        return new VendorMasterAction.LoadVendorMasterListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadVendorMasterByCode$ = this.dataPersistence.fetch(
    VendorMasterActionTypes.LOAD_VENDOR_MASTER_BY_CODE,
    {
      run: (action: VendorMasterAction.LoadVendorMasterByCode) => {
        return this.vendorMasterService
          .getVendorMasterByCode(action.payload)
          .pipe(
            map(
              (vendorMaster: VendorMaster) =>
                new VendorMasterAction.LoadVendorMasterByCodeSuccess(
                  vendorMaster
                )
            )
          );
      },

      onError: (
        action: VendorMasterAction.LoadVendorMasterByCode,
        error: HttpErrorResponse
      ) => {
        return new VendorMasterAction.LoadVendorMasterByCodeFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  searchVendorMasterList$ = this.dataPersistence.fetch(
    VendorMasterActionTypes.SEARCH_VENDOR_MASTER_BY_CODE,
    {
      run: (action: VendorMasterAction.SearchVendorMasterByCode) => {
        return this.vendorMasterService
          .getSearchVendorMasterList(action.payload)
          .pipe(
            map(
              (vendorMasterListing: VendorMasterListing) =>
                new VendorMasterAction.SearchVendorMasterByCodeSuccess(
                  vendorMasterListing
                )
            )
          );
      },

      onError: (
        action: VendorMasterAction.SearchVendorMasterByCode,
        error: HttpErrorResponse
      ) => {
        return new VendorMasterAction.SearchVendorMasterByCodeFailure(
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
