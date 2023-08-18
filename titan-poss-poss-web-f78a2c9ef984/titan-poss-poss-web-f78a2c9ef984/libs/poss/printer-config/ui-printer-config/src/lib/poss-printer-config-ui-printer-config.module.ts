import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrinterListComponent } from './printer-list/printer-list.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { AddPrinterPopupComponent } from './add-printer-popup/add-printer-popup.component';
import { UpdatePrinterPopupComponent } from './update-printer-popup/update-printer-popup.component';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiAgGridModule,

    SharedComponentsUiFormFieldControlsModule
  ],
  declarations: [
    PrinterListComponent,
    AddPrinterPopupComponent,
    UpdatePrinterPopupComponent
  ],
  entryComponents: [AddPrinterPopupComponent, UpdatePrinterPopupComponent],
  exports: [PrinterListComponent, AddPrinterPopupComponent]
})
export class PossPrinterConfigUiPrinterConfigModule {}
