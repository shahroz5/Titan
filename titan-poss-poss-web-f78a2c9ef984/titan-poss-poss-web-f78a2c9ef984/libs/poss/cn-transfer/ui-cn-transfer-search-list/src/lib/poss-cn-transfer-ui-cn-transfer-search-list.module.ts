import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';
import { CnSearchComponent } from './search/cn-search.component';
import { CnTransferSearchListGridComponent } from './cn-transfer-search-list-grid/cn-transfer-search-list-grid.component';

@NgModule({
  imports: [
    CommonModule,
    SharedComponentsUiAgGridModule,
    CommonCustomMaterialModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedPermissionUiPermissionModule
  ],
  declarations: [CnTransferSearchListGridComponent, CnSearchComponent],
  exports: [CnTransferSearchListGridComponent, CnSearchComponent]
})
export class PossCnTransferUiCnTransferSearchListModule {}
