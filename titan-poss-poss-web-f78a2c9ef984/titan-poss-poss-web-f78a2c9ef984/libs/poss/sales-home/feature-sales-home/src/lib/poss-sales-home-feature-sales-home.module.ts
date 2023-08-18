import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesHomeComponent } from './sales-home/sales-home.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { Routes, RouterModule } from '@angular/router';
import { SharedComponentsUiCardMenuModule } from '@poss-web/shared/components/ui-card-menu';
import { SharedPermissionDataAccessPermissionModule } from '@poss-web/shared/permission/data-access-permission';

const routes: Routes = [
  {
    path: '',
    component: SalesHomeComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CommonCustomMaterialModule,
    SharedPermissionDataAccessPermissionModule,
    SharedComponentsUiCardMenuModule
  ],
  declarations: [SalesHomeComponent]
})
export class PossSalesHomeFeatureSalesHomeModule {}
