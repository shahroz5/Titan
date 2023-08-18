import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorMasterListComponent } from './vendor-master-list/vendor-master-list.component';
import { SharedVendorMasterUiVendorMasterListModule } from '@poss-web/shared/vendor-master/ui-vendor-master-list';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedVendorMasterUiVendorMasterDetailsModule } from '@poss-web/shared/vendor-master/ui-vendor-master-details';
import { SharedVendorMasterDataAccessVendorMasterModule } from '@poss-web/shared/vendor-master/data-access-vendor-master';
import { Route, RouterModule } from '@angular/router';
const routes: Route[] = [
  {
    component: VendorMasterListComponent,
    path: ''
  }
];
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    RouterModule.forChild(routes),
    SharedComponentsUiLoaderModule,
    SharedVendorMasterUiVendorMasterDetailsModule,
    SharedVendorMasterUiVendorMasterListModule,
    SharedVendorMasterDataAccessVendorMasterModule
  ],
  declarations: [VendorMasterListComponent]
})
export class SharedVendorMasterFeatureVendorMasterModule {}
