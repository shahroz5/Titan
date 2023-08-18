import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { EpossCnApprovalsDataAccessCnApprovalsModule } from '@poss-web/eposs/cn-approvals/data-access-cn-approvals';
import { EpossCnApprovalsUiCnApprovalsModule } from '@poss-web/eposs/cn-approvals/ui-cn-approvals';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { CnApprovalListComponent } from './cn-approval-list/cn-approval-list.component';
import { SharedLocationSettingsDataAccessLocationSettingsModule } from '@poss-web/shared/location-settings/data-access-location-settings';
const routes: Routes = [
  {
    path: '',
    component: CnApprovalListComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    EpossCnApprovalsDataAccessCnApprovalsModule,
    SharedComponentsUiFormFieldControlsModule,
    EpossCnApprovalsUiCnApprovalsModule,
    SharedComponentsUiLoaderModule,
    SharedUtilFieldValidatorsModule,
    RouterModule.forChild(routes),
    SharedLocationSettingsDataAccessLocationSettingsModule
  ],
  declarations: [CnApprovalListComponent]
})
export class EpossCnApprovalsFeatureCnApprovalsModule {}
