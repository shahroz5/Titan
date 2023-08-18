import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';

import { SharedToolbarFeatureToolbarModule } from '@poss-web/shared/toolbar/feature-toolbar';
import { SharedCustomerFeatureCustomerSearchModule } from '@poss-web/shared/customer/feature-customer-search';

import { PossGrnFeatureViewGrnModule } from '@poss-web/poss/grn/feature-view-grn';
import { GrnDetailsShellComponent } from './grn-details-shell/grn-details-shell.component';
import { PossGrnFeatureCreateGrnModule } from '@poss-web/poss/grn/feature-create-grn';

const routes: Routes = [
  {
    path: '',
    component: GrnDetailsShellComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedToolbarFeatureToolbarModule,
    SharedCustomerFeatureCustomerSearchModule,
    PossGrnFeatureViewGrnModule,
    RouterModule.forChild(routes),
    PossGrnFeatureCreateGrnModule
  ],
  declarations: [GrnDetailsShellComponent],
  exports: [GrnDetailsShellComponent]
})
export class PossGrnFeatureGrnDetailsShellModule {}
