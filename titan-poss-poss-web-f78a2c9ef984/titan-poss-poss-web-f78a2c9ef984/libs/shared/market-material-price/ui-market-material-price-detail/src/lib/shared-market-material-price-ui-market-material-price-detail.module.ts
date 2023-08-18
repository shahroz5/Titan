import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { MaterialPriceItemComponent } from './material-price-item/material-price-item.component';
import { MaterialPriceItemsComponent } from './material-price-items/material-price-items.component';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';

@NgModule({
  declarations: [MaterialPriceItemComponent, MaterialPriceItemsComponent],
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiFormFieldControlsModule
  ],
  exports: [MaterialPriceItemComponent, MaterialPriceItemsComponent]
})
export class SharedMarketMaterialPriceUiMarketMaterialPriceDetailModule {}
