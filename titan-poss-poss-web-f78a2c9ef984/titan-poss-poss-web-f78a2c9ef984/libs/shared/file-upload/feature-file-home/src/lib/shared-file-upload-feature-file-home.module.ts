import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileHomeComponent } from './file-home/file-home.component';
import { SharedComponentsUiCardMenuModule } from '@poss-web/shared/components/ui-card-menu';
import { Routes, RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
const routes: Routes = [
  {
    path: '',
    component: FileHomeComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CommonCustomMaterialModule,
    SharedComponentsUiCardMenuModule
  ],
  declarations: [FileHomeComponent]
})
export class SharedFileUploadFeatureFileHomeModule {}
