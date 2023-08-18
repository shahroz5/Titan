import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrintingFacade } from './+state/printing.facade';
import { PrintingService } from './printing.service';

@NgModule({
  imports: [CommonModule],
  providers: [PrintingFacade, PrintingService]
})
export class SharedPrintingDataAccessPrintingModule {}
