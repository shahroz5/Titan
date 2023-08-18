import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { EpossDataUploadDataAccessDataUploadModule } from '@poss-web/eposs/data-upload/data-access-data-upload';
import { DataUploadComponent } from './data-upload.component';
import { SharedFileUploadDataAccessFileUploadModule } from '@poss-web/shared/file-upload/data-access-file-upload';


const routes: Routes = [
  {
    path: '',
    component: DataUploadComponent
  }
];

@NgModule({
  declarations: [DataUploadComponent],
  imports: [
    CommonModule,
    //loading Angular Material and ngx-translate modules
    CommonCustomMaterialModule,
    //loading standard route module from angular
    RouterModule.forChild(routes),
    //loading the Shared Components
    SharedComponentsUiLoaderModule,
    //loading the app specific shared components
    EpossDataUploadDataAccessDataUploadModule,
    SharedFileUploadDataAccessFileUploadModule
  ]
})
export class EpossDataUploadFeatureDataUploadModule {}
