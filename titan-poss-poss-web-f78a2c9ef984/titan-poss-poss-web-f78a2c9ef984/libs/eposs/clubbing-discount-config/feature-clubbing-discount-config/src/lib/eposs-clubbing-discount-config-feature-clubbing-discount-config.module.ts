import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { ClubbingDiscountConfigListComponent } from './clubbing-discount-config-list/clubbing-discount-config-list.component';
import { EpossClubbingDiscountConfigUiClubbingDiscountConfigModule } from '@poss-web/eposs/clubbing-discount-config/ui-clubbing-discount-config';
import { EpossClubbingDiscountConfigUiClubbingDiscountPopupModule } from '@poss-web/eposs/clubbing-discount-config/ui-clubbing-discount-popup';
import { EpossClubbingDiscountConfigDataAccessClubbingDiscountConfigModule } from '@poss-web/eposs/clubbing-discount-config/data-access-clubbing-discount-config';
const routes: Routes = [
  {
    path: '',
    component: ClubbingDiscountConfigListComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    EpossClubbingDiscountConfigDataAccessClubbingDiscountConfigModule,
    EpossClubbingDiscountConfigUiClubbingDiscountPopupModule,
    EpossClubbingDiscountConfigUiClubbingDiscountConfigModule
  ],
  declarations: [ClubbingDiscountConfigListComponent]
})
export class EpossClubbingDiscountConfigFeatureClubbingDiscountConfigModule {}
