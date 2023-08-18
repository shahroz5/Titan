import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CnPriorityConfigDetailComponent } from './cn-priority-config-detail/cn-priority-config-detail.component';
import { Routes, RouterModule } from '@angular/router';
import { EpossCnPriorityConfigUiCnPriorityConfigDetailModule } from '@poss-web/eposs/cn-priority-config/ui-cn-priority-config-detail';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { EpossCnPriorityConfigDataAccessCnPriorityConfigModule } from '@poss-web/eposs/cn-priority-config/data-access-cn-priority-config';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
const routes: Routes = [
  {
    path: '',
    component: CnPriorityConfigDetailComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    SharedComponentsUiLoaderModule,
    CommonCustomMaterialModule,
    EpossCnPriorityConfigUiCnPriorityConfigDetailModule,
    RouterModule.forChild(routes),
    EpossCnPriorityConfigDataAccessCnPriorityConfigModule
  ],
  declarations: [CnPriorityConfigDetailComponent]
})
export class EpossCnPriorityConfigFeatureCnPriorityConfigDetailModule {}
