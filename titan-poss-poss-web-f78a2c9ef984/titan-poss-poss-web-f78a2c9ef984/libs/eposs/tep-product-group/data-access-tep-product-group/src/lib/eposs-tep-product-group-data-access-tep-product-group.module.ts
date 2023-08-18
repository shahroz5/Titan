import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import {
  tepProductGroupConfigReducer,
  TEP_PRODUCT_GROUP_CONFIG_FEATURE_NAME
} from './+state/tep-product-group-config.reducer';
import { TepProductGroupConfigEffect } from './+state/tep-product-group-config.effect';
import { TepProductGroupConfigFacade } from './+state/tep-product-group-config.facade';
import { TepProductGroupConfigService } from './tep-product-group-config.service';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(
      TEP_PRODUCT_GROUP_CONFIG_FEATURE_NAME,
      tepProductGroupConfigReducer
    ),
    EffectsModule.forFeature([TepProductGroupConfigEffect])
  ],
  providers: [TepProductGroupConfigFacade, TepProductGroupConfigService]
})
export class EpossTepProductGroupDataAccessTepProductGroupModule {}
