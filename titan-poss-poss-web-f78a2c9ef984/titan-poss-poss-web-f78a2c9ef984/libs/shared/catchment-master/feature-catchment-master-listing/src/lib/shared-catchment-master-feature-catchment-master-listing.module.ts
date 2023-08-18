import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiCardListModule } from '@poss-web/shared/components/ui-card-list';

import { SharedCatchmentMasterDataAccessCatchmentMasterModule } from '@poss-web/shared/catchment-master/data-access-catchment-master';

import { CatchmentListingComponent } from './catchment-listing.component';
import { SharedCatchmentMasterUiCatchmentMasterListModule } from '@poss-web/shared/catchment-master/ui-catchment-master-list';
import { SharedCatchmentMasterUiCatchmentMasterDetailModule } from '@poss-web/shared/catchment-master/ui-catchment-master-detail';

const routes: Routes = [
  {
    path: '',
    component: CatchmentListingComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiCardListModule,
    SharedCatchmentMasterDataAccessCatchmentMasterModule,
    SharedCatchmentMasterUiCatchmentMasterListModule,
    SharedCatchmentMasterUiCatchmentMasterDetailModule
  ],
  declarations: [CatchmentListingComponent]
})
export class SharedCatchmentMasterFeatureCatchmentMasterListingModule { }
