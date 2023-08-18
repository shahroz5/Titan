import { SharedPaymentDataAccessPaymentModule } from '@poss-web/shared/payment/data-access-payment';
import { SharedCustomerDataAccessCustomerModule } from '@poss-web/shared/customer/data-access-customer';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedCustomerUiCustomerSearchModule } from '@poss-web/shared/customer/ui-customer-search';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerSearchContainerComponent } from './customer-search-container.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedCommonDataAccessCommonModule } from '@poss-web/shared/common/data-access-common';
import { PossCashMemoDataAccessCashMemoModule } from '@poss-web/poss/cash-memo/data-access-cash-memo';
import { PossSharedProductDataAccessProductModule } from '@poss-web/poss/shared/product/data-access-product';
import { PossSharedViewTcsUiViewTcsModule } from '@poss-web/poss/shared/view-tcs/ui-view-tcs';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedCustomerUiCustomerSearchModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedCustomerDataAccessCustomerModule,
    SharedPaymentDataAccessPaymentModule,
    SharedCommonDataAccessCommonModule,
    PossCashMemoDataAccessCashMemoModule,
    PossSharedProductDataAccessProductModule,
    PossSharedViewTcsUiViewTcsModule
  ],
  declarations: [CustomerSearchContainerComponent],
  exports: [CustomerSearchContainerComponent]
})
export class SharedCustomerFeatureCustomerSearchModule {}
