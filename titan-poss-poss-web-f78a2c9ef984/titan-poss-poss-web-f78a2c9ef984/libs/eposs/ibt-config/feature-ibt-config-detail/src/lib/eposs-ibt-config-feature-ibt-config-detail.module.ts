import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { IbtConigurationDetailComponent } from './ibt-coniguration-detail/ibt-coniguration-detail.component';
import { EpossIbtConfigUiIbtConfigDetailModule } from '@poss-web/eposs/ibt-config/ui-ibt-config-detail';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { EpossIbtConfigDataAccessIbtConfigModule } from '@poss-web/eposs/ibt-config/data-access-ibt-config';
import { EpossIbtConfigUiIbtConfigViewModule } from '@poss-web/eposs/ibt-config/ui-ibt-config-view';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedLocationMappingDataAccessLocationMappingModule } from '@poss-web/shared/location-mapping/data-access-location-mapping';
import { SelectionDialogService } from '@poss-web/shared/components/ui-selection-dialog';

const routes: Routes = [
  {
    path: '',
    component: IbtConigurationDetailComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    SharedComponentsUiLoaderModule,
    CommonCustomMaterialModule,
    EpossIbtConfigUiIbtConfigDetailModule,
    RouterModule.forChild(routes),
    EpossIbtConfigDataAccessIbtConfigModule,
    EpossIbtConfigUiIbtConfigViewModule,
    SharedLocationMappingDataAccessLocationMappingModule
  ],
  declarations: [IbtConigurationDetailComponent],
  providers: [SelectionDialogService]
})
export class EpossIbtConfigFeatureIbtConfigDetailModule {}
