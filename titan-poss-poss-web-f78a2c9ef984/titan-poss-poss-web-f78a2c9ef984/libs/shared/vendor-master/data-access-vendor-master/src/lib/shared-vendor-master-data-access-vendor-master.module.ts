import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import {
  vendorMasterFeatureKey,
  vendorMasterReducer
} from './+state/vendor-master.reducer';
import { VendorMasterEffect } from './+state/vendor-master.effect';
import { VendorMasterService } from './vendor-master.service';
import { VendorMasterFacade } from './+state/vendor-master.facade';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(vendorMasterFeatureKey, vendorMasterReducer),
    EffectsModule.forFeature([VendorMasterEffect])
  ],
  providers: [VendorMasterFacade, VendorMasterService]
})
export class SharedVendorMasterDataAccessVendorMasterModule {}
