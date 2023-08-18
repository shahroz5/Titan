import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { EpossConversionApprovalsDataAccessConversionApprovalsModule } from '@poss-web/eposs/conversion-approvals/data-access-conversion-approvals';
import { EpossConversionApprovalsUiConversionApprovalsFiltersModule } from '@poss-web/eposs/conversion-approvals/ui-conversion-approvals-filters';
import { EpossConversionApprovalsUiConversionRequestsListModule } from '@poss-web/eposs/conversion-approvals/ui-conversion-requests-list';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiSelectionDialogModule } from '@poss-web/shared/components/ui-selection-dialog';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';
import { ConversionApprovalsComponent } from './conversion-approvals/conversion-approvals.component';

const routes: Routes = [
  {
    path: '',
    component: ConversionApprovalsComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    RouterModule.forChild(routes),
    EpossConversionApprovalsDataAccessConversionApprovalsModule,
    SharedPermissionUiPermissionModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiSelectionDialogModule,
    EpossConversionApprovalsUiConversionRequestsListModule,
    EpossConversionApprovalsUiConversionApprovalsFiltersModule
  ],
  declarations: [ConversionApprovalsComponent]
})
export class EpossConversionApprovalsFeatureConversionApprovalsModule {}
