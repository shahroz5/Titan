import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { CnValidationState } from './cn-validation.state';
import * as CnValidationActions from './cn-validation.actions';
import { cnValidationSelectors } from './cn-validation.selectors';
import { CnValidationListPayload, CnValidation } from '@poss-web/shared/models';

@Injectable()
export class CnValidationFacade {
  constructor(public store: Store<CnValidationState>) {}

  private cnValidationList$ = this.store.select(
    cnValidationSelectors.selectCnValidationList
  );
  private cnTypeList$ = this.store.select(
    cnValidationSelectors.selectCnTypeList
  );
  private cnValidation$ = this.store.select(
    cnValidationSelectors.selectCnValidation
  );

  private error$ = this.store.select(cnValidationSelectors.selectError);
  private hasSaved$ = this.store.select(cnValidationSelectors.selectHassaved);
  private hasUpdated$ = this.store.select(
    cnValidationSelectors.selectHasUpdated
  );
  private isLoading$ = this.store.select(cnValidationSelectors.selectIsLoading);
  private totalElements$ = this.store.select(
    cnValidationSelectors.selectTotalElement
  );

  getError() {
    return this.error$;
  }

  getIsloading() {
    return this.isLoading$;
  }
  getHasSaved() {
    return this.hasSaved$;
  }
  getHasUpdated() {
    return this.hasUpdated$;
  }
  getTotalElement() {
    return this.totalElements$;
  }
  getCnValidation() {
    return this.cnValidation$;
  }
  getCnValidationList() {
    return this.cnValidationList$;
  }

  getCnTypeList() {
    return this.cnTypeList$;
  }

  loadCnValidationList(cnValidationListPayload: CnValidationListPayload) {
    this.store.dispatch(
      new CnValidationActions.LoadCnValidationList(cnValidationListPayload)
    );
  }

  saveCnValidation(cnValidation: CnValidation) {
    this.store.dispatch(new CnValidationActions.SaveCnValidation(cnValidation));
  }
  loadCnValidationByRuleId(ruleId: any, ruleType: string) {
    this.store.dispatch(
      new CnValidationActions.LoadCnValidationByRuleId(ruleId, ruleType)
    );
  }

  loadNewCnValidationByRuleId() {
    this.store.dispatch(new CnValidationActions.LoadNewCnValidationByRuleId());
  }

  updateCnValidation(updateCnValidation: CnValidation) {
    this.store.dispatch(
      new CnValidationActions.UpdateCnValidation(updateCnValidation)
    );
  }

  searchCnType(cnType: string) {
    this.store.dispatch(
      new CnValidationActions.SearchCnValidationByCnType(cnType)
    );
  }

  loadCnTypeList() {
    this.store.dispatch(new CnValidationActions.LoadCnTypeList());
  }

  loadReset() {
    this.store.dispatch(new CnValidationActions.LoadReset());
  }
}
