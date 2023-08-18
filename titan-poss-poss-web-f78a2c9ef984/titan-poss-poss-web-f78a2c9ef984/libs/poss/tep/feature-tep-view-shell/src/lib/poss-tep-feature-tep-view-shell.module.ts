import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewTepShellComponent } from './view-tep-shell/view-tep-shell.component';
import { PossTepFeatureTepViewModule } from '@poss-web/poss/tep/feature-tep-view';
import { PossTepFeatureTepRequestViewModule } from '@poss-web/poss/tep/feature-tep-request-view';
import { PossSharedFeatureCommonModule } from '@poss-web/poss/shared/feature-common';
import { Routes, RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedCustomerFeatureCustomerSearchModule } from '@poss-web/shared/customer/feature-customer-search';
import { SharedToolbarFeatureToolbarModule } from '@poss-web/shared/toolbar/feature-toolbar';
import { PossTepDataAccessTepModule } from '@poss-web/poss/tep/data-access-tep';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
const routes: Routes = [
  {
    path: '',
    component: ViewTepShellComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CommonCustomMaterialModule,
    SharedToolbarFeatureToolbarModule,
    SharedCustomerFeatureCustomerSearchModule,
    PossTepFeatureTepViewModule,
    PossTepFeatureTepRequestViewModule,
    PossTepDataAccessTepModule,
    PossSharedFeatureCommonModule,
    SharedComponentsUiFormattersModule
  ],
  declarations: [ViewTepShellComponent]
})
export class PossTepFeatureTepViewShellModule {}
