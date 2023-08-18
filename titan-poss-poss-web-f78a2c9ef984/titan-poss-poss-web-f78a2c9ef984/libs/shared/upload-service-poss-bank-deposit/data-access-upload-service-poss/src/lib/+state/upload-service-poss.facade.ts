import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { UploadServicePossState } from './upload-service-poss.state';
import * as  UploadServicePossBankDepositActions from './upload-service-poss.actions';
import {  UploadServicePossSelectors } from './upload-service-poss.selector';

@Injectable()
export class  UploadServicePossFacade {
  constructor(private store: Store<UploadServicePossState>) {}
  error$ = this.store.select( UploadServicePossSelectors.selectError);
  isLoading$ = this.store.select( UploadServicePossSelectors.selectIsLoading);
  fileResponse = this.store.select( UploadServicePossSelectors.selectFileResponse);
  getError() {
    return this.error$;
  }
  getIsLoading() {
    return this.isLoading$;
  }
  getFileResponse() {
    return this.fileResponse;
  }
  uploadServicePossBankDeposit(file: FormData) {
    this.store.dispatch(
      new  UploadServicePossBankDepositActions. UploadServicePossBankDeposit(file)
    );
  }
  resetUploadServicePoss() {
    this.store.dispatch(new  UploadServicePossBankDepositActions.ResetUploadServicePoss());
  }
}