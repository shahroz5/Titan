import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';
import { GrfStatusDetailsComponent } from './grf-status-details/grf-status-details.component';
import { SharedManualCmRequestUiDiscountViewModule } from '@poss-web/shared/manual-cm-request/ui-discount-view';

import { PossGrfRequestStatusDataAccessGrfRequestModule } from '@poss-web/poss/grf-request-status/data-access-grf-request';
import { SharedPaymentDataAccessPaymentModule } from '@poss-web/shared/payment/data-access-payment';
import { SharedCustomerDataAccessCustomerModule } from '@poss-web/shared/customer/data-access-customer';
import { PossGrfRequestStatusUiSummaryViewModule } from '@poss-web/poss/grf-request-status/ui-summary-view';
import { PossCashMemoDataAccessCashMemoModule } from '@poss-web/poss/cash-memo/data-access-cash-memo';
import { PossSharedFeatureSummaryBarModule } from '@poss-web/poss/shared/feature-summary-bar';
import { SharedCommonDataAccessCommonModule } from '@poss-web/shared/common/data-access-common';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedManualCmRequestUiCustomerViewModule } from '@poss-web/shared/manual-cm-request/ui-customer-view';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedOrderConfirmationDataAccessOrderConfirmationModule } from '@poss-web/shared/order-confirmation/data-access-order-confirmation';
import { PossGrfRequestStatusUiHeaderViewModule } from '@poss-web/poss/grf-request-status/ui-header-view';
@NgModule({
  imports: [CommonModule,
    // RouterModule.forChild([{ path: '', component:GrfStatusDetailsComponent}]),
    PossGrfRequestStatusDataAccessGrfRequestModule,
    SharedPaymentDataAccessPaymentModule,
    SharedCustomerDataAccessCustomerModule,
    PossGrfRequestStatusUiSummaryViewModule,
    PossCashMemoDataAccessCashMemoModule,
    PossSharedFeatureSummaryBarModule,
    SharedCommonDataAccessCommonModule,
    SharedComponentsUiLoaderModule,
    CommonCustomMaterialModule,
    SharedManualCmRequestUiCustomerViewModule,
    SharedComponentsUiFormattersModule,
    SharedOrderConfirmationDataAccessOrderConfirmationModule,
    PossGrfRequestStatusUiHeaderViewModule
  ],
  declarations: [GrfStatusDetailsComponent],
  exports: [GrfStatusDetailsComponent]
})
export class PossGrfRequestStatusFeatureGrfStatusDetailsModule {}
