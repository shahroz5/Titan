import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { GvStatusUpdateComponent } from './gv-status-update/gv-status-update.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiFileuploadConfirmationPopupModule } from '@poss-web/shared/components/ui-fileupload-confirmation-popup';
import { EpossGvStatusUpdateDataAccessGvStatusModule } from '@poss-web/eposs/gv-status-update/data-access-gv-status-update';
import { EpossGvStatusUpdateUiGvStatusUpdateModule } from '@poss-web/eposs/gv-status-update/ui-gv-status-update';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { SharedFileUploadDataAccessFileUploadModule } from '@poss-web/shared/file-upload/data-access-file-upload';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
const routes: Routes = [
  {
    path: '',
    component: GvStatusUpdateComponent
  }
];

@NgModule({
  imports: [
    SharedComponentsUiLoaderModule,
    SharedComponentsUiFormFieldControlsModule,
    CommonCustomMaterialModule,
    CommonModule,
    RouterModule.forChild(routes),
    EpossGvStatusUpdateDataAccessGvStatusModule,
    SharedComponentsUiFileuploadConfirmationPopupModule,
    EpossGvStatusUpdateUiGvStatusUpdateModule,
    SharedUtilFieldValidatorsModule,
    SharedFileUploadDataAccessFileUploadModule,
    SharedComponentsUiFormattersModule
  ],
  declarations: [GvStatusUpdateComponent]
})
export class EpossGvStatusUpdateFeatureGvStatusUpdateModule {}
