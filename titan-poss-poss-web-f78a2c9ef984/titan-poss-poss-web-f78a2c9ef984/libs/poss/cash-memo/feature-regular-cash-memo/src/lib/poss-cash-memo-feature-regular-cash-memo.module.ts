import { SharedPaymentDataAccessPaymentModule } from '@poss-web/shared/payment/data-access-payment';
import { SharedCommonDataAccessCommonModule } from '@poss-web/shared/common/data-access-common';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { PossCashMemoDataAccessCashMemoModule } from '@poss-web/poss/cash-memo/data-access-cash-memo';
import { PossCashMemoUiOrderSearchModule } from '@poss-web/poss/cash-memo/ui-order-search';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegularCashMemoComponent } from './regular-cash-memo.component';
import { PossCashMemoUiOccasionSelectionModule } from '@poss-web/poss/cash-memo/ui-occasion-selection';
import { SharedCustomerDataAccessCustomerModule } from '@poss-web/shared/customer/data-access-customer';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedOrderConfirmationDataAccessOrderConfirmationModule } from '@poss-web/shared/order-confirmation/data-access-order-confirmation';
import { PossAdvanceBookingDataAccessAdvanceBookingModule } from '@poss-web/poss/advance-booking/data-access-advance-booking';
import { PossFocDataAccessFocModule } from '@poss-web/poss/foc/data-access-foc';
import { RouterModule } from '@angular/router';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { PossSharedDiscountDataAccessDiscountModule } from '@poss-web/poss/shared/discount/data-access-discount';
import { SharedBodEodDataAccessBodEodModule } from '@poss-web/shared/bod-eod/data-access-bod-eod';
import { SharedFileUploadDataAccessFileUploadModule } from '@poss-web/shared/file-upload/data-access-file-upload';
import { SharedShortcutUiShortcutModule } from '@poss-web/shared/shortcut/ui-shortcut';
import { PossSharedViewTcsUiViewTcsModule } from '@poss-web/poss/shared/view-tcs/ui-view-tcs';
import { SharedCustomerFeatureCustomerCreateModule } from '@poss-web/shared/customer/feature-customer-create';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';
import { SharedPermissionDataAccessPermissionModule } from '@poss-web/shared/permission/data-access-permission';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    PossCashMemoUiOrderSearchModule,
    PossCashMemoUiOccasionSelectionModule,
    PossCashMemoDataAccessCashMemoModule,
    SharedCustomerDataAccessCustomerModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiFormattersModule,
    SharedPaymentDataAccessPaymentModule,
    SharedCommonDataAccessCommonModule,
    SharedOrderConfirmationDataAccessOrderConfirmationModule,
    PossAdvanceBookingDataAccessAdvanceBookingModule,
    PossFocDataAccessFocModule,
    RouterModule.forChild([{ path: '', component: RegularCashMemoComponent }]),
    SharedComponentsUiFormFieldControlsModule,
    PossSharedDiscountDataAccessDiscountModule,
    SharedBodEodDataAccessBodEodModule,
    SharedFileUploadDataAccessFileUploadModule,
    SharedShortcutUiShortcutModule,
    PossSharedViewTcsUiViewTcsModule,
    SharedCustomerFeatureCustomerCreateModule,
    SharedPermissionUiPermissionModule,
    SharedPermissionDataAccessPermissionModule
  ],
  declarations: [RegularCashMemoComponent],
  exports: [RegularCashMemoComponent],
  entryComponents: []
})
export class PossCashMemoFeatureRegularCashMemoModule {}
