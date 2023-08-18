import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiSelectionDialogModule } from '@poss-web/shared/components/ui-selection-dialog';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedBodEodDataAccessBodEodModule } from '@poss-web/shared/bod-eod/data-access-bod-eod';
import { SharedPermissionUtilElementPermissionsModule } from '@poss-web/shared/permission/util-element-permissions';
import { SharedPermissionDataAccessPermissionModule } from '@poss-web/shared/permission/data-access-permission';
import { PossCnTransferUiCnTransferSearchListModule } from '@poss-web/poss/cn-transfer/ui-cn-transfer-search-list';
import { PossCnTransferDataAccessCnTransferModule } from '@poss-web/poss/cn-transfer/data-access-cn-transfer';
import { CnTransferSearchComponent } from './cn-transfer-search/cn-transfer-search.component';

const routes: Routes = [
  {
    path: '',
    component: CnTransferSearchComponent
  }
]
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    RouterModule.forChild(routes),
    PossCnTransferUiCnTransferSearchListModule,
    PossCnTransferDataAccessCnTransferModule,
    SharedComponentsUiSelectionDialogModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiLoaderModule,
    SharedBodEodDataAccessBodEodModule,
    SharedPermissionUtilElementPermissionsModule,
    SharedPermissionDataAccessPermissionModule
  ],
  declarations: [CnTransferSearchComponent],
  exports: [CnTransferSearchComponent]
})
export class PossCnTransferFeatureCnTransferModule {}
