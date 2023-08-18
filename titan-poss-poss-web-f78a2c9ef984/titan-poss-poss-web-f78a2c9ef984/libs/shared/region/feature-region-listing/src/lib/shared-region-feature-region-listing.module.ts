import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegionListingComponent } from './region-listing.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiCardListModule } from '@poss-web/shared/components/ui-card-list';
import {
  SharedRegionUiRegionDetailModule,
  RegionDetailsComponent
} from '@poss-web/shared/region/ui-region-detail';
import { RouterModule } from '@angular/router';
import { SharedRegionDataAccessRegionModule } from '@poss-web/shared/region/data-access-region';
import { SharedRegionUiRegionListModule } from '@poss-web/shared/region/ui-region-list';
import { SharedRegionUiRegionViewModule } from '@poss-web/shared/region/ui-region-view';
const route = [
  { path: '', component: RegionListingComponent, pathMatch: 'full' }
];

@NgModule({
  declarations: [RegionListingComponent],
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    RouterModule.forChild(route),
    SharedComponentsUiLoaderModule,
    SharedComponentsUiCardListModule,
    SharedRegionUiRegionListModule,
    SharedRegionDataAccessRegionModule,
    SharedRegionUiRegionDetailModule,
    SharedRegionUiRegionViewModule
  ],
  entryComponents: [RegionDetailsComponent]
})
export class SharedRegionFeatureRegionListingModule {}
