import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeightToleranceListingComponent } from './weight-tolerance-listing/weight-tolerance-listing.component';
import { Route, RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { EpossWeightToleranceDataAccessWeightToleranceModule } from '@poss-web/eposs/weight-tolerance/data-access-weight-tolerance';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { FormsModule } from '@angular/forms';
import { EpossWeightToleranceUiWeightToleranceListingModule } from '@poss-web/eposs/weight-tolerance/ui-weight-tolerance-listing';
const routes: Route[] = [
  {
    path: '',
    component: WeightToleranceListingComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    RouterModule.forChild(routes),
    EpossWeightToleranceDataAccessWeightToleranceModule,
    EpossWeightToleranceUiWeightToleranceListingModule
  ],
  declarations: [WeightToleranceListingComponent]
})
export class EpossWeightToleranceFeatureWeightToleranceListingModule {}
