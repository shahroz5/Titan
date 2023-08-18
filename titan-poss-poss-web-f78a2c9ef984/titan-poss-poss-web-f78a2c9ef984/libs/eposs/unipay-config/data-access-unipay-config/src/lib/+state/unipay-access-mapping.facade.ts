import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { UnipayConfigurationState } from './unipay-access-mapping.state';
import * as UnipayConfigurationActions from './unipay-access-mapping.actions';
import { unipayConfigurationSelectors } from './unipay-access-mapping.selectors';
import {
  ConfigListingPayload,
  SortItem
} from '@poss-web/shared/models';

/**
 * Data upload Facade for accesing Data-upload-State
 * */
@Injectable()
export class UnipayConfigurationFacade {
  constructor(private store: Store<UnipayConfigurationState>) {}

  private fileUploadResponse$ = this.store.select(
    unipayConfigurationSelectors.selectFileUploadResponse
  );
  private accessList$ = this.store.select(
    unipayConfigurationSelectors.selectAccessList
  );

  private totalElements$ = this.store.select(
    unipayConfigurationSelectors.selectTotalElements
  );

  private hasError$ = this.store.select(
    unipayConfigurationSelectors.selectHasError
  );
  private updateResponse$ = this.store.select(
    unipayConfigurationSelectors.updateResponse
  );

  private isLoading$ = this.store.select(
    unipayConfigurationSelectors.selectIsLoading
  );


  private isErrorLog$ = this.store.select(
    unipayConfigurationSelectors.selectIsErrorLog
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
    this.store.dispatch(new UnipayConfigurationActions.ResetResponse());
  }
  loadFileUpload(File: FormData) {
    this.store.dispatch(new UnipayConfigurationActions.FileUpload(File));
  }

  loadAccessList(payload: ConfigListingPayload, sortField?: SortItem,  locationCode?: string) {
    this.store.dispatch(
      new UnipayConfigurationActions.GetAccessList(payload, sortField,locationCode)
    );
  }


  loadErrorLog(errorId: string) {
    this.store.dispatch(
      new UnipayConfigurationActions.ErrorLogDownload(errorId)
    );
  }
}
