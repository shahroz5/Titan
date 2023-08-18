import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { CommonEffects } from './+state/common.effects';
import { commonFeatureKey, commonReducer } from './+state/common.reducer';
import { CommonFacade } from './+state/common.facade';

import { CommonService } from './common.service';
import { InventoryValidationService } from './inventory-validation.service';
@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(commonFeatureKey, commonReducer),
    EffectsModule.forFeature([CommonEffects])
  ],
  providers: [CommonFacade, CommonService, InventoryValidationService]
})
export class SharedCommonDataAccessCommonModule {}
