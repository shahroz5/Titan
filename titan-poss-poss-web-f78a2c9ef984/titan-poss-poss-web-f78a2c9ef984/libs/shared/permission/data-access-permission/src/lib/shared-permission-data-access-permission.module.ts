import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { PermissionEffect } from './+state/permission.effect';
import { PermissionFacade } from './+state/permission.facade';
import { PermissionReducer } from './+state/permission.reducer';
import { PERMISSION_FEATURE_KEY } from './+state/permission.state';
import { PermissionDataService } from './permission-data.service';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(PERMISSION_FEATURE_KEY, PermissionReducer),
    EffectsModule.forFeature([PermissionEffect])
  ],
  providers: [PermissionDataService, PermissionFacade]
})
export class SharedPermissionDataAccessPermissionModule {}
