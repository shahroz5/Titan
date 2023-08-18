import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiDynamicFormModule } from '@poss-web/shared/components/ui-dynamic-form';

import { StateTaxConfigItemsComponent } from './state-tax-config-items/state-tax-config-items.component';
import { StateTaxConfigListingItemComponent } from './state-tax-config-listing-item/state-tax-config-listing-item.component';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
import { StateTaxConfigSearchComponent } from './state-tax-config-search/state-tax-config-search.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiDynamicFormModule,
    SharedComponentsUiToggleButtonModule,
    SharedComponentsUiLoaderModule
  ],
  declarations: [
    StateTaxConfigItemsComponent,
    StateTaxConfigListingItemComponent,
    StateTaxConfigSearchComponent
  ],
  exports: [
    StateTaxConfigItemsComponent,
    StateTaxConfigListingItemComponent,
    StateTaxConfigSearchComponent
  ]
})
export class EpossStateTaxConfigUiStateTaxConfigListModule {}
