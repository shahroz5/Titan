import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { FileStatusListingComponent } from './file-status-listing/file-status-listing.component';
import { SharedFileUploadDataAccessFileUploadModule } from '@poss-web/shared/file-upload/data-access-file-upload';
import { SharedFileUploadUiFileStatusModule } from '@poss-web/shared/file-upload/ui-file-status';

const route: Routes = [{ path: '', component: FileStatusListingComponent }];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedFileUploadUiFileStatusModule,
    SharedFileUploadDataAccessFileUploadModule
  ],
  declarations: [FileStatusListingComponent]
})
export class SharedFileUploadFeatureFileStatusModule {}
