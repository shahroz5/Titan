import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaxFlatTepConfigComponent } from './max-flat-tep-config/max-flat-tep-config.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { EpossMaxFlatTepConfigDataAccessMaxFlatTepConfigModule } from '@poss-web/eposs/max-flat-tep-config/data-access-max-flat-tep-config';
import { EpossMaxFlatTepConfigUiMaxFlatTepConfigModule } from '@poss-web/eposs/max-flat-tep-config/ui-max-flat-tep-config';

const routes: Routes = [
  {
    path: '',
    component: MaxFlatTepConfigComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    EpossMaxFlatTepConfigDataAccessMaxFlatTepConfigModule,
    EpossMaxFlatTepConfigUiMaxFlatTepConfigModule
  ],
  declarations: [MaxFlatTepConfigComponent]
})
export class EpossMaxFlatTepConfigFeatureMaxFlatTepConfigModule {}
