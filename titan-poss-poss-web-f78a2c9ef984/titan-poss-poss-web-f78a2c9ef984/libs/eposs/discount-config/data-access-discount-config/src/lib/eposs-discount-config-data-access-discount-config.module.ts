import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import {
  discountConfigFeatureKey,
  DiscountConfigReducer
} from './+state/discount-config.reducer';
import { DiscountConfigFacade } from './+state/discount-config.facade';
import { DiscountConfigEffect } from './+state/discount-config.effects';
import { DiscountConfigService } from './discount-config.service';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(discountConfigFeatureKey, DiscountConfigReducer),
    EffectsModule.forFeature([DiscountConfigEffect])
  ],
  providers: [DiscountConfigFacade, DiscountConfigService]
})
export class EpossDiscountConfigDataAccessDiscountConfigModule {}
