import { AccessControlManagementService } from './access-control-mgmt.service';
import { AccessControlManagementFacade } from './+state/access-control-mgmt.facade';
import { AccessControlManagementEffect } from './+state/access-control-mgmt.effect';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ACCESS_CONTROL_MANAGEMENT_FEATURE_KEY } from './+state/access-control-mgmt.state';
import { AccessControlManagementReducer } from './+state/access-control-mgmt.reducer';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(
      ACCESS_CONTROL_MANAGEMENT_FEATURE_KEY,
      AccessControlManagementReducer
    ),
    EffectsModule.forFeature([AccessControlManagementEffect])
  ],
  providers: [AccessControlManagementFacade, AccessControlManagementService]
})
export class SharedAccessControlMgmtDataAccessAccessControlMgmtModule {}
