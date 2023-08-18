import { SharedLocationSettingsDataAccessLocationSettingsModule } from '@poss-web/shared/location-settings/data-access-location-settings';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoneListingComponent } from './stone-listing/stone-listing.component';
import { RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedStoneUiStoneListModule } from '@poss-web/shared/stone/ui-stone-list';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedStoneDataAccessStoneModule } from '@poss-web/shared/stone/data-access-stone';
import { SharedStoneUiStoneHeaderFormModule } from '@poss-web/shared/stone/ui-stone-header-form';
const route = [
  { path: '', component: StoneListingComponent, pathMatch: 'full' }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedStoneUiStoneListModule,
    SharedStoneDataAccessStoneModule,
    SharedStoneUiStoneHeaderFormModule,
    SharedLocationSettingsDataAccessLocationSettingsModule
  ],
  declarations: [StoneListingComponent]
})
export class SharedStoneFeatureStoneListingModule {}
