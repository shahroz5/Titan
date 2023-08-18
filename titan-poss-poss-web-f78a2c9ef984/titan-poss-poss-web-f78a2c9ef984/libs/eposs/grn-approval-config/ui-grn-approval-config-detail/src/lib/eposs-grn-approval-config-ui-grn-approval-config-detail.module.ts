import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GrnApprovalConfigDetailItemComponent } from './grn-approval-config-detail-item/grn-approval-config-detail-item.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { ErrorPopUpComponent } from './error-pop-up/error-pop-up.component';
import { GrnApprovalConfigViewDetailItemComponent } from './grn-approval-config-view-detail-item/grn-approval-config-view-detail-item.component';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiToggleButtonModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiAgGridModule,
    SharedPermissionUiPermissionModule
  ],
  declarations: [
    GrnApprovalConfigDetailItemComponent,
    ErrorPopUpComponent,
    GrnApprovalConfigViewDetailItemComponent
  ],
  exports: [
    GrnApprovalConfigDetailItemComponent,
    ErrorPopUpComponent,
    GrnApprovalConfigViewDetailItemComponent
  ]
})
export class EpossGrnApprovalConfigUiGrnApprovalConfigDetailModule {}
