import { Injectable } from '@angular/core';
import { VendorMasterState } from './vendor-master.state';
import * as VendorMasterAction from './vendor-master.action';
import { vendorMasterSelector } from './vendor-master.selector';

import { Store } from '@ngrx/store';
import { VendorMasterListPayload } from '@poss-web/shared/models';

@Injectable()
export class VendorMasterFacade {
  constructor(public store: Store<VendorMasterState>) {}

  private isLoading$ = this.store.select(vendorMasterSelector.selectIsloading);
  private error$ = this.store.select(vendorMasterSelector.selectError);
  private totalElements$ = this.store.select(
    vendorMasterSelector.selectTotalElements
  );
  private vendorMasterList$ = this.store.select(
    vendorMasterSelector.selectVendorMasterList
  );
  private vendorMaster$ = this.store.select(
    vendorMasterSelector.selectVendorMaster
  );

  getTotalElements() {
    return this.totalElements$;
  }
  getError() {
    return this.error$;
  }

  getIsloading() {
    return this.isLoading$;
  }

  getVendorMasterList() {
    return this.vendorMasterList$;
  }
  getVendorMaster() {
    return this.vendorMaster$;
  }

  loadVendorMasterList(vendorMasterListPayload: VendorMasterListPayload) {
    this.store.dispatch(
      new VendorMasterAction.LoadVendorMasterList(vendorMasterListPayload)
    );
  }
  loadVendorMasterByCode(vendorMaster: string) {
    this.store.dispatch(
      new VendorMasterAction.LoadVendorMasterByCode(vendorMaster)
    );
  }

  searchVendorMaster(vendorCode: string) {
    this.store.dispatch(
      new VendorMasterAction.SearchVendorMasterByCode(vendorCode)
    );
  }

  loadReset() {
    this.store.dispatch(new VendorMasterAction.LoadReset());
  }
}
