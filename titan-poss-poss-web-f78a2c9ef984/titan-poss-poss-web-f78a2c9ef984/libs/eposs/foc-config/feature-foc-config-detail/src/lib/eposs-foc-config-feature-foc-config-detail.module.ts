import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { FocConfigDetailComponent } from './foc-config-detail/foc-config-detail.component';
import { EpossFocConfigUiFocConfigDetailModule } from '@poss-web/eposs/foc-config/ui-foc-config-detail';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
import { EpossFocConfigDataAccessFocConfigModule } from '@poss-web/eposs/foc-config/data-access-foc-config';
import { EpossFocConfigUiFocConfigViewModule } from '@poss-web/eposs/foc-config/ui-foc-config-view';

const routes: Route[] = [
  {
    path: '',
    component: FocConfigDetailComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    EpossFocConfigUiFocConfigDetailModule,
    SharedComponentsUiToggleButtonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    EpossFocConfigUiFocConfigViewModule,
    EpossFocConfigDataAccessFocConfigModule
  ],
  declarations: [FocConfigDetailComponent]
})
export class EpossFocConfigFeatureFocConfigDetailModule {}
