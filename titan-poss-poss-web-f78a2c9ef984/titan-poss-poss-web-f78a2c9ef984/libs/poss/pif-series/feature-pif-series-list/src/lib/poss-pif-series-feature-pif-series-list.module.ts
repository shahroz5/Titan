import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PIFSeriesListComponent } from './pif-series-list/pif-series-list.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { PossPifSeriesDataAccessPifSeriesModule } from '@poss-web/poss/pif-series/data-access-pif-series';
import { PossPifSeriesUiPifSeriesItemsModule } from '@poss-web/poss/pif-series/ui-pif-series-items';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
const routes: Routes = [
  {
    path: '',
    component: PIFSeriesListComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CommonCustomMaterialModule,
    PossPifSeriesDataAccessPifSeriesModule,
    PossPifSeriesUiPifSeriesItemsModule,
    SharedComponentsUiLoaderModule
  ],
  declarations: [PIFSeriesListComponent]
})
export class PossPifSeriesFeaturePifSeriesListModule {}
