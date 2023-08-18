import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { HistoryAdvancedSearchPopupComponent } from './history-advanced-search-popup/history-advanced-search-popup.component';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiFormattersModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedUtilFieldValidatorsModule
  ],
  declarations: [HistoryAdvancedSearchPopupComponent],
  entryComponents: [HistoryAdvancedSearchPopupComponent],
  exports: [HistoryAdvancedSearchPopupComponent],
  providers: []
})
export class EpossBinBinTransferUiBinBinTransferPopupModule {}
