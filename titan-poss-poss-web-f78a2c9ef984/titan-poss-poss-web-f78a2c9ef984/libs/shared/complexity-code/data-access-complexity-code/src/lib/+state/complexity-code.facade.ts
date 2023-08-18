import { Injectable } from '@angular/core';
import { ComplexityCodeState } from './complexity-code.state';
import * as ComplexityCodeActions from './complexity-code.actions';
import { ComplexityListPayload, ComplexityCode } from '@poss-web/shared/models';
import { complexityCodeSelector } from './complexity-code.selectors';

import { Store } from '@ngrx/store';

@Injectable()
export class ComplexityCodeFacade {
  constructor(public store: Store<ComplexityCodeState>) {}

  private hasSaved$ = this.store.select(complexityCodeSelector.selectHasSaved);
  private hasUpdated$ = this.store.select(
    complexityCodeSelector.selectHasUpdated
  );
  private isLoading$ = this.store.select(
    complexityCodeSelector.selectIsloading
  );
  private error$ = this.store.select(complexityCodeSelector.selectError);
  private totalElements$ = this.store.select(
    complexityCodeSelector.selectTotalElements
  );
  private complexityCodeList$ = this.store.select(
    complexityCodeSelector.selectcomplexityCodeList
  );
  private complexityCode$ = this.store.select(
    complexityCodeSelector.selectComplexityCode
  );

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

  getComplexityCodeList() {
    return this.complexityCodeList$;
  }
  getComplexityCode() {
    return this.complexityCode$;
  }

  loadComplexityCodeList(complexityCodeListPayload: ComplexityListPayload) {
    this.store.dispatch(
      new ComplexityCodeActions.LoadComplexityCodeList(
        complexityCodeListPayload
      )
    );
  }
  loadComplexityByCode(complexityCode: string) {
    this.store.dispatch(
      new ComplexityCodeActions.LoadComplexityByCode(complexityCode)
    );
  }
  updateComplexityCode(complexityCode: ComplexityCode) {
    this.store.dispatch(
      new ComplexityCodeActions.UpdateComplexityByCode(complexityCode)
    );
  }
  saveComplexityCode(complexityCode: ComplexityCode) {
    this.store.dispatch(
      new ComplexityCodeActions.SaveComplexityCode(complexityCode)
    );
  }
  searchComplexityCode(complexityCode: string) {
    this.store.dispatch(
      new ComplexityCodeActions.SearchComplexityCode(complexityCode)
    );
  }
  loadReset() {
    this.store.dispatch(new ComplexityCodeActions.LoadReset());
  }
}
