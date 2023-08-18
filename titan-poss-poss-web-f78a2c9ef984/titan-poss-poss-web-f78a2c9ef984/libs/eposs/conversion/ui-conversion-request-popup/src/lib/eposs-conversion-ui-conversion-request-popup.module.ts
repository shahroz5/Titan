import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiFocusableListModule } from '@poss-web/shared/components/ui-focusable-list';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedComponentsUiSelectionDialogModule } from '@poss-web/shared/components/ui-selection-dialog';
import { SharedComponentsUiThumbnailModule } from '@poss-web/shared/components/ui-thumbnail';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { ConversionHistoryPopupComponent } from './conversion-history-popup/conversion-history-popup.component';
import { RequestItemComponent } from './request-item/request-item.component';
import { RequestPopupComponent } from './request-popup/request-popup.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiThumbnailModule,
    SharedComponentsUiSelectionDialogModule,
    SharedComponentsUiFormattersModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiFocusableListModule,
    SharedUtilFieldValidatorsModule
  ],
  declarations: [
    RequestItemComponent,
    RequestPopupComponent,
    ConversionHistoryPopupComponent
  ],
  exports: [
    RequestItemComponent,
    RequestPopupComponent,
    ConversionHistoryPopupComponent
  ],
  entryComponents: [RequestPopupComponent, ConversionHistoryPopupComponent]
})
export class EpossConversionUiConversionRequestPopupModule {}
