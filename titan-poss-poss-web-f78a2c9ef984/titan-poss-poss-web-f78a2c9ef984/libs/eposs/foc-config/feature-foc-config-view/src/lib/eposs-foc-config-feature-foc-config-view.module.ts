import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { EpossFocConfigUiFocConfigDetailModule } from '@poss-web/eposs/foc-config/ui-foc-config-detail';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
import { EpossFocConfigDataAccessFocConfigModule } from '@poss-web/eposs/foc-config/data-access-foc-config';
import { EpossFocConfigUiFocConfigViewModule } from '@poss-web/eposs/foc-config/ui-foc-config-view';
import { TableViewDialogService } from '@poss-web/shared/components/ui-table-view-dialog';

import { FocConfigDetailsViewComponent } from './foc-config-details-view.component';

const routes: Route[] = [
  {
    path: '',
    component: FocConfigDetailsViewComponent
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
  declarations: [FocConfigDetailsViewComponent],
  providers: [TableViewDialogService]
})
export class EpossFocConfigFeatureFocConfigViewModule {}
