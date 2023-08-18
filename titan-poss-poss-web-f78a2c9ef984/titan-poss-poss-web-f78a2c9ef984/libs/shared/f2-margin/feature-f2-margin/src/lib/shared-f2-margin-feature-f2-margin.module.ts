import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { F2MarginListComponent } from './f2-margin-list/f2-margin-list.component';
import { SharedFileUploadDataAccessFileUploadModule } from '@poss-web/shared/file-upload/data-access-file-upload';
import { SharedF2MarginDataAccessF2MarginModule } from '@poss-web/shared/f2-margin/data-access-f2-margin';
import { Route, RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedF2MarginUiF2MarginModule } from '@poss-web/shared/f2-margin/ui-f2-margin';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';

const routes: Route[] = [{ path: '', component: F2MarginListComponent }];

@NgModule({
  imports: [
    CommonModule,
    SharedF2MarginDataAccessF2MarginModule,
    RouterModule.forChild(routes),
    SharedFileUploadDataAccessFileUploadModule,
    CommonCustomMaterialModule,
    SharedF2MarginUiF2MarginModule,
    SharedComponentsUiLoaderModule
  ],
  declarations: [F2MarginListComponent]
})
export class SharedF2MarginFeatureF2MarginModule {}
