import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmRequestDetailsComponent } from './cm-request-details/cm-request-details.component';
import { SharedManualCmRequestUiCmHeaderViewModule } from '@poss-web/shared/manual-cm-request/ui-cm-header-view';
import { SharedManualCmRequestUiDiscountViewModule } from '@poss-web/shared/manual-cm-request/ui-discount-view';

import { SharedManualCmRequestDataAccessCmRequestModule } from '@poss-web/shared/manual-cm-request/data-access-cm-request';
import { SharedPaymentDataAccessPaymentModule } from '@poss-web/shared/payment/data-access-payment';
import { SharedCustomerDataAccessCustomerModule } from '@poss-web/shared/customer/data-access-customer';
import { SharedManualCmRequestUiSummaryViewModule } from '@poss-web/shared/manual-cm-request/ui-summary-view';
import { PossCashMemoDataAccessCashMemoModule } from '@poss-web/poss/cash-memo/data-access-cash-memo';
import { PossSharedFeatureSummaryBarModule } from '@poss-web/poss/shared/feature-summary-bar';
import { SharedCommonDataAccessCommonModule } from '@poss-web/shared/common/data-access-common';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiProductViewModule } from '@poss-web/shared/components/ui-product-view';
import { SharedManualCmRequestUiCustomerViewModule } from '@poss-web/shared/manual-cm-request/ui-customer-view';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedOrderConfirmationDataAccessOrderConfirmationModule } from '@poss-web/shared/order-confirmation/data-access-order-confirmation';
import { SharedCustomerFeatureCustomerCreateModule } from '@poss-web/shared/customer/feature-customer-create';

@NgModule({
  imports: [
    CommonModule,
    SharedManualCmRequestUiCmHeaderViewModule,
    SharedComponentsUiProductViewModule,
    SharedManualCmRequestUiDiscountViewModule,
    SharedManualCmRequestDataAccessCmRequestModule,
    SharedPaymentDataAccessPaymentModule,
    SharedCustomerDataAccessCustomerModule,
    SharedManualCmRequestUiSummaryViewModule,
    PossCashMemoDataAccessCashMemoModule,
    PossSharedFeatureSummaryBarModule,
    SharedCommonDataAccessCommonModule,
    SharedComponentsUiLoaderModule,
    CommonCustomMaterialModule,
    SharedManualCmRequestUiCustomerViewModule,
    SharedComponentsUiFormattersModule,
    SharedOrderConfirmationDataAccessOrderConfirmationModule,
    SharedCustomerFeatureCustomerCreateModule
  ],
  declarations: [CmRequestDetailsComponent],
  exports: [CmRequestDetailsComponent]
})
export class SharedManualCmRequestFeatureCmRequestDetailsModule {}
