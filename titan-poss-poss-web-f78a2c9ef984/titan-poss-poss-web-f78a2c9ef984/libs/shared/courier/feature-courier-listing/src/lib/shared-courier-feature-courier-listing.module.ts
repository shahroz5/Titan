import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { Routes, RouterModule } from '@angular/router';
import { CourierDetailsListingComponent } from './courier-details-listing/courier-details-listing.component';
import { SharedCourierDataAccessCourierModule } from '@poss-web/shared/courier/data-access-courier';
import { SharedCourierUiCourierListModule } from '@poss-web/shared/courier/ui-courier-list';
import { SharedCourierUiCourierDetailModule } from '@poss-web/shared/courier/ui-courier-detail';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';
const routes: Routes = [
  {
    path: '',
    component: CourierDetailsListingComponent
  }
];
@NgModule({
  declarations: [CourierDetailsListingComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedCourierDataAccessCourierModule,
    SharedCourierUiCourierListModule,
    SharedCourierUiCourierDetailModule,
    SharedPermissionUiPermissionModule
  ]
})
export class SharedCourierFeatureCourierListingModule {}
