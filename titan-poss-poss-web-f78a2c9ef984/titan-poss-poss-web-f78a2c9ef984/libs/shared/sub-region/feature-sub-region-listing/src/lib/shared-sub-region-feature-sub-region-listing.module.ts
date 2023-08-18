import { NgModule } from '@angular/core';
import { SharedComponentsUiDynamicFormModule } from '@poss-web/shared/components/ui-dynamic-form';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedRegionDataAccessRegionModule } from '@poss-web/shared/region/data-access-region';
import { RouterModule } from '@angular/router';
import { SubRegionListingComponent } from './sub-region-listing.component';
import { SharedSubRegionDataAccessSubRegionModule } from '@poss-web/shared/sub-region/data-access-sub-region';
import {
  SharedSubRegionUiSubRegionDetailModule,
  SubRegionDetailsComponent
} from '@poss-web/shared/sub-region/ui-sub-region-detail';
import { SharedComponentsUiCardListModule } from '@poss-web/shared/components/ui-card-list';
import { SharedSubRegionUiSubRegionListModule } from '@poss-web/shared/sub-region/ui-sub-region-list';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedSubRegionUiSubRegionViewModule } from '@poss-web/shared/sub-region/ui-sub-region-view';
const route = [
  { path: '', component: SubRegionListingComponent, pathMatch: 'full' }
];
@NgModule({
  declarations: [SubRegionListingComponent, SubRegionDetailsComponent],
  imports: [
    CommonCustomMaterialModule,
    RouterModule.forChild(route),
    SharedComponentsUiLoaderModule,
    SharedRegionDataAccessRegionModule,
    SharedComponentsUiCardListModule,
    SharedSubRegionDataAccessSubRegionModule,
    SharedSubRegionUiSubRegionDetailModule,
    SharedComponentsUiDynamicFormModule,
    SharedSubRegionUiSubRegionListModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedSubRegionUiSubRegionViewModule
  ],
  entryComponents: [SubRegionDetailsComponent]
})
export class SharedSubRegionFeatureSubRegionListingModule {}
