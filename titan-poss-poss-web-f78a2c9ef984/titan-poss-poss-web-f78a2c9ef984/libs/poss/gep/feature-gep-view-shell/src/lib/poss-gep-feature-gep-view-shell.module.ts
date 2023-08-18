import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GepViewShellComponent } from './gep-view-shell/gep-view-shell.component';
import { PossGepFeatureGepViewModule } from '@poss-web/poss/gep/feature-gep-view';
import { RouterModule, Routes } from '@angular/router';
import { PossSharedFeatureCommonModule } from '@poss-web/poss/shared/feature-common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedCustomerFeatureCustomerSearchModule } from '@poss-web/shared/customer/feature-customer-search';
import { SharedToolbarFeatureToolbarModule } from '@poss-web/shared/toolbar/feature-toolbar';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';

const routes: Routes = [
  {
    path: '',
    component: GepViewShellComponent
  }
];

@NgModule({
  imports: [CommonModule,
    RouterModule.forChild(routes),
    CommonCustomMaterialModule,
    PossGepFeatureGepViewModule,
    SharedToolbarFeatureToolbarModule,
    SharedCustomerFeatureCustomerSearchModule,
    PossSharedFeatureCommonModule,
    SharedComponentsUiFormattersModule
  ],
  declarations: [GepViewShellComponent],
  exports: [GepViewShellComponent]
})
export class PossGepFeatureGepViewShellModule {}
