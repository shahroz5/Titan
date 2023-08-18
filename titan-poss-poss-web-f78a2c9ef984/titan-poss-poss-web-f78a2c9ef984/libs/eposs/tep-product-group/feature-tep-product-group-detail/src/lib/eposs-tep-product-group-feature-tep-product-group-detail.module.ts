import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';

import { SharedBrandUiBrandDetailModule } from '@poss-web/shared/brand/ui-brand-detail';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';

import { EpossTepProductGroupDataAccessTepProductGroupModule } from '@poss-web/eposs/tep-product-group/data-access-tep-product-group';
import { EpossTepProductGroupUiTepProductGroupDetailModule } from '@poss-web/eposs/tep-product-group/ui-tep-product-group-detail';
import { EpossTepProductGroupUiTepProductGroupViewModule } from '@poss-web/eposs/tep-product-group/ui-tep-product-group-view';

import { SharedLocationMappingDataAccessLocationMappingModule } from '@poss-web/shared/location-mapping/data-access-location-mapping';
import { SelectionDialogService } from '@poss-web/shared/components/ui-selection-dialog';

import { TepProductGroupDetailComponent } from './tep-product-group-detail.component';

const routes: Route[] = [
  {
    path: '',
    component: TepProductGroupDetailComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    EpossTepProductGroupDataAccessTepProductGroupModule,
    EpossTepProductGroupUiTepProductGroupDetailModule,
    EpossTepProductGroupUiTepProductGroupViewModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedBrandUiBrandDetailModule,
    RouterModule.forChild(routes),
    SharedLocationMappingDataAccessLocationMappingModule
  ],
  declarations: [TepProductGroupDetailComponent],
  providers: [SelectionDialogService]
})
export class EpossTepProductGroupFeatureTepProductGroupDetailModule {}
