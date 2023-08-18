import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { MaterialPriceListItemsComponent } from './material-price-list-items/material-price-list-items.component';
import { MaterialPriceListItemComponent } from './material-price-list-item/material-price-list-item.component';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
@NgModule({
  imports: [CommonModule, CommonCustomMaterialModule,
    SharedComponentsUiFormattersModule],
  declarations: [
    MaterialPriceListItemsComponent,
    MaterialPriceListItemComponent,
  ],
  exports: [MaterialPriceListItemsComponent, MaterialPriceListItemComponent]
})
export class SharedMarketMaterialPriceUiMarketMaterialPriceListModule {}
