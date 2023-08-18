import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiCardListModule } from '@poss-web/shared/components/ui-card-list';

import { SharedCpgQcgcMapDataAccessCpgQcgcMapModule } from '@poss-web/shared/cpg-qcgc-map/data-access-cpg-qcgc-map'
import { SharedCpgQcgcMapUiCpgQcgcMapListModule } from '@poss-web/shared/cpg-qcgc-map/ui-cpg-qcgc-map-list'

import { CpgQcgcMapListingComponent } from './cpg-qcgc-map-listing.component';


const routes: Routes = [
  {
    path: '',
    component: CpgQcgcMapListingComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiCardListModule,
    SharedCpgQcgcMapDataAccessCpgQcgcMapModule,
    SharedCpgQcgcMapUiCpgQcgcMapListModule
  ],
  declarations: [CpgQcgcMapListingComponent],
})
export class SharedCpgQcgcMapFeatureCpgQcgcMapListingModule { }
