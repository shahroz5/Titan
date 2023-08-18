import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileStatusListItemsComponent } from './file-status-list-items/file-status-list-items.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';

import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { FileStatusListingItemComponent } from './file-status-listing-item/file-status-listing-item.component';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiFormattersModule
  ],
  declarations: [FileStatusListItemsComponent, FileStatusListingItemComponent],
  exports: [FileStatusListItemsComponent, FileStatusListingItemComponent]
})
export class SharedFileUploadUiFileStatusModule {}
