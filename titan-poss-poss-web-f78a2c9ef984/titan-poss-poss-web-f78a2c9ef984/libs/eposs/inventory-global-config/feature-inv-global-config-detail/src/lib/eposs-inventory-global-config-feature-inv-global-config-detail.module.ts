import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { InventoryGlobalConfigDetailComponent } from './inventory-global-config-detail/inventory-global-config-detail.component';
import { EpossInventoryGlobalConfigDataAccessInvGlobalConfigModule } from '@poss-web/eposs/inventory-global-config/data-access-inv-global-config';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { EpossInventoryGlobalConfigUiInvGlobalConfigDetailModule } from '@poss-web/eposs/inventory-global-config/ui-inv-global-config-detail';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
const routes: Routes = [
  {
    path: '',
    component: InventoryGlobalConfigDetailComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    RouterModule.forChild(routes),
    EpossInventoryGlobalConfigUiInvGlobalConfigDetailModule,
    EpossInventoryGlobalConfigDataAccessInvGlobalConfigModule,
    SharedComponentsUiLoaderModule
  ],
  declarations: [InventoryGlobalConfigDetailComponent]
})
export class EpossInventoryGlobalConfigFeatureInvGlobalConfigDetailModule {}
