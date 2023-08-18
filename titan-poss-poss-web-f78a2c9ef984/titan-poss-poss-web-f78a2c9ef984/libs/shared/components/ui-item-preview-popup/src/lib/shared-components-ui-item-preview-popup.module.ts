import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemPreviewPopupComponent } from './item-preview-popup/item-preview-popup.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';

@NgModule({
  imports: [CommonModule, CommonCustomMaterialModule],
  declarations: [ItemPreviewPopupComponent],
  exports: [ItemPreviewPopupComponent],
  entryComponents: [ItemPreviewPopupComponent]
})
export class SharedComponentsUiItemPreviewPopupModule {}
