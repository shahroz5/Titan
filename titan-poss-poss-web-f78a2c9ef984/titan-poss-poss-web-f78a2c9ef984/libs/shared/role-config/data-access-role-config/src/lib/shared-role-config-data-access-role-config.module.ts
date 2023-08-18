import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { RoleConfigFacade } from './+state/role-config.facade';
import {
  RoleConfigReducer,
  ROLECONFIG_FEATURE_KEY
} from './+state/role-config.reducer';
import { RoleConfigEffect } from './+state/role-config.effect';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(ROLECONFIG_FEATURE_KEY, RoleConfigReducer),
    EffectsModule.forFeature([RoleConfigEffect])
  ],
  providers: [RoleConfigFacade]
})
export class SharedRoleConfigDataAccessRoleConfigModule {}
