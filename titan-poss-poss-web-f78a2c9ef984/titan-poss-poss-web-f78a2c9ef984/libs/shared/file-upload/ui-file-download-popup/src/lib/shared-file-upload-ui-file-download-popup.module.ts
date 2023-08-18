import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { FileDownloadPopupComponent } from './file-download-popup/file-download-popup.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiAgGridModule
  ],
  declarations: [FileDownloadPopupComponent],
  exports: [FileDownloadPopupComponent],
  entryComponents: [FileDownloadPopupComponent]
})
export class SharedFileUploadUiFileDownloadPopupModule {}
