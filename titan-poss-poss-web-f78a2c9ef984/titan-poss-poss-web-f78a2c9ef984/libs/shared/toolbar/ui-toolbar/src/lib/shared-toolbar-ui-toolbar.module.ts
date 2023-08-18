import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialPriceComponent } from './material-price/material-price.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { OnHoldComponent } from './on-hold/on-hold.component';
import { OpenOrdersComponent } from './open-orders/open-orders.component';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiFormattersModule,
    SharedComponentsUiAgGridModule
  ],
  declarations: [MaterialPriceComponent, OnHoldComponent, OpenOrdersComponent],
  exports: [MaterialPriceComponent, OnHoldComponent, OpenOrdersComponent]
})
export class SharedToolbarUiToolbarModule {}
