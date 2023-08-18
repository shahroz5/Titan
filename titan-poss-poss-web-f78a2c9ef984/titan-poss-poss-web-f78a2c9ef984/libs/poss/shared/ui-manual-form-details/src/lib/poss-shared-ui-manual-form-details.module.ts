import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManualApprovalFormComponent } from './manual-approval-form/manual-approval-form.component';
import { ManualValidateFormComponent } from './manual-validate-form/manual-validate-form.component';
import { ManualValidateDetailsComponent } from './manual-validate-details/manual-validate-details.component';
import { ManualApprovalDetailsComponent } from './manual-approval-details/manual-approval-details.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedComponentsUiFileUploadModule } from '@poss-web/shared/components/ui-file-upload';
import { ManualFormDetailsComponent } from './manual-form-details/manual-form-details.component';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';
import { SharedPermissionDataAccessPermissionModule } from '@poss-web/shared/permission/data-access-permission';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedUtilFieldValidatorsModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiFormattersModule,
    SharedComponentsUiFileUploadModule,
    SharedPermissionUiPermissionModule,
    SharedPermissionDataAccessPermissionModule
  ],
  declarations: [
    ManualApprovalFormComponent,
    ManualValidateFormComponent,
    ManualValidateDetailsComponent,
    ManualApprovalDetailsComponent,
    ManualFormDetailsComponent
  ],
  exports: [
    ManualApprovalFormComponent,
    ManualValidateFormComponent,
    ManualValidateDetailsComponent,
    ManualApprovalDetailsComponent,
    ManualFormDetailsComponent
  ],
  entryComponents: []
})
export class PossSharedUiManualFormDetailsModule {}
