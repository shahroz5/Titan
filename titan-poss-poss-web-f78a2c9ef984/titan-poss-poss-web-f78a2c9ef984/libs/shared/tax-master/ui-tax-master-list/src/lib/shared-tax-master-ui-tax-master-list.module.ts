import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaxMasterItemsComponent } from './tax-master-items/tax-master-items.component';
import { TaxMasterListingItemComponent } from './tax-master-listing-item/tax-master-listing-item.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiDynamicFormModule } from '@poss-web/shared/components/ui-dynamic-form';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
import { TaxMasterSearchComponent } from './tax-master-search/tax-master-search.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiDynamicFormModule,
    SharedComponentsUiToggleButtonModule,
    SharedComponentsUiLoaderModule
  ],
  declarations: [
    TaxMasterItemsComponent,
    TaxMasterListingItemComponent,
    TaxMasterSearchComponent
  ],
  exports: [
    TaxMasterItemsComponent,
    TaxMasterListingItemComponent,
    TaxMasterSearchComponent
  ]
})
export class SharedTaxMasterUiTaxMasterListModule {}
