import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevenueHomeComponent } from './revenue-home/revenue-home.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { Routes, RouterModule } from '@angular/router';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';
import { SharedComponentsUiCardMenuModule } from '@poss-web/shared/components/ui-card-menu';

const routes: Routes = [
  {
    path: '',
    component: RevenueHomeComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CommonCustomMaterialModule,
    SharedPermissionUiPermissionModule,
    SharedComponentsUiCardMenuModule
  ],
  declarations: [RevenueHomeComponent]
})
export class SharedRevenueFeatureRevenueHomeModule {}
