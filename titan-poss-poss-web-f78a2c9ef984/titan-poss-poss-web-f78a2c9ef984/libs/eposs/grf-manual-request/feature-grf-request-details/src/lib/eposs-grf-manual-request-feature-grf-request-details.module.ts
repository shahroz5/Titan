import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GrfRequestDetailsComponent } from './grf-request-details/grf-request-details.component';
import { EpossGrfManualRequestUiCmHeaderViewModule } from '@poss-web/eposs/grf-manual-request/ui-cm-header-view';
import { SharedManualCmRequestUiDiscountViewModule } from '@poss-web/shared/manual-cm-request/ui-discount-view';

import { EpossGrfManualRequestDataAccessGrfRequestModule } from '@poss-web/eposs/grf-manual-request/data-access-grf-request';
import { SharedPaymentDataAccessPaymentModule } from '@poss-web/shared/payment/data-access-payment';
import { SharedCustomerDataAccessCustomerModule } from '@poss-web/shared/customer/data-access-customer';
import { EpossGrfManualRequestUiSummaryViewModule } from '@poss-web/eposs/grf-manual-request/ui-summary-view';
import { PossCashMemoDataAccessCashMemoModule } from '@poss-web/poss/cash-memo/data-access-cash-memo';
import { PossSharedFeatureSummaryBarModule } from '@poss-web/poss/shared/feature-summary-bar';
import { SharedCommonDataAccessCommonModule } from '@poss-web/shared/common/data-access-common';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { EpossGrfManualRequestUiCustomerViewModule } from '@poss-web/eposs/grf-manual-request/ui-customer-view';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedOrderConfirmationDataAccessOrderConfirmationModule } from '@poss-web/shared/order-confirmation/data-access-order-confirmation';
@NgModule({
  imports: [CommonModule,
    EpossGrfManualRequestUiCmHeaderViewModule,
    SharedManualCmRequestUiDiscountViewModule,
    EpossGrfManualRequestDataAccessGrfRequestModule,
    SharedPaymentDataAccessPaymentModule,
    SharedCustomerDataAccessCustomerModule,
    EpossGrfManualRequestUiSummaryViewModule,
    PossCashMemoDataAccessCashMemoModule,
    PossSharedFeatureSummaryBarModule,
    SharedCommonDataAccessCommonModule,
    SharedComponentsUiLoaderModule,
    CommonCustomMaterialModule,
    EpossGrfManualRequestUiCustomerViewModule,
    SharedComponentsUiFormattersModule,
    SharedOrderConfirmationDataAccessOrderConfirmationModule
  ],
  declarations: [GrfRequestDetailsComponent],
  exports: [GrfRequestDetailsComponent]
})
export class EpossGrfManualRequestFeatureGrfRequestDetailsModule {}
