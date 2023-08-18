import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { RazorpayConfigurationState } from './razorpay-access-mapping.state';
import * as RazorpayConfigurationActions from './razorpay-access-mapping.actions';
import { razorpayConfigurationSelectors } from './razorpay-access-mapping.selectors';
import { ConfigListingPayload, SortItem } from '@poss-web/shared/models';

/**
 * Data upload Facade for accesing Data-upload-State
 * */
@Injectable()
export class RazorpayConfigurationFacade {
  constructor(private store: Store<RazorpayConfigurationState>) {}

  private fileUploadResponse$ = this.store.select(
    razorpayConfigurationSelectors.selectFileUploadResponse
  );
  private accessList$ = this.store.select(
    razorpayConfigurationSelectors.selectAccessList
  );

  private totalElements$ = this.store.select(
    razorpayConfigurationSelectors.selectTotalElements
  );

  private hasError$ = this.store.select(
    razorpayConfigurationSelectors.selectHasError
  );
  private updateResponse$ = this.store.select(
    razorpayConfigurationSelectors.updateResponse
  );

  private isLoading$ = this.store.select(
    razorpayConfigurationSelectors.selectIsLoading
  );

  private isErrorLog$ = this.store.select(
    razorpayConfigurationSelectors.selectIsErrorLog
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

  GetAccessList() {
    return this.accessList$;
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
    this.store.dispatch(new RazorpayConfigurationActions.ResetResponse());
  }
  loadFileUpload(File: FormData) {
    this.store.dispatch(new RazorpayConfigurationActions.FileUpload(File));
  }

  loadAccessList(
    payload: ConfigListingPayload,
    sortField?: SortItem,
    locationCode?: string
  ) {
    this.store.dispatch(
      new RazorpayConfigurationActions.GetAccessList(
        payload,
        sortField,
        locationCode
      )
    );
  }

  loadErrorLog(errorId: string) {
    this.store.dispatch(
      new RazorpayConfigurationActions.ErrorLogDownload(errorId)
    );
  }
}
