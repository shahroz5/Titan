import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GrnApprovalConfigListItemsComponent } from './grn-approval-config-list-items/grn-approval-config-list-items.component';
import { GrnApprovalConfigListItemComponent } from './grn-approval-config-list-item/grn-approval-config-list-item.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';

import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
import { GrnApprovalConfigSearchComponent } from './grn-approval-config-search/grn-approval-config-search.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiToggleButtonModule,
    SharedPermissionUiPermissionModule
  ],
  declarations: [
    GrnApprovalConfigListItemsComponent,
    GrnApprovalConfigListItemComponent,
    GrnApprovalConfigSearchComponent
  ],
  exports: [
    GrnApprovalConfigListItemsComponent,
    GrnApprovalConfigListItemComponent,
    GrnApprovalConfigSearchComponent
  ]
})
export class EpossGrnApprovalConfigUiGrnApprovalConfigListingModule {}
