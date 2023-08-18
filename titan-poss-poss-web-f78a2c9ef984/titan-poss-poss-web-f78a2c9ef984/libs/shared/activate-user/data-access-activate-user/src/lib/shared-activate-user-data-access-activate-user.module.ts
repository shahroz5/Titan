import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { ActivateUserFacade } from './+state/activate-user.facade';
import {
  ACTIVATEUSER_FEATURE_KEY,
  ActivateUserReducer
} from './+state/activate-user.reducer';
import { ActivateUserEffect } from './+state/activate-user.effect';
import { SharedOneTimePasswordDataAccessOneTimePasswordModule } from '@poss-web/shared/one-time-password/data-access-one-time-password';

@NgModule({
  imports: [
    CommonModule,
    SharedOneTimePasswordDataAccessOneTimePasswordModule,
    StoreModule.forFeature(ACTIVATEUSER_FEATURE_KEY, ActivateUserReducer),
    EffectsModule.forFeature([ActivateUserEffect])
  ],
  providers: [ActivateUserFacade]
})
export class SharedActivateUserDataAccessActivateUserModule {}
