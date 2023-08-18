import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GrnRequestListComponent } from './grn-request-list/grn-request-list.component';
import { RouterModule, Routes } from '@angular/router';
import { EpossGrnRequestApprovalsDataAccessGrnRequestApprovalsModule } from '@poss-web/eposs/grn-request-approvals/data-access-grn-request-approvals';
import { EpossGrnRequestApprovalsUiGrnRequestApprovalsModule } from '@poss-web/eposs/grn-request-approvals/ui-grn-request-approvals';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { GrnFilterPopupComponent } from './grn-filter-popup/grn-filter-popup.component';
import { SharedLocationSettingsDataAccessLocationSettingsModule } from '@poss-web/shared/location-settings/data-access-location-settings';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedFileUploadUiFileDownloadPopupModule } from '@poss-web/shared/file-upload/ui-file-download-popup';
import { SharedFileUploadDataAccessFileUploadModule } from '@poss-web/shared/file-upload/data-access-file-upload';
const routes: Routes = [
  {
    path: '',
    component: GrnRequestListComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    EpossGrnRequestApprovalsDataAccessGrnRequestApprovalsModule,
    SharedComponentsUiFormFieldControlsModule,
    EpossGrnRequestApprovalsUiGrnRequestApprovalsModule,
    SharedComponentsUiLoaderModule,
    RouterModule.forChild(routes),
    SharedLocationSettingsDataAccessLocationSettingsModule,
    SharedFileUploadDataAccessFileUploadModule,
    SharedFileUploadUiFileDownloadPopupModule
  ],
  declarations: [GrnRequestListComponent, GrnFilterPopupComponent]
})
export class EpossGrnRequestApprovalsFeatureGrnRequestApprovalsModule {}
