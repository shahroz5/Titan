import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { EpossIbtConfigUiIbtConfigListingModule } from '@poss-web/eposs/ibt-config/ui-ibt-config-listing';
import { EpossIbtConfigDataAccessIbtConfigModule } from '@poss-web/eposs/ibt-config/data-access-ibt-config';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { IbtConfigurationListComponent } from './ibt-configuration-list/ibt-configuration-list.component';
const routes: Routes = [
  {
    path: '',
    component: IbtConfigurationListComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    RouterModule.forChild(routes),
    SharedComponentsUiLoaderModule,
    EpossIbtConfigUiIbtConfigListingModule,
    EpossIbtConfigDataAccessIbtConfigModule
  ],
  declarations: [IbtConfigurationListComponent]
})
export class EpossIbtConfigFeatureIbtConfigListingModule {}
