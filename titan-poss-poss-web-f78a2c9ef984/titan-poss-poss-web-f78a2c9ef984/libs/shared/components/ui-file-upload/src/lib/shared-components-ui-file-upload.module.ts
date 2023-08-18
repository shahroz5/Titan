import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { FilePreviewComponent } from './file-preview/file-preview.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';

@NgModule({
  imports: [CommonModule, CommonCustomMaterialModule],
  declarations: [FileUploadComponent, FilePreviewComponent],
  exports: [FileUploadComponent, FilePreviewComponent],
  entryComponents: [FilePreviewComponent]
})
export class SharedComponentsUiFileUploadModule {}
