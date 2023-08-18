import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PriceDetailsComponent } from './price-details.component';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,

    SharedComponentsUiFormattersModule,
    SharedComponentsUiLoaderModule
  ],
  declarations: [PriceDetailsComponent],
  exports: [PriceDetailsComponent]
})
export class SharedItemUiPriceDetailsModule {}
