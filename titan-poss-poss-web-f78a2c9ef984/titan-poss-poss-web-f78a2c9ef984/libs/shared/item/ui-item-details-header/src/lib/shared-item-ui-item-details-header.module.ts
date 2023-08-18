import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemDetailsHeaderComponent } from './item-details-header.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiFormattersModule
  ],
  declarations: [ItemDetailsHeaderComponent],
  exports: [ItemDetailsHeaderComponent]
})
export class SharedItemUiItemDetailsHeaderModule {}
