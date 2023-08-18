import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FocOutOfStockComponent } from './foc-out-of-stock/foc-out-of-stock.component';
import { FocNotAddedPopupComponent } from './foc-not-added-popup/foc-not-added-popup.component';
import { AddFocAlertPopupComponent } from './add-foc-alert-popup/add-foc-alert-popup.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { AbFocPopupComponent } from './ab-foc-popup/ab-foc-popup.component';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { FocSearchPipe } from './foc-search.pipe';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiFormFieldControlsModule
  ],
  declarations: [
    FocOutOfStockComponent,
    FocNotAddedPopupComponent,
    AddFocAlertPopupComponent,
    AbFocPopupComponent,
    FocSearchPipe
  ],
  exports: [
    FocOutOfStockComponent,
    FocNotAddedPopupComponent,
    AddFocAlertPopupComponent,
    AbFocPopupComponent
  ],
  entryComponents: [
    FocOutOfStockComponent,
    FocNotAddedPopupComponent,
    AddFocAlertPopupComponent,
    AbFocPopupComponent
  ]
})
export class PossFocUiFocPopupsModule {}
