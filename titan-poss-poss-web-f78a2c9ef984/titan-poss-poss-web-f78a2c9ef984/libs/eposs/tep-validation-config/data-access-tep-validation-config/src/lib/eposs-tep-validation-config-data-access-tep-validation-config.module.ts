import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import {
  tepValidationConfigReducer,
  TEP_VALIDATION_CONFIG_FEATURE_NAME
} from './+state/tep-validation-config.reducer';
import { TepValidationConfigEffect } from './+state/tep-validation-config.effect';
import { TepValidationConfigFacade } from './+state/tep-validation-config.facade';
import { TepValidationConfigService } from './tep-validation-config.service';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(
      TEP_VALIDATION_CONFIG_FEATURE_NAME,
      tepValidationConfigReducer
    ),
    EffectsModule.forFeature([TepValidationConfigEffect])
  ],
  providers: [TepValidationConfigFacade, TepValidationConfigService]
})
export class EpossTepValidationConfigDataAccessTepValidationConfigModule {}
