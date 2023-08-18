import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComplexityPricegroupItemsComponent } from './complexity-pricegroup-items/complexity-pricegroup-items.component';
import { ComplexityPricegroupListingItemComponent } from './complexity-pricegroup-listing-item/complexity-pricegroup-listing-item.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiFormattersModule,
    SharedComponentsUiToggleButtonModule
  ],
  declarations: [
    ComplexityPricegroupItemsComponent,
    ComplexityPricegroupListingItemComponent
  ],
  exports: [
    ComplexityPricegroupItemsComponent,
    ComplexityPricegroupListingItemComponent
  ]
})
export class SharedComplexityPricegroupMapUiComplexityPricegroupMapListModule {}
