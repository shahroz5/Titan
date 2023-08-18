import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';

import {
  brandMasterReducer,
  BRAND_FEATURE_NAME
} from './+state/brand-master.reducer';
import { EffectsModule } from '@ngrx/effects';
import { BrandMasterEffect } from './+state/brand-master.effect';
import { BrandMasterFacade } from './+state/brand-master.facade';
import { BrandMasterService } from './brand-master.service';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(BRAND_FEATURE_NAME, brandMasterReducer),
    EffectsModule.forFeature([BrandMasterEffect])
  ],

  providers: [BrandMasterFacade, BrandMasterService]
})
export class SharedBrandDataAccessBrandModule {}
