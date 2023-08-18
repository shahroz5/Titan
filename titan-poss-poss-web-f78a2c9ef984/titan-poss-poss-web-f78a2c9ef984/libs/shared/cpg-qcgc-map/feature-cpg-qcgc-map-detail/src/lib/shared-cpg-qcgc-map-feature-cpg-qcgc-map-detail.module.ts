import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiCardListModule } from '@poss-web/shared/components/ui-card-list';
import { SharedCpgQcgcMapDataAccessCpgQcgcMapModule } from '@poss-web/shared/cpg-qcgc-map/data-access-cpg-qcgc-map';
import { SharedCpgQcgcMapUiCpgQcgcMapDetailModule } from '@poss-web/shared/cpg-qcgc-map/ui-cpg-qcgc-map-detail';
import { SharedCpgQcgcMapUiCpgQcgcMapViewModule } from '@poss-web/shared/cpg-qcgc-map/ui-cpg-qcgc-map-view';

import { CpgQcgcMapDetailsMainComponent } from './cpg-qcgc-map-details-main.component';

const routes: Routes = [
  {
    path: '',
    component: CpgQcgcMapDetailsMainComponent
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
    SharedCpgQcgcMapUiCpgQcgcMapDetailModule,
    SharedCpgQcgcMapUiCpgQcgcMapViewModule
  ],
  declarations: [CpgQcgcMapDetailsMainComponent]
})
export class SharedCpgQcgcMapFeatureCpgQcgcMapDetailModule {}
