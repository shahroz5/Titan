import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BcShellComponent } from './bc-shell/bc-shell.component';
import { Routes, RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { PossBcFeatureBcListModule } from '@poss-web/poss/bc/feature-bc-list';
import { SharedBcRequestsFeatureBcStatusModule } from '@poss-web/shared/bc-requests/feature-bc-status';
import { SharedToolbarFeatureToolbarModule } from '@poss-web/shared/toolbar/feature-toolbar';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';
import { SharedPermissionDataAccessPermissionModule } from '@poss-web/shared/permission/data-access-permission';

const routes: Routes = [
  {
    path: '',
    component: BcShellComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    RouterModule.forChild(routes),
    PossBcFeatureBcListModule,
    SharedBcRequestsFeatureBcStatusModule,
    SharedToolbarFeatureToolbarModule,
    SharedPermissionUiPermissionModule,
    SharedPermissionDataAccessPermissionModule
  ],
  declarations: [BcShellComponent],
  exports: [BcShellComponent]
})
export class PossBcFeatureBcShellModule {}
