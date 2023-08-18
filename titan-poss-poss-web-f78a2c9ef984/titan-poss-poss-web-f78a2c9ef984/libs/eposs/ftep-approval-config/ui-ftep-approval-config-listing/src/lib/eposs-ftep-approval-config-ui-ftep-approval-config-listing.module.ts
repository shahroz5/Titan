import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FtepApprovalConfigListItemsComponent } from './ftep-approval-config-list-items/ftep-approval-config-list-items.component';
import { FtepApprovalConfigListItemComponent } from './ftep-approval-config-list-item/ftep-approval-config-list-item.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';

import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
import { FtepApprovalConfigSearchComponent } from './ftep-approval-config-search/ftep-approval-config-search.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiToggleButtonModule
  ],
  declarations: [
    FtepApprovalConfigListItemsComponent,
    FtepApprovalConfigListItemComponent,
    FtepApprovalConfigSearchComponent
  ],
  exports: [
    FtepApprovalConfigListItemsComponent,
    FtepApprovalConfigListItemComponent,
    FtepApprovalConfigSearchComponent
  ]
})
export class EpossFtepApprovalConfigUiFtepApprovalConfigListingModule {}
