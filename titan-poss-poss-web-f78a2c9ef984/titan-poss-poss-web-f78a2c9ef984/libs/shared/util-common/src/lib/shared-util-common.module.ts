import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileDownloadService } from './file-download/file-download.service';
import { PrinterService } from './printer/printer.service';
import { BlockCopyPasteDirective } from './block-copy-paste/block-copy-paste.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [BlockCopyPasteDirective],
  providers: [FileDownloadService, PrinterService],
  exports: [BlockCopyPasteDirective]
})
export class SharedUtilCommonModule {}
