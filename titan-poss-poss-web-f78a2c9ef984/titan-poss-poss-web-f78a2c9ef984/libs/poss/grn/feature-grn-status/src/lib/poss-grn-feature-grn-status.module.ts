import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GrnStatusComponent } from './grn-status/grn-status.component';
import { Routes, RouterModule } from '@angular/router';
import { PossGrnUiGrnStatusModule } from '@poss-web/poss/grn/ui-grn-status';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { PossGrnDataAccessGrnModule } from '@poss-web/poss/grn/data-access-grn';
import { PossGrnUiGrnHistoryModule } from '@poss-web/poss/grn/ui-grn-history';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedBodEodDataAccessBodEodModule } from '@poss-web/shared/bod-eod/data-access-bod-eod';
const routes: Routes = [
  {
    path: '',
    component: GrnStatusComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CommonCustomMaterialModule,
    PossGrnDataAccessGrnModule,
    PossGrnUiGrnStatusModule,
    PossGrnUiGrnHistoryModule,
    SharedComponentsUiLoaderModule,
    SharedBodEodDataAccessBodEodModule
  ],
  declarations: [GrnStatusComponent]
})
export class PossGrnFeatureGrnStatusModule {}
