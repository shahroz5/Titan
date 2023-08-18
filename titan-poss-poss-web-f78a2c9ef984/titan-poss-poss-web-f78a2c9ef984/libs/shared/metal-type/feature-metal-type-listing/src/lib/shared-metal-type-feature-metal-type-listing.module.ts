import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { RouterModule, Route } from '@angular/router';

import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { MetalTypeListComponent } from './metal-type-list/metal-type-list.component';
import { SharedMetalTypeDataAccessMetalTypeModule } from '@poss-web/shared/metal-type/data-access-metal-type';

import { SharedMetalTypeUiMetalTypeListModule } from '@poss-web/shared/metal-type/ui-metal-type-list';
import {
  SharedMetalTypeUiMetalTypeDetailModule,
  MetalTypeDetailsComponent
} from '@poss-web/shared/metal-type/ui-metal-type-detail';

import { SharedMetalTypeUiMetalTypeViewModule } from '@poss-web/shared/metal-type/ui-metal-type-view';
import { SharedComponentsUiDynamicFormModule } from '@poss-web/shared/components/ui-dynamic-form';

const route: Route[] = [
  {
    path: '',
    component: MetalTypeListComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    SharedMetalTypeDataAccessMetalTypeModule,
    SharedComponentsUiDynamicFormModule,
    SharedMetalTypeUiMetalTypeDetailModule,
    SharedMetalTypeUiMetalTypeListModule,
    SharedMetalTypeUiMetalTypeViewModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule
  ],
  declarations: [MetalTypeListComponent],

  entryComponents: [MetalTypeDetailsComponent]
})
export class SharedMetalTypeFeatureMetalTypeListingModule {}
