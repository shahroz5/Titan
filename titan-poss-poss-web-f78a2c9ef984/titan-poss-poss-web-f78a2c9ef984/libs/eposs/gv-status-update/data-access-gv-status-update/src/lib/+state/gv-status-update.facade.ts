import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { GVStatusUpdateState } from './gv-status-update.state';
import * as GVStatusActions from './gv-status-update.actions';
import { gvStatusUpdateSelectors } from './gv-status-update.selectors';
import {
  GVStatusListingPayload,
  SortItem,
  GVExtendValidity,
  GVStatusChange
} from '@poss-web/shared/models';

/**
 * Data upload Facade for accesing Data-upload-State
 * */
@Injectable()
export class GVStatusUpdateFacade {
  constructor(private store: Store<GVStatusUpdateState>) {}

  private fileUploadResponse$ = this.store.select(
    gvStatusUpdateSelectors.selectFileUploadResponse
  );
  private gvStatusList$ = this.store.select(
    gvStatusUpdateSelectors.selectGVStatusUpdateList
  );

  private totalElements$ = this.store.select(
    gvStatusUpdateSelectors.selectTotalElements
  );

  private hasError$ = this.store.select(gvStatusUpdateSelectors.selectHasError);
  private updateResponse$ = this.store.select(
    gvStatusUpdateSelectors.selectUpdateResponse
  );

  private isLoading$ = this.store.select(
    gvStatusUpdateSelectors.selectIsLoading
  );
  private newList$ = this.store.select(gvStatusUpdateSelectors.selectNewList);
  private isErrorLog$ = this.store.select(
    gvStatusUpdateSelectors.selectIsErrorLog
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

  GetGVStatusList() {
    return this.gvStatusList$;
  }

  getError() {
    return this.hasError$;
  }
  getNewList() {
    return this.newList$;
  }
  getIsLoading() {
    return this.isLoading$;
  }
  GetErrorLog() {
    return this.isErrorLog$;
  }
  clearResponse() {
    this.store.dispatch(new GVStatusActions.ResetResponse());
  }
  loadFileUpload(File: FormData, uploadType: string) {
    this.store.dispatch(new GVStatusActions.FileUpload(File,uploadType));
  }

  loadGVStatusList(payload: GVStatusListingPayload, sortField?: SortItem) {
    this.store.dispatch(
      new GVStatusActions.GetGVStatusList(payload, sortField)
    );
  }

  validityExtend(payload: GVExtendValidity) {
    this.store.dispatch(new GVStatusActions.ExtendGVStatus(payload));
  }

  changeStatus(payload: GVStatusChange) {
    this.store.dispatch(new GVStatusActions.ChangeGVStatus(payload));
  }
  loadErrorLog(errorId: string, uploadType: string) {
    this.store.dispatch(new GVStatusActions.ErrorLogDownload(errorId,uploadType));
  }
}
