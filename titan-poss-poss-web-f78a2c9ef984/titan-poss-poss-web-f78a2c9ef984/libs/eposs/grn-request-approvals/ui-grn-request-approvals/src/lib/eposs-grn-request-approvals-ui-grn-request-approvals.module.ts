import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GrnRequestListItemsComponent } from './grn-request-list-items/grn-request-list-items.component';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';

@NgModule({
  imports: [
    CommonModule,
    SharedComponentsUiAgGridModule,
    CommonCustomMaterialModule
  ],
  declarations: [GrnRequestListItemsComponent],
  exports: [GrnRequestListItemsComponent]
})
export class EpossGrnRequestApprovalsUiGrnRequestApprovalsModule {}
