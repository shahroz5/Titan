import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { PossPrinterConfigDataAccessPrinterConfigModule } from '@poss-web/poss/printer-config/data-access-printer-config';
import { PossPrinterConfigUiPrinterConfigModule } from '@poss-web/poss/printer-config/ui-printer-config';
import { AgGridModule } from 'ag-grid-angular';
import { PrinterConfigComponent } from './printer-config/printer-config.component';
const route: Route[] = [{ path: '', component: PrinterConfigComponent }];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    PossPrinterConfigUiPrinterConfigModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    AgGridModule.withComponents(),
    PossPrinterConfigDataAccessPrinterConfigModule
  ],
  declarations: [PrinterConfigComponent]
})
export class PossPrinterConfigFeaturePrinterConfigModule {}
