import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as CnDirectActions from './cn-direct.action';
import {
  SearchPayloadReq,
  UploadCNPayloadReq,
  SaveCnActionPayload
} from '@poss-web/shared/models';
import { CnDirectState } from './cn-direct.state';
import { cnDirectSelector } from './cn-direct.selectors';

@Injectable()
export class CnDirectFacade {
  constructor(public store: Store<CnDirectState>) {}

  private isLoading$ = this.store.select(cnDirectSelector.selectIsLoading);
  private error$ = this.store.select(cnDirectSelector.selectError);

  private hasUpdated$ = this.store.select(cnDirectSelector.selectHasUpdated);

  private selectCnList$ = this.store.select(cnDirectSelector.selectCnList);
  private selectTotalElements$ = this.store.select(
    cnDirectSelector.selectTotalElements
  );
  getHasUpdated() {
    return this.hasUpdated$;
  }

  getError() {
    return this.error$;
  }
  getCnList() {
    return this.selectCnList$;
  }
  getIsloading() {
    return this.isLoading$;
  }
  getTotalElements() {
    return this.selectTotalElements$;
  }
  searchCn(searchPayloadReq: SearchPayloadReq) {
    this.store.dispatch(
      new CnDirectActions.SearchCnDirectList(searchPayloadReq)
    );
  }

  uploadCn(uploadCNPayloadReq: UploadCNPayloadReq) {
    this.store.dispatch(new CnDirectActions.UploadCn(uploadCNPayloadReq));
  }

  saveCnStatus(saveCnActionPayload: SaveCnActionPayload) {
    this.store.dispatch(
      new CnDirectActions.SaveCnDirectAction(saveCnActionPayload)
    );
  }

  loadReset() {
    this.store.dispatch(new CnDirectActions.LoadReset());
  }
}
