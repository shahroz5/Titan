import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatureGrfListingComponent } from './feature-grf-listing/feature-grf-listing.component';
import { Routes, RouterModule, Route } from '@angular/router';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedToolbarFeatureToolbarModule } from '@poss-web/shared/toolbar/feature-toolbar';
import { EpossGrfManualRequestDataAccessGrfRequestModule } from '@poss-web/eposs/grf-manual-request/data-access-grf-request';
import {EpossGrfManualRequestUiRequestListModule} from '@poss-web/eposs/grf-manual-request/ui-request-list'
const routes: Route[] = [
  {
    path: '',
    component: FeatureGrfListingComponent
  }
];
@NgModule({
  imports: [CommonModule,
    RouterModule.forChild(routes),
    EpossGrfManualRequestDataAccessGrfRequestModule,
    SharedToolbarFeatureToolbarModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    EpossGrfManualRequestUiRequestListModule
  ],
  declarations: [FeatureGrfListingComponent]
})
export class EpossGrfManualRequestFeatureGrfRequestListingModule {}
