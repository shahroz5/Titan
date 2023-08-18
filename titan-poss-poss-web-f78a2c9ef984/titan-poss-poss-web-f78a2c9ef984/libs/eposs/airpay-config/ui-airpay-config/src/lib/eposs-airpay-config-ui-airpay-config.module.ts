import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AirpayVendorListItemsComponent } from './airpay-vendor-list-items/airpay-vendor-list-items.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiAgGridModule
  ],
  exports: [AirpayVendorListItemsComponent],
  declarations: [AirpayVendorListItemsComponent]
})
export class EpossAirpayConfigUiAirpayConfigModule {}
