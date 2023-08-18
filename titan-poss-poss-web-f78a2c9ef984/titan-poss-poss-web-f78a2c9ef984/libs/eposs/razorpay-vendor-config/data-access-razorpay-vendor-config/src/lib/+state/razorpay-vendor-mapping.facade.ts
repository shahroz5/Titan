import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as RazorpayVendorConfigurationActions from './razorpay-vendor-mapping.actions';
import { ConfigListingPayload, SortItem } from '@poss-web/shared/models';
import { razorpayVendorConfigurationSelectors } from './razorpay-vendor-mapping.selectors';
import { RazorpayVendorConfigurationState } from './razorpay-vendor-mapping.state';

/**
 * Data upload Facade for accesing Data-upload-State
 * */
@Injectable()
export class RazorpayVendorConfigurationFacade {
  constructor(private store: Store<RazorpayVendorConfigurationState>) {}

  private fileUploadResponse$ = this.store.select(
    razorpayVendorConfigurationSelectors.selectFileUploadResponse
  );
  private vendorList$ = this.store.select(
    razorpayVendorConfigurationSelectors.selectVendorList
  );

  private totalElements$ = this.store.select(
    razorpayVendorConfigurationSelectors.selectTotalElements
  );

  private hasError$ = this.store.select(
    razorpayVendorConfigurationSelectors.selectHasError
  );
  private updateResponse$ = this.store.select(
    razorpayVendorConfigurationSelectors.updateResponse
  );

  private isLoading$ = this.store.select(
    razorpayVendorConfigurationSelectors.selectIsLoading
  );

  private isErrorLog$ = this.store.select(
    razorpayVendorConfigurationSelectors.selectIsErrorLog
  );

  getTotalElements() {
    return this.totalElements$;
  }

  getUpdateResposne() {
    return this.updateResponse$;
  }

  getFileUploadResponse() {
    return this.fileUploadResponse$;
  }

  GetVendorList() {
    return this.vendorList$;
  }

  getError() {
    return this.hasError$;
  }

  getIsLoading() {
    return this.isLoading$;
  }
  GetErrorLog() {
    return this.isErrorLog$;
  }
  clearResponse() {
    this.store.dispatch(new RazorpayVendorConfigurationActions.ResetResponse());
  }
  loadFileUpload(File: FormData) {
    this.store.dispatch(
      new RazorpayVendorConfigurationActions.FileUpload(File)
    );
  }

  loadVendorList(
    payload: ConfigListingPayload,
    sortField?: SortItem,
    locationCode?: string
  ) {
    this.store.dispatch(
      new RazorpayVendorConfigurationActions.GetVendorList(
        payload,
        sortField,
        locationCode
      )
    );
  }

  loadErrorLog(errorId: string) {
    this.store.dispatch(
      new RazorpayVendorConfigurationActions.ErrorLogDownload(errorId)
    );
  }
}
