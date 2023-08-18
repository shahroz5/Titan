import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCategoryMappingComponent } from './product-category-mapping/product-category-mapping.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { CutPiecePopupComponent } from './cut-piece-popup/cut-piece-popup.component';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiAgGridModule,
    SharedComponentsUiFormFieldControlsModule
  ],
  declarations: [ProductCategoryMappingComponent, CutPiecePopupComponent],
  exports: [CutPiecePopupComponent, ProductCategoryMappingComponent]
})
export class EpossCutPieceConfigUiCutPieceConfigDetailsModule {}
