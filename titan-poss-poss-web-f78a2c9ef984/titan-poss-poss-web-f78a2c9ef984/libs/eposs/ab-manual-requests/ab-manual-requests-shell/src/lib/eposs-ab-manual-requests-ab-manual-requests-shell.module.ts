import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbManualRequestShellComponent } from './ab-manual-request-shell/ab-manual-request-shell.component';
import { Routes, RouterModule } from '@angular/router';
import { EpossAbManualRequestsAbManualRequestsDetailFeatureModule } from '@poss-web/eposs/ab-manual-requests/ab-manual-requests-detail-feature';
import { SharedPaymentFeaturePaymentModule } from '@poss-web/shared/payment/feature-payment';
import { PossSharedDiscountFeatureDiscountModule } from '@poss-web/poss/shared/discount/feature-discount';

const routes: Routes = [
  {
    path: '',
    component: AbManualRequestShellComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    EpossAbManualRequestsAbManualRequestsDetailFeatureModule,
    SharedPaymentFeaturePaymentModule,
    PossSharedDiscountFeatureDiscountModule
  ],
  declarations: [AbManualRequestShellComponent]
})
export class EpossAbManualRequestsAbManualRequestsShellModule {}
