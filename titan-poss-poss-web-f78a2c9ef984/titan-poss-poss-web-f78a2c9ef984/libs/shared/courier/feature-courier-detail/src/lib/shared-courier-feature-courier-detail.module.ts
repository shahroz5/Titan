import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedCourierDataAccessCourierModule } from '@poss-web/shared/courier/data-access-courier';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { Routes, RouterModule } from '@angular/router';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedCourierUiCourierDetailModule } from '@poss-web/shared/courier/ui-courier-detail';
import { CourierDetailsComponent } from './courier-details/courier-details.component';
import { SharedCourierUiCourierViewModule } from '@poss-web/shared/courier/ui-courier-view';
import { SharedComponentsUiDynamicFormModule } from '@poss-web/shared/components/ui-dynamic-form';
import { SelectionDialogService } from '@poss-web/shared/components/ui-selection-dialog';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';
const routes: Routes = [
  {
    path: '',
    component: CourierDetailsComponent
  }
];
@NgModule({
  declarations: [CourierDetailsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedCourierDataAccessCourierModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedCourierUiCourierDetailModule,
    SharedCourierUiCourierViewModule,
    SharedComponentsUiDynamicFormModule,
    SharedPermissionUiPermissionModule
  ],
  providers: [SelectionDialogService]
})
export class SharedCourierFeatureCourierDetailModule {}
