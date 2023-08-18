import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { Routes, RouterModule } from '@angular/router';
import { CfaProductCodeListingComponent } from './cfa-product-code-listing/cfa-product-code-listing.component';
import { SharedCfaProductDataAccessCfaProductModule } from '@poss-web/shared/cfa-product/data-access-cfa-product';
import { SharedCfaProductUiCfaProductListModule } from '@poss-web/shared/cfa-product/ui-cfa-product-list';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';
const routes: Routes = [
  {
    path: '',
    component: CfaProductCodeListingComponent
  }
];
@NgModule({
  declarations: [CfaProductCodeListingComponent],
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    RouterModule.forChild(routes),
    SharedCfaProductDataAccessCfaProductModule,
    SharedCfaProductUiCfaProductListModule,
    SharedPermissionUiPermissionModule
  ]
})
export class SharedCfaProductFeatureCfaProductListingModule {}
