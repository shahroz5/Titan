import { NgModule } from '@angular/core';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { OutOfStockPopupComponent } from './out-of-stock-popup.component';
import { HistoryAdvancedSearchPopupComponent } from './history-advanced-search-popup/history-advanced-search-popup.component';
import { CommonModule } from '@angular/common';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';

@NgModule({
  declarations: [OutOfStockPopupComponent, HistoryAdvancedSearchPopupComponent],
  imports: [
    CommonCustomMaterialModule,
    CommonModule,
    SharedComponentsUiFormattersModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedUtilFieldValidatorsModule
  ],
  exports: [OutOfStockPopupComponent, HistoryAdvancedSearchPopupComponent],
  entryComponents: [HistoryAdvancedSearchPopupComponent],
  providers: []
})
export class EpossSharedUiOutOfStockPopupModule {}
