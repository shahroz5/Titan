import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaxClassItemsComponent } from './tax-class-items/tax-class-items.component';
import { TaxClassListingItemComponent } from './tax-class-listing-item/tax-class-listing-item.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiDynamicFormModule } from '@poss-web/shared/components/ui-dynamic-form';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
import { TaxClassSearchComponent } from './tax-class-search/tax-class-search.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiDynamicFormModule,
    SharedComponentsUiToggleButtonModule,
    SharedComponentsUiLoaderModule
  ],
  declarations: [
    TaxClassItemsComponent,
    TaxClassListingItemComponent,
    TaxClassSearchComponent
  ],
  exports: [
    TaxClassItemsComponent,
    TaxClassListingItemComponent,
    TaxClassSearchComponent
  ]
})
export class SharedTaxClassUiTaxClassListModule {}
