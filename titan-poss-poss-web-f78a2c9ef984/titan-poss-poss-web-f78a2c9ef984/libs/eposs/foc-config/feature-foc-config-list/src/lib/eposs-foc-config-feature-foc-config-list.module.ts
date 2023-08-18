import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FocConfigListComponent } from './foc-config-list/foc-config-list.component';
import { RouterModule, Route } from '@angular/router';

import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { EpossFocConfigDataAccessFocConfigModule } from '@poss-web/eposs/foc-config/data-access-foc-config';
import { EpossFocConfigUiFocConfigListModule } from '@poss-web/eposs/foc-config/ui-foc-config-list';

const routes: Route[] = [
  {
    path: '',
    component: FocConfigListComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    EpossFocConfigDataAccessFocConfigModule,
    RouterModule.forChild(routes),
    EpossFocConfigUiFocConfigListModule
  ],
  declarations: [FocConfigListComponent]
})
export class EpossFocConfigFeatureFocConfigListModule {}
