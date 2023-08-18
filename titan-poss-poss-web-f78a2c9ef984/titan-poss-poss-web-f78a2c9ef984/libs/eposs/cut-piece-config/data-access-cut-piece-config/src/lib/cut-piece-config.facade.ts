import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { CutPieceConfigState } from './cut-piece-config.state';
import * as CutPieceConfigActions from './cut-piece-config.actions';
import { CutPieceConfigSelectors } from './cut-piece-config.selectors';
import { ProductCategoryMapping } from '@poss-web/shared/models';

@Injectable()
export class CutPieceConfigFacade {
  constructor(private store: Store<CutPieceConfigState>) {}

  private configId$ = this.store.select(CutPieceConfigSelectors.selectConfigId);

  private error$ = this.store.select(CutPieceConfigSelectors.selectError);

  private isLoading$ = this.store.select(
    CutPieceConfigSelectors.selectIsLoading
  );

  private hasSaved$ = this.store.select(CutPieceConfigSelectors.selectHasSaved);

  private cutPieceConfigList$ = this.store.select(
    CutPieceConfigSelectors.selectCutPieceConfigList
  );

  private totalElements$ = this.store.select(
    CutPieceConfigSelectors.selectTotalElements
  );

  private productCategories$ = this.store.select(
    CutPieceConfigSelectors.selectProductCategories
  );
  private selectedPcs$ = this.store.select(
    CutPieceConfigSelectors.selectAllSelectedPcs
  );

  getError() {
    return this.error$;
  }
  getIsLoading() {
    return this.isLoading$;
  }
  getConfigId() {
    return this.configId$;
  }
  getHasSaved() {
    return this.hasSaved$;
  }
  getCutPieceConfigList() {
    return this.cutPieceConfigList$;
  }
  getTotalElements() {
    return this.totalElements$;
  }
  getProductCategories() {
    return this.productCategories$;
  }
  getSelectedPcs() {
    return this.selectedPcs$;
  }
  loadCutPieceConfig() {
    this.store.dispatch(new CutPieceConfigActions.LoadCutPieceConfigs());
  }
  saveCutPieceConfig(payload: ProductCategoryMapping) {
    this.store.dispatch(new CutPieceConfigActions.SaveCutPieceConfig(payload));
  }
  loadProductCategoryMapping(listPayload: {
    configId: string;
    pageIndex: number;
    pageSize: number;
  }) {
    this.store.dispatch(
      new CutPieceConfigActions.LoadProductCategoryMapping(listPayload)
    );
  }

  loadProductCategories() {
    this.store.dispatch(new CutPieceConfigActions.LoadProductCategories());
  }
  searchProductCategoryCode(searchPayload: {
    productCategoryCode: string;
    configId: string;
  }) {
    this.store.dispatch(
      new CutPieceConfigActions.SearchProductCategoryCode(searchPayload)
    );
  }

  resetCutPieceConfig() {
    this.store.dispatch(new CutPieceConfigActions.ResetCutPieceConfig());
  }
  loadSelectedPcs(listPayload: {
    configId: string;
    pageIndex: number;
    pageSize: number;
  }) {
    this.store.dispatch(new CutPieceConfigActions.LoadSelectedPcs(listPayload));
  }
}
