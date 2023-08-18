import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CnValidationViewDetailComponent } from './cn-validation-view-detail/cn-validation-view-detail.component';
import { Routes, RouterModule } from '@angular/router';
import { EpossCnValidationUiCnValidationDetailModule } from '@poss-web/eposs/cn-validation/ui-cn-validation-detail';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { EpossCnValidationDataAccessCnValidationModule } from '@poss-web/eposs/cn-validation/data-access-cn-validation';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedLocationMappingDataAccessLocationMappingModule } from '@poss-web/shared/location-mapping/data-access-location-mapping';
import { SelectionDialogService } from '@poss-web/shared/components/ui-selection-dialog';
const routes: Routes = [
  {
    path: '',
    component: CnValidationViewDetailComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    SharedComponentsUiLoaderModule,
    CommonCustomMaterialModule,
    EpossCnValidationUiCnValidationDetailModule,
    RouterModule.forChild(routes),
    EpossCnValidationDataAccessCnValidationModule,
    SharedLocationMappingDataAccessLocationMappingModule
  ],
  declarations: [CnValidationViewDetailComponent],
  providers: [SelectionDialogService]
})
export class EpossCnValidationFeatureCnValidationViewDetailModule {}
