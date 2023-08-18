import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoOrderPaymentConfigListingComponent } from './co-order-payment-config-listing/co-order-payment-config-listing.component';
import { FormsModule } from '@angular/forms';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { Route, RouterModule } from '@angular/router';
import { EpossCoOrderPaymentConfigDataAccessOrderPaymentConfigModule } from '@poss-web/eposs/co-order-payment-config/data-access-co-order-payment-config';
import { EpossCoOrderPaymentConfigUiCoOrderPaymentConfigListingModule } from '@poss-web/eposs/co-order-payment-config/ui-co-order-payment-config-listing';
const routes: Route[] = [
  {
    path: '',
    component: CoOrderPaymentConfigListingComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    RouterModule.forChild(routes),
    EpossCoOrderPaymentConfigDataAccessOrderPaymentConfigModule,
    EpossCoOrderPaymentConfigUiCoOrderPaymentConfigListingModule
  ],
  declarations: [CoOrderPaymentConfigListingComponent]
})
export class EpossCoOrderPaymentConfigFeatureCoOrderPaymentConfigModule {}
