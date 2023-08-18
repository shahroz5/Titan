import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ConversionConfigState } from './conversion-config.state';
import {
  ConversionConfigListPayload,
  SaveConversionConfigValuesPayload,
  UpdateToggleButtonPayload
} from '@poss-web/shared/models';
import * as ConversionConfigActions from './conversion-config.actions';
import { ConversionConfigSelectors } from './conversion-config.selectors';
@Injectable()
export class ConversionConfigFacade {
  constructor(public store: Store<ConversionConfigState>) {}
  private conversionConfigList$ = this.store.select(
    ConversionConfigSelectors.selectConversionConfigList
  );
  private isLoading$ = this.store.select(
    ConversionConfigSelectors.selectIsLoading
  );
  private error$ = this.store.select(ConversionConfigSelectors.selectError);
  private totalElements$ = this.store.select(
    ConversionConfigSelectors.selectTotalElements
  );
  private hasSaved$ = this.store.select(
    ConversionConfigSelectors.selectHasSaved
  );
  private hasUpdated$ = this.store.select(
    ConversionConfigSelectors.selectHasUpdated
  );
  private selectConversionConfigDetailsById$ = this.store.select(
    ConversionConfigSelectors.selectConversionConfigDetailsById
  );
  private selectProductGroups$ = this.store.select(
    ConversionConfigSelectors.selectProductGroups
  );
  private selectProductCategory$ = this.store.select(
    ConversionConfigSelectors.selectProductCategories
  );
  private selectSaveSuccessPayload$ = this.store.select(
    ConversionConfigSelectors.selectSaveSuccessPayload
  );

  private selectHasSearched$ = this.store.select(
    ConversionConfigSelectors.selectHasSearched
  );
  getConversionConfigList() {
    return this.conversionConfigList$;
  }
  getIsLoading() {
    return this.isLoading$;
  }
  getError() {
    return this.error$;
  }
  getTotalElements() {
    return this.totalElements$;
  }
  getHasSaved() {
    return this.hasSaved$;
  }
  getHasUpdated() {
    return this.hasUpdated$;
  }
  getConversionConfigDetailsById() {
    return this.selectConversionConfigDetailsById$;
  }
  getProductGroups() {
    return this.selectProductGroups$;
  }
  getProductCategories() {
    return this.selectProductCategory$;
  }
  getSaveSuccessPayload() {
    return this.selectSaveSuccessPayload$;
  }

  getHasSearched() {
    return this.selectHasSearched$;
  }
  loadConversionConfigList(
    conversionConfigListPayload: ConversionConfigListPayload
  ) {
    this.store.dispatch(
      new ConversionConfigActions.LoadConversionConfigList(
        conversionConfigListPayload
      )
    );
  }
  loadConversionConfigDetailsById(configId) {
    this.store.dispatch(
      new ConversionConfigActions.ConversionConfigDetailsById(configId)
    );
  }

  resetConversionConfig() {
    this.store.dispatch(new ConversionConfigActions.ResetConversionConfig());
  }
  loadProductGroups() {
    this.store.dispatch(new ConversionConfigActions.LoadProductGroups());
  }
  loadProductCategories() {
    this.store.dispatch(new ConversionConfigActions.LoadProductCategories());
  }
  searchByConfigName(configName: string) {
    this.store.dispatch(
      new ConversionConfigActions.SearchConfigName(configName)
    );
  }
  saveConversionConfigValues(configValues: SaveConversionConfigValuesPayload) {
    this.store.dispatch(
      new ConversionConfigActions.SaveConversionConfigValues(configValues)
    );
  }
  updateConversionConfigDetails(
    updatePayload: SaveConversionConfigValuesPayload
  ) {
    this.store.dispatch(
      new ConversionConfigActions.UpdateConversionConfigDetails(updatePayload)
    );
  }

  updateToggleButton(updateToggleButton: UpdateToggleButtonPayload) {
    this.store.dispatch(
      new ConversionConfigActions.UpdateToggleButton(updateToggleButton)
    );
  }
}
