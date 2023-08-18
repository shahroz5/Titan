import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { StockReceiveHistoryPopupComponent } from './stock-receive-history-popup/stock-receive-history-popup.component';
import { StockReceiveReasonForDelayPopupComponent } from './reason-for-delay-popup/stock-receive-reason-for-delay-popup.component';
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
  declarations: [
    StockReceiveHistoryPopupComponent,
    StockReceiveReasonForDelayPopupComponent
  ],
  entryComponents: [
    StockReceiveHistoryPopupComponent,
    StockReceiveReasonForDelayPopupComponent
  ],
  exports: [StockReceiveHistoryPopupComponent],
  providers: []
})
export class EpossStockReceiveUiStockReceivePopupModule {}
