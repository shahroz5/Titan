import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventoryGlobalConfigDetailItemComponent } from './inventory-global-config-detail-item/inventory-global-config-detail-item.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiDynamicFormModule } from '@poss-web/shared/components/ui-dynamic-form';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiDynamicFormModule
  ],
  declarations: [InventoryGlobalConfigDetailItemComponent],
  exports: [InventoryGlobalConfigDetailItemComponent]
})
export class EpossInventoryGlobalConfigUiInvGlobalConfigDetailModule {}
