import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { EpossTepApprovalDataAccessTepApprovalModule } from '@poss-web/eposs/tep-approval/data-access-tep-approval';
import { EpossTepApprovalUiTepApprovalModule } from '@poss-web/eposs/tep-approval/ui-tep-approval';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { TepApprovalListComponent } from './tep-approval-list/tep-approval-list.component';
const routes: Routes = [
  {
    path: '',
    component: TepApprovalListComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    EpossTepApprovalDataAccessTepApprovalModule,
    SharedComponentsUiFormFieldControlsModule,
    EpossTepApprovalUiTepApprovalModule,
    SharedComponentsUiLoaderModule,
    SharedUtilFieldValidatorsModule,
    
    RouterModule.forChild(routes)
  ],
  declarations: [TepApprovalListComponent]
})
export class EpossTepApprovalFeatureRegularTepApprovalModule {}
