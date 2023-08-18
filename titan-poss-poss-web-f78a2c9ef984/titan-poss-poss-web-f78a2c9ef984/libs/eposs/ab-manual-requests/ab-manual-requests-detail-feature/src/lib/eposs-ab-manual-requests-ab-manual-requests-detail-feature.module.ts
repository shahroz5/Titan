import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbManualRequestDetailsComponent } from './ab-manual-request-details/ab-manual-request-details.component';
import { SharedManualCmRequestUiCmHeaderViewModule } from '@poss-web/shared/manual-cm-request/ui-cm-header-view';
import { SharedManualCmRequestUiDiscountViewModule } from '@poss-web/shared/manual-cm-request/ui-discount-view';
import { SharedManualCmRequestUiCustomerViewModule } from '@poss-web/shared/manual-cm-request/ui-customer-view';
import { SharedManualCmRequestUiSummaryViewModule } from '@poss-web/shared/manual-cm-request/ui-summary-view';
import { SharedCommonDataAccessCommonModule } from '@poss-web/shared/common/data-access-common';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiProductViewModule } from '@poss-web/shared/components/ui-product-view';
import { EpossAbManualRequestsUiAbManualRequestsModule } from '@poss-web/eposs/ab-manual-requests/ui-ab-manual-requests';
import { EpossAbManualRequestsDataAccessAbManualRequestsModule } from '@poss-web/eposs/ab-manual-requests/data-access-ab-manual-requests';
import { PossSharedProductDataAccessProductModule } from '@poss-web/poss/shared/product/data-access-product';

@NgModule({
  imports: [
    CommonModule,
    EpossAbManualRequestsUiAbManualRequestsModule,
    SharedManualCmRequestUiCmHeaderViewModule,
    SharedComponentsUiProductViewModule,
    SharedManualCmRequestUiDiscountViewModule,
    SharedManualCmRequestUiCustomerViewModule,
    EpossAbManualRequestsDataAccessAbManualRequestsModule,
    SharedManualCmRequestUiSummaryViewModule,
    SharedCommonDataAccessCommonModule,
    SharedComponentsUiLoaderModule,
    CommonCustomMaterialModule,
    PossSharedProductDataAccessProductModule
  ],
  declarations: [AbManualRequestDetailsComponent],
  exports: [AbManualRequestDetailsComponent]
})
export class EpossAbManualRequestsAbManualRequestsDetailFeatureModule {}
