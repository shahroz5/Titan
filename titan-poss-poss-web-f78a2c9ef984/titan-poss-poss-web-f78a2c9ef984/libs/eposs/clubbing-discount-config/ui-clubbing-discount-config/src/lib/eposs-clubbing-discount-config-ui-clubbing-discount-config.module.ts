import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClubbingDiscountGridComponent } from './clubbing-discount-grid/clubbing-discount-grid.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiFormattersModule,
    SharedComponentsUiAgGridModule
  ],
  declarations: [ClubbingDiscountGridComponent],
  exports: [ClubbingDiscountGridComponent]
})
export class EpossClubbingDiscountConfigUiClubbingDiscountConfigModule {}
