import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SummaryBarServiceAbstraction } from '@poss-web/shared/models';
import { SummaryBarService } from './summary-bar.service';
import { SummaryBarComponent } from './summary-bar.component';
import { GiftCardSaleSummaryBarComponent } from './summary-bar-gc/summary-bar-gc.component';
import { SharedCommonDataAccessCommonModule } from '@poss-web/shared/common/data-access-common';
import { SharedPaymentDataAccessPaymentModule } from '@poss-web/shared/payment/data-access-payment';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { SharedLocationSettingsDataAccessLocationSettingsModule } from '@poss-web/shared/location-settings/data-access-location-settings';

import { SummaryBarGepComponent } from './summary-bar-gep/summary-bar-gep.component';
import { SummaryBarManualBillComponent } from './summary-bar-manual-bill/summary-bar-manual-bill.component';
import { GrfSummaryBarComponent } from './summary-bar-grf/summary-bar-grf.component';
import { SummaryBarFocComponent } from './summary-bar-foc/summary-bar-foc.component';

import { CtAcceptAdvanceSummaryBarComponent } from './summary-bar-accept-advance/summary-bar-accept-advance.component';

import { SummaryBarBcComponent } from './summary-bar-bc/summary-bar-bc.component';
import { SummaryBarAbComponent } from './summary-bar-ab/summary-bar-ab.component';
import { SummaryBarWalkInsComponent } from './summary-bar-walk-ins/summary-bar-walk-ins.component';
import { SummaryBarGrnComponent } from './summary-bar-grn/summary-bar-grn.component';

import { SendForApprovalComponent } from './summary-bar-grn/send-for-approval/send-for-approval.component';
import { SummaryBarCnComponent } from './summary-bar-cn/summary-bar-cn.component';
import { SummaryBarTepComponent } from './summary-bar-tep/summary-bar-tep.component';
import { SummaryBarCutPieceTepComponent } from './summary-bar-cut-piece-tep/summary-bar-cut-piece-tep.component';
import { SummaryBarMergeGrfComponent } from './summary-bar-grf/summary-bar-merge-grf/summary-bar-merge-grf.component';
import { SummaryBarTepViewComponent } from './summary-bar-tep-view/summary-bar-tep-view.component';
import { SummaryBarCmHistoryComponent } from './summary-bar-cm-history/summary-bar-cm-history.component';
import { SummaryBarAbNewComponent } from './summary-bar-ab-new/summary-bar-ab-new.component';
import { SummaryBarAbManualBillComponent } from './summary-bar-ab-manual-bill/summary-bar-ab-manual-bill.component';
import { SummaryBarBcHistoryComponent } from './summary-bar-bc-history/summary-bar-bc-history.component';
import { SummaryBarCoComponent } from './summary-bar-co/summary-bar-co.component';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';
import { SharedPermissionDataAccessPermissionModule } from '@poss-web/shared/permission/data-access-permission';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiFormattersModule,
    SharedCommonDataAccessCommonModule,
    SharedPaymentDataAccessPaymentModule,
    SharedUtilFieldValidatorsModule,
    SharedComponentsUiFormattersModule,
    SharedLocationSettingsDataAccessLocationSettingsModule,
    SharedPermissionUiPermissionModule,
    SharedPermissionDataAccessPermissionModule
  ],
  providers: [
    {
      provide: SummaryBarServiceAbstraction,
      useClass: SummaryBarService
    }
  ],
  declarations: [
    SummaryBarComponent,
    GiftCardSaleSummaryBarComponent,
    SummaryBarGepComponent,
    SummaryBarManualBillComponent,
    GrfSummaryBarComponent,
    SummaryBarFocComponent,
    CtAcceptAdvanceSummaryBarComponent,
    SummaryBarBcComponent,
    SummaryBarAbComponent,
    SummaryBarWalkInsComponent,
    SummaryBarGrnComponent,
    SendForApprovalComponent,
    SummaryBarTepComponent,
    SummaryBarCutPieceTepComponent,
    SummaryBarMergeGrfComponent,
    SummaryBarCnComponent,
    SummaryBarTepViewComponent,
    SummaryBarCmHistoryComponent,
    SummaryBarAbNewComponent,
    SummaryBarAbManualBillComponent,
    SummaryBarBcHistoryComponent,
    SummaryBarCoComponent
  ],
  entryComponents: [
    SummaryBarComponent,
    GiftCardSaleSummaryBarComponent,
    SummaryBarGepComponent,
    SummaryBarManualBillComponent,
    GrfSummaryBarComponent,
    SummaryBarAbComponent,
    SummaryBarAbNewComponent,
    SummaryBarFocComponent,
    CtAcceptAdvanceSummaryBarComponent,
    SummaryBarWalkInsComponent,
    SummaryBarTepComponent,
    SummaryBarTepViewComponent,
    SummaryBarCnComponent,
    SummaryBarBcHistoryComponent,
    SummaryBarCoComponent
  ]
})
export class PossSharedFeatureSummaryBarModule {}
