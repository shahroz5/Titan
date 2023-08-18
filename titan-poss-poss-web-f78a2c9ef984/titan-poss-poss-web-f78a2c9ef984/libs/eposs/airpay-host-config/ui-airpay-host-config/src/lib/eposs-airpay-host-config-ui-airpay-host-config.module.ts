import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AirpayHostConfigListItemsComponent } from './airpay-host-config-list-items/airpay-host-config-list-items.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiAgGridModule
  ],
  exports: [AirpayHostConfigListItemsComponent],
  declarations: [AirpayHostConfigListItemsComponent]
})
export class EpossAirpayHostConfigUiAirpayHostConfigModule {}
