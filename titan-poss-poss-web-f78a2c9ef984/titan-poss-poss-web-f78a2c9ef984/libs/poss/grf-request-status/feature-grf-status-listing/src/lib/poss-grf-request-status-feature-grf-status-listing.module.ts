import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router'
import { GrfStatusListingComponent } from './grf-status-listing/grf-status-listing.component';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedToolbarFeatureToolbarModule } from '@poss-web/shared/toolbar/feature-toolbar';
import { PossGrfRequestStatusDataAccessGrfRequestModule } from '@poss-web/poss/grf-request-status/data-access-grf-request';
import {PossGrfRequestStatusUiRequestListModule} from '@poss-web/poss/grf-request-status/ui-request-list'

@NgModule({
  imports: [CommonModule,
    RouterModule.forChild([{ path: '', component:GrfStatusListingComponent}]),
    PossGrfRequestStatusUiRequestListModule,
    PossGrfRequestStatusDataAccessGrfRequestModule,
    SharedToolbarFeatureToolbarModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule
  ],
  declarations: [GrfStatusListingComponent],
  exports: [GrfStatusListingComponent]
})
export class PossGrfRequestStatusFeatureGrfStatusListingModule {}
