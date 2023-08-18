import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedComponentsUiThumbnailModule } from '@poss-web/shared/components/ui-thumbnail';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemDetailsComponent } from './item-details.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiThumbnailModule,
    SharedComponentsUiFormattersModule
  ],
  declarations: [ItemDetailsComponent],
  exports: [ItemDetailsComponent]
})
export class SharedItemUiItemDetailsModule {}
