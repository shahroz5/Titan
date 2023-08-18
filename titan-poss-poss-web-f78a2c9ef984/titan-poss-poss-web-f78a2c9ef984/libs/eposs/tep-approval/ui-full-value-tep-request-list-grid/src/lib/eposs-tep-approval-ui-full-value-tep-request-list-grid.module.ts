import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullValueTepRequestListGridComponent } from './full-value-tep-request-list-grid/full-value-tep-request-list-grid.component';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiAgGridModule,
    SharedUtilFieldValidatorsModule
  ],
  declarations: [FullValueTepRequestListGridComponent],
  exports: [FullValueTepRequestListGridComponent]
})
export class EpossTepApprovalUiFullValueTepRequestListGridModule {}
