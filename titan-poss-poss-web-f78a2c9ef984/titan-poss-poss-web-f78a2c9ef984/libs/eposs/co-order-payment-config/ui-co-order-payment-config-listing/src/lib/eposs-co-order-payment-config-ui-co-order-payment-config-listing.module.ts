import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoOrderPaymentsListingItemsComponent } from './co-order-payments-listing-items/co-order-payments-listing-items.component';
import { CoOrderPaymentsListingItemComponent } from './co-order-payments-listing-item/co-order-payments-listing-item.component';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiToggleButtonModule
  ],
  declarations: [
    CoOrderPaymentsListingItemsComponent,
    CoOrderPaymentsListingItemComponent
  ],
  exports: [
    CoOrderPaymentsListingItemsComponent,
    CoOrderPaymentsListingItemComponent
  ]
})
export class EpossCoOrderPaymentConfigUiCoOrderPaymentConfigListingModule {}
