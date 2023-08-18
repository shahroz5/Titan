import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { EpossEmployeeLoanConfigUiEmployeeLoanConfigModule } from '@poss-web/eposs/employee-loan-config/ui-employee-loan-config'
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedFileUploadDataAccessFileUploadModule } from '@poss-web/shared/file-upload/data-access-file-upload';
import { EpossEmployeeLoanConfigDataAccessEmployeeLoanConfigModule } from '@poss-web/eposs/employee-loan-config/data-access-employee-loan-config';
import { SharedPermissionDataAccessPermissionModule } from '@poss-web/shared/permission/data-access-permission';
import { SharedPermissionUtilElementPermissionsModule } from '@poss-web/shared/permission/util-element-permissions';
import { EmployeeLoanConfigDetailComponent } from './employee-loan-config-detail/employee-loan-config-detail.component';

const routes: Routes = [
  {
    path: '',
    component: EmployeeLoanConfigDetailComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    RouterModule.forChild(routes),
    EpossEmployeeLoanConfigUiEmployeeLoanConfigModule,
    SharedFileUploadDataAccessFileUploadModule,
    EpossEmployeeLoanConfigDataAccessEmployeeLoanConfigModule,
    SharedPermissionUtilElementPermissionsModule,
    SharedPermissionDataAccessPermissionModule
  ],
  declarations: [EmployeeLoanConfigDetailComponent]
})
export class EpossEmployeeLoanConfigFeatureEmployeeLoanConfigModule {}
