import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockReturnHistoryPopupComponent } from './stock-return-history-popup/stock-return-history-popup.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiFormattersModule,
    SharedComponentsUiFormFieldControlsModule
  ],
  declarations: [StockReturnHistoryPopupComponent],
  entryComponents: [StockReturnHistoryPopupComponent],
  exports: [StockReturnHistoryPopupComponent],
  providers: []
})
export class EpossStockReturnUiStockReturnHistoryPopupModule {}
