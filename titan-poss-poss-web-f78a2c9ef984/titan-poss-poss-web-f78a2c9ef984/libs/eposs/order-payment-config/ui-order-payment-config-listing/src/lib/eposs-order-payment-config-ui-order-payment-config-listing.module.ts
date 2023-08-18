import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderPaymentsListingItemsComponent } from './order-payments-listing-items/order-payments-listing-items.component';
import { OrderPaymentsListingItemComponent } from './order-payments-listing-item/order-payments-listing-item.component';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiToggleButtonModule,
    SharedPermissionUiPermissionModule
  ],
  declarations: [
    OrderPaymentsListingItemsComponent,
    OrderPaymentsListingItemComponent
  ],
  exports: [
    OrderPaymentsListingItemsComponent,
    OrderPaymentsListingItemComponent
  ]
})
export class EpossOrderPaymentConfigUiOrderPaymentConfigListingModule {}
