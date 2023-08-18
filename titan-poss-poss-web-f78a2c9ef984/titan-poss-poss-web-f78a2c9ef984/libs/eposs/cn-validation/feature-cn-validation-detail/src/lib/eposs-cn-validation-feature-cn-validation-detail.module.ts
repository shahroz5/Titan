import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CnValidationDetailComponent } from './cn-validation-detail/cn-validation-detail.component';
import { Routes, RouterModule } from '@angular/router';
import { EpossCnValidationUiCnValidationDetailModule } from '@poss-web/eposs/cn-validation/ui-cn-validation-detail';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { EpossCnValidationDataAccessCnValidationModule } from '@poss-web/eposs/cn-validation/data-access-cn-validation';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
const routes: Routes = [
  {
    path: '',
    component: CnValidationDetailComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    SharedComponentsUiLoaderModule,
    CommonCustomMaterialModule,
    EpossCnValidationUiCnValidationDetailModule,
    RouterModule.forChild(routes),
    EpossCnValidationDataAccessCnValidationModule
  ],
  declarations: [CnValidationDetailComponent]
})
export class EpossCnValidationFeatureCnValidationDetailModule {}
