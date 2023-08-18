import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { DataUploadState } from './data-upload.state';
import * as DataUploadActions from './data-upload.actions';
import { dataUploadSelectors } from './data-upload.selectors';

/**
 * Data upload Facade for accesing Data-upload-State
 * */
@Injectable()
export class DataUploadFacade {
  constructor(private store: Store<DataUploadState>) {}

  private FIRFileUploadResponse$ = this.store.select(
    dataUploadSelectors.selectFIRFileUploadResponse
  );

  private MERFileUploadResponse$ = this.store.select(
    dataUploadSelectors.selectMERFileUploadResponse
  );

  private InvoiceUploadResponse$ = this.store.select(
    dataUploadSelectors.selectInvoiceUploadResponse
  );

  private STNUploadResponse$ = this.store.select(
    dataUploadSelectors.selectSTNUploadResponse
  );

  private hasError$ = this.store.select(dataUploadSelectors.selectHasError);

  private isLoading$ = this.store.select(dataUploadSelectors.selectIsLoading);
  /**
   * Access for state selectors
   */

  loadFIRFileUpload(FIRFile: FormData) {
    this.store.dispatch(new DataUploadActions.FIRFileUpload(FIRFile));
  }

  getFIRFileUploadResponse() {
    return this.FIRFileUploadResponse$;
  }

  loadMERFileUpload(MERFile: FormData) {
    this.store.dispatch(new DataUploadActions.MERFileUpload(MERFile));
  }

  getMERFileUploadResponse() {
    return this.MERFileUploadResponse$;
  }

  loadInvoiceUpload() {
    this.store.dispatch(new DataUploadActions.InvoiceUpload());
  }

  getInvoiceUploadResponse() {
    return this.InvoiceUploadResponse$;
  }

  loadSTNUpload() {
    this.store.dispatch(new DataUploadActions.STNUpload());
  }

  getSTNUploadResponse() {
    return this.STNUploadResponse$;
  }

  clearResponse() {
    this.store.dispatch(new DataUploadActions.ResetResponse());
  }

  getError() {
    return this.hasError$;
  }

  getIsLoading() {
    return this.isLoading$;
  }
}
