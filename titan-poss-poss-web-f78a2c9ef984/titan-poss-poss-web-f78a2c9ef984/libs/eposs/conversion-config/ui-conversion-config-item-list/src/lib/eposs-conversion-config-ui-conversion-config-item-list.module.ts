import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConversionConfigItemsComponent } from './conversion-config-items/conversion-config-items.component';
import { ConversionConfigItemComponent } from './conversion-config-item/conversion-config-item.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiToggleButtonModule
  ],
  declarations: [ConversionConfigItemsComponent, ConversionConfigItemComponent],
  exports: [ConversionConfigItemsComponent, ConversionConfigItemComponent]
})
export class EpossConversionConfigUiConversionConfigItemListModule {}
