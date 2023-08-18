import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { PossAdvanceBookingDataAccessAdvanceBookingModule } from '@poss-web/poss/advance-booking/data-access-advance-booking';
import { PossCashMemoDataAccessCashMemoModule } from '@poss-web/poss/cash-memo/data-access-cash-memo';
import { PossCashMemoUiCoePopupModule } from '@poss-web/poss/cash-memo/ui-coe-popup';
import { PossFocDataAccessFocModule } from '@poss-web/poss/foc/data-access-foc';
import { PossSharedProductDataAccessProductModule } from '@poss-web/poss/shared/product/data-access-product';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiProductViewModule } from '@poss-web/shared/components/ui-product-view';
import { SharedFileUploadDataAccessFileUploadModule } from '@poss-web/shared/file-upload/data-access-file-upload';
import { SharedFileUploadUiFileMultiUploadModule } from '@poss-web/shared/file-upload/ui-file-multi-upload';
import { CashMemoHistoryDetailsComponent } from './cash-memo-history-details/cash-memo-history-details.component';

@NgModule({
  imports: [
    CommonModule,
    PossFocDataAccessFocModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiFormFieldControlsModule,
    PossCashMemoDataAccessCashMemoModule,
    SharedComponentsUiProductViewModule,
    SharedComponentsUiFormattersModule,
    PossSharedProductDataAccessProductModule,
    SharedFileUploadUiFileMultiUploadModule,
    SharedFileUploadDataAccessFileUploadModule,
    PossCashMemoUiCoePopupModule,
    PossAdvanceBookingDataAccessAdvanceBookingModule
  ],
  declarations: [CashMemoHistoryDetailsComponent],
  exports: [CashMemoHistoryDetailsComponent]
})
export class PossCashMemoFeatureCashMemoHistoryDetailsModule {}
