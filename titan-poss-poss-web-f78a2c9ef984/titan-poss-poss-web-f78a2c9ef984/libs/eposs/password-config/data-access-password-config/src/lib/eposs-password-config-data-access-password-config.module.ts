import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { SharedCommonDataAccessCommonModule } from '@poss-web/shared/common/data-access-common';
import {
  passwordConfigFeatureKey,
  passwordConfigReducer
} from './+state/password-config.reducer';
import { PasswordConfigEffects } from './+state/password-config.effect';
import { PasswordConfigService } from './password-config.service';
import { PasswordConfigFacade } from './+state/password-config.facade';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(passwordConfigFeatureKey, passwordConfigReducer),
    EffectsModule.forFeature([PasswordConfigEffects]),
    SharedCommonDataAccessCommonModule
  ],
  providers: [PasswordConfigFacade, PasswordConfigService]
})
export class EpossPasswordConfigDataAccessPasswordConfigModule {}
