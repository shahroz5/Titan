import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';

import { SharedBrandUiBrandDetailModule } from '@poss-web/shared/brand/ui-brand-detail';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';

import { EpossTepStoneConfigDataAccessTepStoneConfigModule } from '@poss-web/eposs/tep-stone-config/data-access-tep-stone-config';
import { EpossTepStoneConfigUiTepStoneConfigDetailModule } from '@poss-web/eposs/tep-stone-config/ui-tep-stone-config-detail';

import { TepStoneConfigDetailComponent } from './tep-stone-config-detail.component';
import { EpossTepStoneConfigUiTepStoneConfigViewModule } from '@poss-web/eposs/tep-stone-config/ui-tep-stone-config-view';
import { SelectionDialogService } from '@poss-web/shared/components/ui-selection-dialog';
import { SharedLocationMappingDataAccessLocationMappingModule } from '@poss-web/shared/location-mapping/data-access-location-mapping';
import { EpossRequestApprovalsDataAccessRequestApprovalsModule } from '@poss-web/eposs/request-approvals/data-access-request-approvals'; // temp
const routes: Route[] = [
  {
    path: '',
    component: TepStoneConfigDetailComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedBrandUiBrandDetailModule,
    RouterModule.forChild(routes),
    EpossTepStoneConfigDataAccessTepStoneConfigModule,
    EpossTepStoneConfigUiTepStoneConfigDetailModule,
    EpossTepStoneConfigUiTepStoneConfigViewModule,
    SharedLocationMappingDataAccessLocationMappingModule,
    EpossRequestApprovalsDataAccessRequestApprovalsModule
  ],
  declarations: [TepStoneConfigDetailComponent],
  providers: [SelectionDialogService]
})
export class EpossTepStoneConfigFeatureTepStoneConfigDetailModule {}
