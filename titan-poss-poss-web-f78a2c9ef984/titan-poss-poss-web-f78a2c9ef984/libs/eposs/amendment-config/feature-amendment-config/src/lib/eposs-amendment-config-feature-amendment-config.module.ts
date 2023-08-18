import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { EpossAmendmentConfigDataAccessAmendmentConfigModule } from '@poss-web/eposs/amendment-config/data-access-amendment-config';
import { EpossAmendmentConfigUiAmendmentConfigModule } from '@poss-web/eposs/amendment-config/ui-amendment-config';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { AmendmentConfigComponent } from './amendment-config/amendment-config.component';

const routes: Routes = [
  {
    path: '',
    component: AmendmentConfigComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    EpossAmendmentConfigUiAmendmentConfigModule,
    RouterModule.forChild(routes),
    EpossAmendmentConfigDataAccessAmendmentConfigModule,
    SharedComponentsUiLoaderModule
  ],
  declarations: [AmendmentConfigComponent]
})
export class EpossAmendmentConfigFeatureAmendmentConfigModule {}
