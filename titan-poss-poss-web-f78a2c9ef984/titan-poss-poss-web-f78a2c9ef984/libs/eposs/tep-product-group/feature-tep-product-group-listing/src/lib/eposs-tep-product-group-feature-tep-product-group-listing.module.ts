import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';

import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';

import { EpossTepProductGroupDataAccessTepProductGroupModule } from '@poss-web/eposs/tep-product-group/data-access-tep-product-group';
import { EpossTepProductGroupUiTepProductGroupListModule } from '@poss-web/eposs/tep-product-group/ui-tep-product-group-list';

import { TepProductGroupListingComponent } from './tep-product-group-listing.component';

const routes: Route[] = [
  { path: '', component: TepProductGroupListingComponent }
];

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    RouterModule.forChild(routes),
    EpossTepProductGroupDataAccessTepProductGroupModule,
    EpossTepProductGroupUiTepProductGroupListModule
  ],
  declarations: [TepProductGroupListingComponent]
})
export class EpossTepProductGroupFeatureTepProductGroupListingModule {}
