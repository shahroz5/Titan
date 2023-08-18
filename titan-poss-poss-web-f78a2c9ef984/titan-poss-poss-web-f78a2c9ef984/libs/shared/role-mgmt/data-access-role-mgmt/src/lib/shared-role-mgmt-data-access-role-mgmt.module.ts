import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { RoleManagementFacade } from './+state/role-management.facade';
import { RoleManagementEffect } from './+state/role-management.effect';
import {
  ROLEMANAGEMENT_FEATURE_KEY,
  RoleManagementReducer
} from './+state/role-management.reducer';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(ROLEMANAGEMENT_FEATURE_KEY, RoleManagementReducer),
    EffectsModule.forFeature([RoleManagementEffect])
  ],
  providers: [RoleManagementFacade]
})
export class SharedRoleMgmtDataAccessRoleMgmtModule {}
