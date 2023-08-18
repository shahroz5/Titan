import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { ProfileDataFacade } from './+state/profile-data.facade';
import { ProfileDataEffect } from './+state/profile-data.effect';
import {
  PROFILEDATA_FEATURE_KEY,
  ProfileDataReducer
} from './+state/profile-data.reducer';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(PROFILEDATA_FEATURE_KEY, ProfileDataReducer),
    EffectsModule.forFeature([ProfileDataEffect])
  ],
  providers: [ProfileDataFacade]
})
export class SharedProfileDataAccessProfileModule {}
