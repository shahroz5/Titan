import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FocItemMappingPopupComponent } from './foc-item-mapping-popup/foc-item-mapping-popup.component';
import { ItemCodeSearchPipe } from './item-code-search.pipe';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiFormattersModule
  ],
  declarations: [FocItemMappingPopupComponent, ItemCodeSearchPipe],
  exports: [FocItemMappingPopupComponent],
  entryComponents: [FocItemMappingPopupComponent]
})
export class EpossFocConfigUiFocItemMappingPopupModule {}
