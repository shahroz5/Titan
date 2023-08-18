import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiDynamicFormModule } from '@poss-web/shared/components/ui-dynamic-form';

import { WeightValueConfigItemsComponent } from './weight-value-config-items/weight-value-config-items.component';
import { WeightValueConfigListingItemComponent } from './weight-value-config-listing-item/weight-value-config-listing-item.component';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiDynamicFormModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiToggleButtonModule,
    SharedPermissionUiPermissionModule
  ],
  declarations: [
    WeightValueConfigItemsComponent,
    WeightValueConfigListingItemComponent
  ],
  exports: [
    WeightValueConfigItemsComponent,
    WeightValueConfigListingItemComponent
  ]
})
export class EpossGrnToleranceConfigUiGrnToleranceConfigListModule {}
