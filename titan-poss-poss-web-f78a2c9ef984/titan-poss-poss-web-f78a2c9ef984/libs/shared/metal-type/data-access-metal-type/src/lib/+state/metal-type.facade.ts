import { Injectable } from '@angular/core';
import * as MetalTypeAction from './metal-type.actions';
import { MetalTypeSelctors } from './metal-type.selectors';
import { MetalTypeState } from './metal-type.state';
import {
  MetalTypePayload,
  UpdateMetalTypePayload,
  CreateMetalTypePayload
} from '@poss-web/shared/models';

import { Store } from '@ngrx/store';
@Injectable()
export class MetalTypeFacade {
  constructor(public store: Store<MetalTypeState>) {}
  private metalType$ = this.store.select(MetalTypeSelctors.selectMetalType);
  metalTypeList$ = this.store.select(MetalTypeSelctors.selectMetalTypeList);
  private totalElements$ = this.store.select(
    MetalTypeSelctors.selectTotalElements
  );

  private hasError$ = this.store.select(MetalTypeSelctors.selectHasError);
  private isLoading$ = this.store.select(MetalTypeSelctors.selectIsloading);
  private hasUpdated$ = this.store.select(MetalTypeSelctors.selectHasUpdated);
  private hasSaved$ = this.store.select(MetalTypeSelctors.selectHasSaved);

  materialTypeLov$ = this.store.select(MetalTypeSelctors.selectMaterialTypeLov);

  getMaterialTypeLov() {
    return this.materialTypeLov$;
  }
  getHasSaved() {
    return this.hasSaved$;
  }

  getHasUpdated() {
    return this.hasUpdated$;
  }
  getMetalType() {
    return this.metalType$;
  }
  getHasError() {
    return this.hasError$;
  }
  getIsloading() {
    return this.isLoading$;
  }
  getTotalElements() {
    return this.totalElements$;
  }
  getMetalTypeList() {
    return this.metalTypeList$;
  }

  loadMaterialTypeLov() {
    this.store.dispatch(new MetalTypeAction.LoadMaterialTypeLov());
  }
  loadreset() {
    this.store.dispatch(new MetalTypeAction.LoadReset());
  }
  loadMetalTypeDetails(materialCode) {
    this.store.dispatch(
      new MetalTypeAction.LoadMetalTypeDetailByMaterialCode(materialCode)
    );
  }
  updateMetalTypeDetails(metalType: UpdateMetalTypePayload) {
    this.store.dispatch(new MetalTypeAction.UpdateMetalTypeDeatil(metalType));
  }
  saveMetalType(metalType: CreateMetalTypePayload) {
    this.store.dispatch(new MetalTypeAction.CreateMetalType(metalType));
  }
  searchMetalTypeList(searchValue: string) {
    this.store.dispatch(
      new MetalTypeAction.SearchMetalTypeByMaterialCode(searchValue)
    );
  }
  loadMetalTypeList(metalTypePayload: MetalTypePayload) {
    this.store.dispatch(
      new MetalTypeAction.LoadMetalTypeList(metalTypePayload)
    );
  }
}
