import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';

import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';

import { SharedSubBrandDataAccessSubBrandModule } from '@poss-web/shared/sub-brand/data-access-sub-brand';
import { SharedSubBrandUiSubBrandDetailModule } from '@poss-web/shared/sub-brand/ui-sub-brand-detail';
import { SharedSubBrandUiSubBrandViewModule } from '@poss-web/shared/sub-brand/ui-sub-brand-view';
import { SharedSubBrandUiSubBrandListModule } from '@poss-web/shared/sub-brand/ui-sub-brand-list';
import { SubbrandListComponent } from './subbrand-list/subbrand-list.component';
const routes: Route[] = [
  {
    path: '',
    component: SubbrandListComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    SharedSubBrandDataAccessSubBrandModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedSubBrandUiSubBrandListModule,
    SharedSubBrandUiSubBrandDetailModule,
    SharedSubBrandUiSubBrandViewModule,
    SharedComponentsUiFormFieldControlsModule,
    RouterModule.forChild(routes)
  ],

  declarations: [SubbrandListComponent]
})
export class SharedSubBrandFeatureSubBrandModule {}
