import { Injectable } from '@angular/core';
import * as PurityActions from './purity.actions';
import { PuritySelectors } from './purity.selector';
import { PurityState } from './purity.state';
import {
  CreatePurityPayload,
  PurityListPayload,
  UpdatePurityPayload
} from '@poss-web/shared/models';

import { Store } from '@ngrx/store';
@Injectable()
export class PurityFacade {
  constructor(public store: Store<PurityState>) {}

  private isLoading$ = this.store.select(PuritySelectors.selectIsloading);
  private error$ = this.store.select(PuritySelectors.selectError);
  private hasSaved$ = this.store.select(PuritySelectors.selectHasSaved);
  private hasUpdated$ = this.store.select(PuritySelectors.selectHasUpdated);
  private isActiveUpdated$ = this.store.select(
    PuritySelectors.selectisActiveUpdated
  );
  private totalElements$ = this.store.select(
    PuritySelectors.selectTotalElements
  );
  private purityList$ = this.store.select(PuritySelectors.selectPurityList);
  private metalTypes$ = this.store.select(PuritySelectors.selectMetalType);
  private purity$ = this.store.select(PuritySelectors.selectPurity);

  getIsActiveUpdated() {
    return this.isActiveUpdated$;
  }

  getHasSaved() {
    return this.hasSaved$;
  }
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
  getMetalTypes() {
    return this.metalTypes$;
  }
  getPurityList() {
    return this.purityList$;
  }

  getPurityByMaterialCode() {
    return this.purity$;
  }

  loadPurityByMaterialCodeAndPurity(obj) {
    this.store.dispatch(
      new PurityActions.LoadPurityByMaterialCodeAndPurity(obj)
    );
  }

  savePurity(createPurityPayload: CreatePurityPayload) {
    this.store.dispatch(new PurityActions.CreatePurity(createPurityPayload));
  }
  updatePurityDetails(updatePurityPayload: UpdatePurityPayload) {
    this.store.dispatch(new PurityActions.UpdatePurity(updatePurityPayload));
  }
  loadMetalTypes() {
    this.store.dispatch(new PurityActions.LoadMetalTypes());
  }

  loadPurityList(purityListPayload: PurityListPayload, searchValue?: string) {
    {
      this.store.dispatch(
        new PurityActions.LoadPurityList(purityListPayload, searchValue)
      );
    }
  }

  loadReset() {
    this.store.dispatch(new PurityActions.LoadReset());
  }
}
