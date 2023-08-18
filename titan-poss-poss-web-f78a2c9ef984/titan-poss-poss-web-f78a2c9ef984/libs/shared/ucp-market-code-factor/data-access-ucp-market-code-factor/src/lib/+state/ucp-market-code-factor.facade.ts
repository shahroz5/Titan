import { Injectable } from '@angular/core';
import { UcpMarketCodeFactorState } from './ucp-market-code-factor.state';
import * as ComplexityCodeActions from './ucp-market-code-factor.action';
import { upcMarketCodeFactorSelector } from './ucp-market-code-factor.selector';

import { Store } from '@ngrx/store';
import {
  UcpMarketCodeListPayload,
  SaveUcpMarketCodePayload,
  UpdateUcpMarketCodePayload
} from '@poss-web/shared/models';

@Injectable()
export class UcpMarketCodeFactorFacade {
  constructor(public store: Store<UcpMarketCodeFactorState>) {}

  private hasSaved$ = this.store.select(
    upcMarketCodeFactorSelector.selectHasSaved
  );
  private hasUpdated$ = this.store.select(
    upcMarketCodeFactorSelector.selectHasUpdated
  );
  private isLoading$ = this.store.select(
    upcMarketCodeFactorSelector.selectIsloading
  );
  private error$ = this.store.select(upcMarketCodeFactorSelector.selectError);
  private totalElements$ = this.store.select(
    upcMarketCodeFactorSelector.selectTotalElements
  );
  private ucpMarketCodeFactorList$ = this.store.select(
    upcMarketCodeFactorSelector.selectUcpMarketCodeFactorList
  );
  private ucpMarketCodeFactor$ = this.store.select(
    upcMarketCodeFactorSelector.selectUcpMarketCodeFactor
  );

  private marketCode$ = this.store.select(
    upcMarketCodeFactorSelector.selectMarketCode
  );
  private ucpProductGroup$ = this.store.select(
    upcMarketCodeFactorSelector.selectUcpProductGroup
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

  getUcpMarketCodeFactorList() {
    return this.ucpMarketCodeFactorList$;
  }
  getUcpMarketCodeFactor() {
    return this.ucpMarketCodeFactor$;
  }

  getMarketCode() {
    return this.marketCode$;
  }
  getUcpProductGroup() {
    return this.ucpProductGroup$;
  }
  loadMarketCode() {
    this.store.dispatch(new ComplexityCodeActions.LoadMarketCode());
  }

  loadUcpProductGroup() {
    this.store.dispatch(new ComplexityCodeActions.LoadUcpProductCode());
  }
  loadUcpMarketCodeFactorList(
    ucpMarketCodeFactorListPayload: UcpMarketCodeListPayload,
    searchValue?: string
  ) {
    this.store.dispatch(
      new ComplexityCodeActions.LoadUCPMarketCodeFactorCodeList(
        ucpMarketCodeFactorListPayload,
        searchValue
      )
    );
  }
  loadUcpMarketCodeFactorByCode(ucpMarketCodeFactor: string) {
    this.store.dispatch(
      new ComplexityCodeActions.LoadUCPMarketCodeFactorByCode(
        ucpMarketCodeFactor
      )
    );
  }
  updateUcpMarketCodeFactor(
    updateUcpMarketCodePayload: UpdateUcpMarketCodePayload
  ) {
    this.store.dispatch(
      new ComplexityCodeActions.UpdateUCPMarketCodeFactorByCode(
        updateUcpMarketCodePayload
      )
    );
  }
  saveUcpMarketCodeFactor(saveUcpMarketCodePayload: SaveUcpMarketCodePayload) {
    this.store.dispatch(
      new ComplexityCodeActions.SaveUCPMarketCodeFactorCode(
        saveUcpMarketCodePayload
      )
    );
  }

  loadReset() {
    this.store.dispatch(new ComplexityCodeActions.LoadReset());
  }
}
