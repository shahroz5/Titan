import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SharedOneTimePasswordDataAccessOneTimePasswordModule } from '@poss-web/shared/one-time-password/data-access-one-time-password';
import { UserManagmentEffect } from './+state/user-management.effect';
import { UserManagementFacade } from './+state/user-management.facade';
import {
  UserManagementReducer,
  userManagement_Feature_Key
} from './+state/user-management.reducer';
import { UserManagementService } from './userManagement.service';

@NgModule({
  imports: [
    CommonModule,
    SharedOneTimePasswordDataAccessOneTimePasswordModule,
    StoreModule.forFeature(userManagement_Feature_Key, UserManagementReducer),
    EffectsModule.forFeature([UserManagmentEffect])
  ],
  providers: [UserManagementFacade, UserManagementService]
})
export class SharedUserMgmtDataAccessUserModule {}
