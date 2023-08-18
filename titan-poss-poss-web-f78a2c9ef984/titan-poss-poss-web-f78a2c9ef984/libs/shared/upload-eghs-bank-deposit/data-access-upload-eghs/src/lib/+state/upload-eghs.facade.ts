import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { UploadEGHSState } from './upload-eghs.state';
import * as UploadeGHSBankDepositActions from './upload-eghs.actions';
import { UploadeGHSSelectors } from './upload-eghs.selector';

@Injectable()
export class UploadeGHSFacade {
  constructor(private store: Store<UploadEGHSState>) {}
  error$ = this.store.select(UploadeGHSSelectors.selectError);
  isLoading$ = this.store.select(UploadeGHSSelectors.selectIsLoading);
  fileResponse = this.store.select(UploadeGHSSelectors.selectFileResponse);
  getError() {
    return this.error$;
  }
  getIsLoading() {
    return this.isLoading$;
  }
  getFileResponse() {
    return this.fileResponse;
  }
  uploadeGHSBankDepost(file: FormData) {
    this.store.dispatch(
      new UploadeGHSBankDepositActions.UploadeGHSBankDeposit(file)
    );
  }
  resetUploadEghs() {
    this.store.dispatch(new UploadeGHSBankDepositActions.ResetUploadEghs());
  }
}
