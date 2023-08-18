import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiscountConfigViewComponent } from './discount-config-view/discount-config-view.component';
import { Routes, RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { EpossDiscountConfigDataAccessDiscountConfigModule } from '@poss-web/eposs/discount-config/data-access-discount-config';
import { SharedProductGroupMappingDataAccessProductGroupMappingModule } from '@poss-web/shared/product-group-mapping/data-access-product-group-mapping';
import { EpossDiscountConfigUiDiscountConfigViewModule } from '@poss-web/eposs/discount-config/ui-discount-config-view';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
const routes: Routes = [
  {
    path: '',
    component: DiscountConfigViewComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    RouterModule.forChild(routes),
    EpossDiscountConfigDataAccessDiscountConfigModule,
    SharedProductGroupMappingDataAccessProductGroupMappingModule,
    EpossDiscountConfigUiDiscountConfigViewModule,
    SharedComponentsUiLoaderModule
  ],
  declarations: [DiscountConfigViewComponent],
  exports: [DiscountConfigViewComponent]
})
export class EpossDiscountConfigFeatureDiscountConfigViewModule {}
