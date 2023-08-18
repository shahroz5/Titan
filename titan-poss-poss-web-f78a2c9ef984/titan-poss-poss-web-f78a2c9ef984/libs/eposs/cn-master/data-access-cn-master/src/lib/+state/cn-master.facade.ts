import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';

import { CreditNoteMasterState } from './cn-master.state';
import { CreditNoteMasterSelectors } from './cn-master.selector';
import { CnMasterRequestPayload } from '@poss-web/shared/models';
import * as CreditNoteMasterAction from './cn-master.actions';

@Injectable()
export class CreditNoteMasterFacade {
  constructor(public store: Store<CreditNoteMasterState>) {}

  private isLoading$ = this.store.select(
    CreditNoteMasterSelectors.selectIsloading
  );
  private error$ = this.store.select(CreditNoteMasterSelectors.selectError);
  private hasUpdated$ = this.store.select(
    CreditNoteMasterSelectors.selectHasUpdated
  );

  private totalElements$ = this.store.select(
    CreditNoteMasterSelectors.selectTotalElements
  );
  private creditNoteMasterList$ = this.store.select(
    CreditNoteMasterSelectors.selectCreditNoteMasterList
  );

  private creditNoteMasterDetailByCnTpe$ = this.store.select(
    CreditNoteMasterSelectors.selectCreditNoteDetailByCnType
  );

  getHasUpdated() {
    return this.hasUpdated$;
  }
  getTotalElements() {
    return this.totalElements$;
  }
  getError() {
    return this.error$;
  }

  getIsloading() {
    return this.isLoading$;
  }

  getCreditNoteMasterList() {
    return this.creditNoteMasterList$;
  }

  getCreditNoteMasterDetailByCnType() {
    return this.creditNoteMasterDetailByCnTpe$;
  }

  loadCreditNoteMasterList(
    creditNoteMasterListPayload: CnMasterRequestPayload
  ) {
    this.store.dispatch(
      new CreditNoteMasterAction.LoadCreditNoteMasterList(
        creditNoteMasterListPayload
      )
    );
  }

  loadCreditNoterMasterDetailByCnType(cnType: string) {
    this.store.dispatch(
      new CreditNoteMasterAction.LoadCreditNoteMasterDetailByCNType(cnType)
    );
  }

  updateCreditNoteMasterDetail(cnDetails: any) {
    this.store.dispatch(
      new CreditNoteMasterAction.UpdateCreditNoteMasterDetail(cnDetails)
    );
  }
  searchCreditNoteMasterList(searchValue: string) {
    this.store.dispatch(
      new CreditNoteMasterAction.SearchCreditNoteMasterList(searchValue)
    );
  }

  loadReset() {
    this.store.dispatch(new CreditNoteMasterAction.LoadReset());
  }
}
