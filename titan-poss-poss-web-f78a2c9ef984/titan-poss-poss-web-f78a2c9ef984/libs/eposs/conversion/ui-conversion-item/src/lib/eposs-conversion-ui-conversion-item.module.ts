import { NgModule } from '@angular/core';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import {
  SelectionDialogService,
  SharedComponentsUiSelectionDialogModule
} from '@poss-web/shared/components/ui-selection-dialog';
import { SharedComponentsUiThumbnailModule } from '@poss-web/shared/components/ui-thumbnail';
import { SharedItemUiItemDetailsModule } from '@poss-web/shared/item/ui-item-details';
import { ConversionItemComponent } from './conversion-item/conversion-item.component';
import { ConversionHistoryItemComponent } from './conversion-history-item/conversion-history-item.component';

@NgModule({
  imports: [
    CommonCustomMaterialModule,
    SharedComponentsUiThumbnailModule,
    SharedComponentsUiSelectionDialogModule,
    SharedComponentsUiFormattersModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedItemUiItemDetailsModule
  ],
  declarations: [ConversionItemComponent, ConversionHistoryItemComponent],
  exports: [ConversionItemComponent, ConversionHistoryItemComponent],
  providers: [SelectionDialogService]
})
export class EpossConversionUiConversionItemModule {}
