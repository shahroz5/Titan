import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { WeightToleranceListingItemComponent } from './weight-tolerance-listing-item/weight-tolerance-listing-item.component';
import { WeightToleranceListingItemsComponent } from './weight-tolerance-listing-items/weight-tolerance-listing-items.component';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiToggleButtonModule
  ],
  declarations: [
    WeightToleranceListingItemComponent,
    WeightToleranceListingItemsComponent
  ],
  exports: [
    WeightToleranceListingItemComponent,
    WeightToleranceListingItemsComponent
  ]
})
export class EpossWeightToleranceUiWeightToleranceListingModule {}
