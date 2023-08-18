import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActualWeightPopupComponent } from './actual-weight-popup/actual-weight-popup.component';
import { DeleteAllRowsComponent } from './delete-all-rows/delete-all-rows.component';
import { DeleteRowComponent } from './delete-row/delete-row.component';
import { DeleteAllGcRowsComponent } from './delete-all-gc-rows/delete-all-gc-rows.component';
import { DeleteGcRowComponent } from './delete-gc-row/delete-gc-row.component';
import { DiscountDetailsComponent } from './discount-details/discount-details.component';
import { ItemDetailsComponent } from './item-details/item-details.component';
import { TooltipComponent } from './tooltip/tooltip.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { InputValidatorComponent } from './input-validator/input-validator.component';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { AgGridModule } from 'ag-grid-angular';
import { PaymentModesCellComponent } from './payment-config/payment-modes-cell';
import { EditItemComponent } from './edit-item/edit-item.component';
import { ToggleButtonCellComponent } from './toggle-button-cell/toggle-button-cell.component';

import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
import { MatToggleRender } from './toggle-button-cell/payment-host-config-toggle';
import { DatePickerComponent } from './date-picker/date-picker.component';
import { SharedComponentsUiItemPreviewPopupModule } from '@poss-web/shared/components/ui-item-preview-popup';
import { InputCellComponent } from './input-cell/input-cell.component';
import { RemarksPopupComponent } from './remarks-popup/remarks-popup.component';
import { AirpayVerifyPaymentComponent } from './airpay-verify-payment/airpay-verify-payment.component';
import { StatusComponent } from './status/status.component';

import { ProductMappingCountComponent } from './product-mapping-count/product-mapping-count.component';
import { LotNumberAndQuantityComponent } from './lot-number-and-quantity/lot-number-and-quantity.component';
import { RadioButtonCellComponent } from './radio-button-cell/radio-button-cell.componet';
import { RemarksViewComponent } from './remarks-view/remarks-view.component';
import { ManualRunJobComponent } from './manual-run-job/manual-run-job.component';
import { ValuePercentageComponent } from './value-percentage/value-percentage.component';
import { ValuePercentageToggleComponent } from './value-percentage-toggle/value-percentage-toggle.component';

import { CheckboxGridCellComponent } from './checkbox-grid-cell/checkbox-grid-cell.component';
import { CheckboxCellComponent } from './checkbox-cell/checkbox-cell.component';
import { AirpayGenerateCNButtonComponent } from './airpay-generate-cn-button/airpay-generate-cn-button.component';
import { AddUtrDetailsButtonComponent } from './add-utr-details-button/add-utr-details-button.component';
import { AddChequeDetailsButtonComponent } from './add-cheque-details-button/add-cheque-details-button.component';
import { DiscountHeaderComponent } from './discount-header/discount-header.component';
import { DiscountTotalComponent } from './discount-total/discount-total.component';
import { HyperLinkCellComponent } from './hyper-link-cell/hyper-link-cell.component';
import { MatTooltipComponent } from './mat-tooltip/mat-tooltip.component';
import { TopInfoPanelComponent } from './top-info-panel/top-info-panel.component';
import { ToolbarDocNumComponent } from './toolbar-doc-num/toolbar-doc-num';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedUtilFieldValidatorsModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiFormattersModule,
    SharedComponentsUiToggleButtonModule,
    SharedComponentsUiItemPreviewPopupModule,
    AgGridModule.withComponents([
      ActualWeightPopupComponent,
      DeleteRowComponent,
      ItemDetailsComponent,
      TooltipComponent,
      DiscountDetailsComponent,
      DeleteAllRowsComponent,
      InputValidatorComponent,
      DeleteAllGcRowsComponent,
      DeleteGcRowComponent,
      PaymentModesCellComponent,
      EditItemComponent,
      ToggleButtonCellComponent,
      MatToggleRender,
      DatePickerComponent,
      InputCellComponent,
      RemarksPopupComponent,
      AirpayVerifyPaymentComponent,
      ProductMappingCountComponent,
      LotNumberAndQuantityComponent,
      RadioButtonCellComponent,
      RemarksViewComponent,
      ManualRunJobComponent,
      ValuePercentageComponent,
      ValuePercentageToggleComponent,
      CheckboxGridCellComponent,
      CheckboxCellComponent,
      AirpayGenerateCNButtonComponent,
      AddUtrDetailsButtonComponent,
      AddChequeDetailsButtonComponent,
      DiscountHeaderComponent,
      MatTooltipComponent,
      ToolbarDocNumComponent
    ])
  ],
  declarations: [
    ActualWeightPopupComponent,
    DeleteAllRowsComponent,
    DeleteRowComponent,
    DiscountDetailsComponent,
    ItemDetailsComponent,
    TooltipComponent,
    InputValidatorComponent,
    DeleteAllGcRowsComponent,
    DeleteGcRowComponent,
    PaymentModesCellComponent,
    EditItemComponent,
    ToggleButtonCellComponent,
    MatToggleRender,
    DatePickerComponent,
    InputCellComponent,
    RemarksPopupComponent,
    AirpayVerifyPaymentComponent,
    StatusComponent,
    ProductMappingCountComponent,
    LotNumberAndQuantityComponent,
    RadioButtonCellComponent,
    RemarksViewComponent,
    ManualRunJobComponent,
    ValuePercentageComponent,
    ValuePercentageToggleComponent,
    CheckboxGridCellComponent,
    CheckboxCellComponent,
    AirpayGenerateCNButtonComponent,
    AddUtrDetailsButtonComponent,
    AddChequeDetailsButtonComponent,
    DiscountHeaderComponent,
    DiscountTotalComponent,
    HyperLinkCellComponent,
    MatTooltipComponent,
    TopInfoPanelComponent,
    ToolbarDocNumComponent
  ],
  exports: [AgGridModule, TopInfoPanelComponent]
})
export class SharedComponentsUiAgGridModule {}
