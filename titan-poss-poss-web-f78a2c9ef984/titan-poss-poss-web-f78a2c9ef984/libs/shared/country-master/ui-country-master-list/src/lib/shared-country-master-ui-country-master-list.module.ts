import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountryItemsComponent } from './country-items/country-items.component';
import { CountryListingItemsComponent } from './country-listing-items/country-listing-items.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiFormattersModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiToggleButtonModule
  ],
  declarations: [CountryItemsComponent, CountryListingItemsComponent],
  exports: [CountryItemsComponent, CountryListingItemsComponent]
})
export class SharedCountryMasterUiCountryMasterListModule {}
