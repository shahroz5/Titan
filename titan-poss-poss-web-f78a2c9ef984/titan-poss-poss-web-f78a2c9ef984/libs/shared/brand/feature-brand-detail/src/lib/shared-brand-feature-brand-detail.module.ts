import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';

import { Route, RouterModule } from '@angular/router';
import { SharedBrandDataAccessBrandModule } from '@poss-web/shared/brand/data-access-brand';
import { SharedBrandUiBrandDetailModule } from '@poss-web/shared/brand/ui-brand-detail';
import { SharedBrandUiBrandViewModule } from '@poss-web/shared/brand/ui-brand-view';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { BrandMasterComponent } from './brand-master.component';

const routes: Route[] = [
  // { path: 'brand/:page', pathMatch: 'full', redirectTo: '' },
  {
    path: '',
    component: BrandMasterComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    SharedBrandDataAccessBrandModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    RouterModule.forChild(routes),
    SharedBrandUiBrandDetailModule,
    SharedBrandUiBrandViewModule
  ],
  declarations: [BrandMasterComponent]
})
export class SharedBrandFeatureBrandDetailModule {}
