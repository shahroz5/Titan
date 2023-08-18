import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiDynamicFormModule } from '@poss-web/shared/components/ui-dynamic-form';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
import { WeightValueConfigItemsComponent } from './weight-value-config-items/weight-value-config-items.component';
import { WeightValueConfigListingItemComponent } from './weight-value-config-listing-item/weight-value-config-listing-item.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiDynamicFormModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiToggleButtonModule
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
export class EpossGrfToleranceConfigUiGrfToleranceConfigListModule {}
