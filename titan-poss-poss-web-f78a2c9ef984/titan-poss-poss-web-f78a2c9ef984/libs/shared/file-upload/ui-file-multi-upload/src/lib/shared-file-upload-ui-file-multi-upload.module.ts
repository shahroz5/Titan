import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadListItemsComponent } from './file-upload-list-items/file-upload-list-items.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiFormattersModule,
    SharedComponentsUiAgGridModule
  ],
  declarations: [FileUploadListItemsComponent],
  exports: [FileUploadListItemsComponent]
})
export class SharedFileUploadUiFileMultiUploadModule {}
