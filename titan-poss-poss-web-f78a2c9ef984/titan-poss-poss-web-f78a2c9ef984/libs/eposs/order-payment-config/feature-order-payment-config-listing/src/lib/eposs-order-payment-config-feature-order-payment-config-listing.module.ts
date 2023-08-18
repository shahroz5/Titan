import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderPaymentConfigListingComponent } from './order-payment-config-listing/order-payment-config-listing.component';
import { FormsModule } from '@angular/forms';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { Route, RouterModule } from '@angular/router';
import { EpossOrderPaymentConfigDataAccessOrderPaymentConfigModule } from '@poss-web/eposs/order-payment-config/data-access-order-payment-config';
import { EpossOrderPaymentConfigUiOrderPaymentConfigListingModule } from '@poss-web/eposs/order-payment-config/ui-order-payment-config-listing';
import { SharedPermissionDataAccessPermissionModule } from '@poss-web/shared/permission/data-access-permission';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';

const routes: Route[] = [
  {
    path: '',
    component: OrderPaymentConfigListingComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    RouterModule.forChild(routes),
    EpossOrderPaymentConfigDataAccessOrderPaymentConfigModule,
    EpossOrderPaymentConfigUiOrderPaymentConfigListingModule,
    SharedPermissionDataAccessPermissionModule,
    SharedPermissionUiPermissionModule
  ],
  declarations: [OrderPaymentConfigListingComponent]
})
export class EpossOrderPaymentConfigFeatureOrderPaymentConfigListingModule {}
