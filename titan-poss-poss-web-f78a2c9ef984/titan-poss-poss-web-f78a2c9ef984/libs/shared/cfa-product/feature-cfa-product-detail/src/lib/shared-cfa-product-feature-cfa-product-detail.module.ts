import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { Routes, RouterModule } from '@angular/router';
import { CFAProductCodeComponent } from './details/cfa-product-code/cfa-product-code.component';
import { SharedCfaProductDataAccessCfaProductModule } from '@poss-web/shared/cfa-product/data-access-cfa-product';
import { SharedCfaProductUiCfaProductDetailModule } from '@poss-web/shared/cfa-product/ui-cfa-product-detail';
import { SharedCfaProductUiCfaProductViewModule } from '@poss-web/shared/cfa-product/ui-cfa-product-view';
const routes: Routes = [
  {
    path: '',
    component: CFAProductCodeComponent
  }
];
@NgModule({
  declarations: [CFAProductCodeComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedCfaProductDataAccessCfaProductModule,
    SharedCfaProductUiCfaProductDetailModule,
    SharedCfaProductUiCfaProductViewModule
  ]
})
export class SharedCfaProductFeatureCfaProductDetailModule {}
