import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CnPriorityConfigViewDetailComponent } from './cn-priority-config-view-detail/cn-priority-config-view-detail.component';
import { Routes, RouterModule } from '@angular/router';
import { EpossCnPriorityConfigUiCnPriorityConfigDetailModule } from '@poss-web/eposs/cn-priority-config/ui-cn-priority-config-detail';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { EpossCnPriorityConfigDataAccessCnPriorityConfigModule } from '@poss-web/eposs/cn-priority-config/data-access-cn-priority-config';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedLocationMappingDataAccessLocationMappingModule } from '@poss-web/shared/location-mapping/data-access-location-mapping';
import { SelectionDialogService } from '@poss-web/shared/components/ui-selection-dialog';
const routes: Routes = [
  {
    path: '',
    component: CnPriorityConfigViewDetailComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    SharedComponentsUiLoaderModule,
    CommonCustomMaterialModule,
    EpossCnPriorityConfigUiCnPriorityConfigDetailModule,
    RouterModule.forChild(routes),
    EpossCnPriorityConfigDataAccessCnPriorityConfigModule,
    SharedLocationMappingDataAccessLocationMappingModule
  ],
  declarations: [CnPriorityConfigViewDetailComponent],
  providers: [SelectionDialogService]
})
export class EpossCnPriorityConfigFeatureCnPriorityConfigViewDetailModule {}
