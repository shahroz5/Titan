import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyItemsComponent } from './currency-items/currency-items.component';
import { CurrencyListingItemsComponent } from './currency-listing-items/currency-listing-items.component';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiFormattersModule,
    SharedComponentsUiToggleButtonModule
  ],
  declarations: [CurrencyItemsComponent, CurrencyListingItemsComponent],
  exports: [CurrencyListingItemsComponent, CurrencyItemsComponent]
})
export class SharedCurrencyMasterUiCurrencyMasterListModule {}
