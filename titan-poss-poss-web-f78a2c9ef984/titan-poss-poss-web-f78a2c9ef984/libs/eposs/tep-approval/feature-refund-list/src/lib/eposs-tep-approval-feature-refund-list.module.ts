import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RefundListComponent } from './refund-list/refund-list.component';
import { RouterModule, Routes } from '@angular/router';
import { EpossTepApprovalDataAccessTepApprovalModule } from '@poss-web/eposs/tep-approval/data-access-tep-approval';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { EpossTepApprovalUiRefundListGridModule } from '@poss-web/eposs/tep-approval/ui-refund-list-grid';
import { ChequeDetailsPopUpComponent } from './cheque-details-pop-up/cheque-details-pop-up.component';
import { UtrDetailsPopUpComponent } from './utr-details-pop-up/utr-details-pop-up.component';
import { SharedLocationSettingsDataAccessLocationSettingsModule } from '@poss-web/shared/location-settings/data-access-location-settings';
import { SharedFileUploadDataAccessFileUploadModule } from '@poss-web/shared/file-upload/data-access-file-upload';
import { SharedFileUploadUiFileDownloadPopupModule } from '@poss-web/shared/file-upload/ui-file-download-popup';
const routes: Routes = [
  {
    path: '',
    component: RefundListComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    EpossTepApprovalDataAccessTepApprovalModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiLoaderModule,
    SharedUtilFieldValidatorsModule,
    EpossTepApprovalUiRefundListGridModule,
    RouterModule.forChild(routes),
    SharedLocationSettingsDataAccessLocationSettingsModule,
    SharedFileUploadDataAccessFileUploadModule,
    SharedFileUploadUiFileDownloadPopupModule
  ],
  declarations: [
    RefundListComponent,
    ChequeDetailsPopUpComponent,
    UtrDetailsPopUpComponent
  ]
})
export class EpossTepApprovalFeatureRefundListModule {}
