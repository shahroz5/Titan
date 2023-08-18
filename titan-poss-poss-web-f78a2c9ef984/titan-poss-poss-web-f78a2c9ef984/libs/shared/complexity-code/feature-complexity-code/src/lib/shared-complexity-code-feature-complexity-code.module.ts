import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { ComplexityCodeComponent } from './complexity-code/complexity-code.component';
import { SharedComplexityCodeDataAccessComplexityCodeModule } from '@poss-web/shared/complexity-code/data-access-complexity-code';
import { SharedComponentsUiDynamicFormModule } from '@poss-web/shared/components/ui-dynamic-form';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComplexityCodeUiComplexityCodeDetailModule } from '@poss-web/shared/complexity-code/ui-complexity-code-detail';
import { SharedComplexityCodeUiComplexityCodeListModule } from '@poss-web/shared/complexity-code/ui-complexity-code-list';
import { SharedComplexityCodeUiComplexityCodeViewModule } from '@poss-web/shared/complexity-code/ui-complexity-code-view';
const routes: Routes = [
  {
    path: '',
    component: ComplexityCodeComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedComplexityCodeDataAccessComplexityCodeModule,
    SharedComponentsUiDynamicFormModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedComplexityCodeUiComplexityCodeDetailModule,
    SharedComplexityCodeUiComplexityCodeListModule,
    SharedComplexityCodeUiComplexityCodeViewModule
  ],
  declarations: [ComplexityCodeComponent]
})
export class SharedComplexityCodeFeatureComplexityCodeModule {}
