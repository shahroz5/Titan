import { SharedComponentsUiCardMenuModule } from '@poss-web/shared/components/ui-card-menu';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { Routes, RouterModule } from '@angular/router';
import { MasterHomeComponent } from './master-home.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  {
    path: '',
    component: MasterHomeComponent
  }
];
@NgModule({
  declarations: [MasterHomeComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CommonCustomMaterialModule,

    SharedComponentsUiCardMenuModule
  ]
})
export class SharedMasterHomeFeatureMasterHomeModule {}
