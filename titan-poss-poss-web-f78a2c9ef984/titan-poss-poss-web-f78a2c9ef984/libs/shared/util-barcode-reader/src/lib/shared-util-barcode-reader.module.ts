import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarcodeReaderService } from './barcode-reader.service';

@NgModule({
  imports: [CommonModule],
  providers: [BarcodeReaderService]
})
export class SharedUtilBarcodeReaderModule {}
