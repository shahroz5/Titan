import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiCardListModule } from '@poss-web/shared/components/ui-card-list';
import { SharedLocationMasterDataAccessLocationMasterModule } from '@poss-web/shared/location-master/data-access-location-master'
import { SharedLocationMasterUiLocationMasterListModule } from '@poss-web/shared/location-master/ui-location-master-list'

import { LocationListingComponent } from './location-listing.component';

const routes: Routes = [
  {
    path: '',
    component: LocationListingComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiCardListModule,
    SharedLocationMasterDataAccessLocationMasterModule,
    SharedLocationMasterUiLocationMasterListModule
  ],
  declarations: [LocationListingComponent]
})
export class SharedLocationMasterFeatureLocationMasterListingModule { }
