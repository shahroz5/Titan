import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedLocationMasterDataAccessLocationMasterModule } from '@poss-web/shared/location-master/data-access-location-master';
import { SharedLocationMasterUiLocationMasterDetailModule } from '@poss-web/shared/location-master/ui-location-master-detail';
import { SharedLocationMasterUiLocationMasterViewModule } from '@poss-web/shared/location-master/ui-location-master-view';

import { LocationMasterComponent } from './location-master.component';

const routes: Routes = [
  {
    path: '',
    component: LocationMasterComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedLocationMasterDataAccessLocationMasterModule,
    SharedLocationMasterUiLocationMasterDetailModule,
    SharedLocationMasterUiLocationMasterViewModule
  ],
  declarations: [LocationMasterComponent]
})
export class SharedLocationMasterFeatureLocationMasterDetailModule {}
